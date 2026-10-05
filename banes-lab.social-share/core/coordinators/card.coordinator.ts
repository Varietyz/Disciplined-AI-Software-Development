import {
    CARD_PARAMETER,
    ERROR_FLAG,
    FILE_SEPARATOR,
    PROFILE_PARAMETER,
    READY_FLAG,
    RENDER_HOOK,
    STEP_FLAG,
    WORK_FOLDER,
} from "#configuration/constants/card.constants";
import type { CaptureJob, CaptureOptions } from "#types/stage.types";
import type { CardSpec, Profile } from "#types/card.types";
import {
    EMPTY_SCREENSHOT,
    NAVIGATION_FAILED,
    NO_BROWSER,
    NO_DEVTOOLS,
    STAGE_FAILED,
    STAGE_NOT_READY,
    SUBJECT_SEPARATOR,
} from "#configuration/strings/card.strings";
import { OUTPUT_RATE, OUTPUT_SCALES, PROFILES } from "#configuration/configs/card.config";
import { devtoolsEndpoint, openSession } from "@banes-lab/build-scripts/core/adapters/browser.adapter.ts";
import { encodeLoop, gifFrom, videoFrom } from "#core/adapters/image.adapter";
import { freshProfile, launchBrowser, settleBrowser } from "@banes-lab/build-scripts/core/factories/browser.factory.ts";
import { motionOf, stillOf } from "#core/converters/image.converter";
import type { RenderedImage } from "#types/image.types";
import type { Session } from "@banes-lab/build-scripts/types/browser.types.ts";
import { absolutePath } from "@ssot/paths";
import { findBrowser } from "@banes-lab/build-scripts/core/resolvers/browser.resolver.ts";
import { hashOf } from "#core/persistence/image.persistence";
import { holdCaptureLock } from "#core/persistence/export.persistence";
import { samplesOf } from "#core/timers/stage.timer";
import { sizeOf } from "#core/converters/filename.converter";
import { wait } from "@banes-lab/build-scripts/core/timers/base.timer.ts";

const BROWSER_TIMEOUT_MS = 60_000;
const READY_POLL_MS = 100;
const READY_ATTEMPTS = 300;
const PNG_BASE64 = "base64";

const inSequence = async function inSequence<T, R>(
    items: readonly T[],
    step: (item: T) => Promise<R>,
): Promise<readonly R[]> {
    return items.reduce<Promise<readonly R[]>>(
        async (previous, item) => [...(await previous), await step(item)],
        Promise.resolve([]),
    );
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const describeException = function describeException(details: Record<string, unknown>): string {
    const { exception, text } = details;
    const description = isRecord(exception) ? exception["description"] : undefined;
    return typeof description === "string" ? description : String(text);
};

const evaluate = async function evaluate(session: Session, expression: string): Promise<unknown> {
    const reply = await session.send("Runtime.evaluate", { awaitPromise: true, expression, returnByValue: true });
    const { exceptionDetails, result } = reply;
    if (isRecord(exceptionDetails)) {
        throw new Error(STAGE_FAILED + SUBJECT_SEPARATOR + describeException(exceptionDetails));
    }
    if (!isRecord(result)) {
        throw new Error(STAGE_FAILED + SUBJECT_SEPARATOR + expression);
    }
    return result["value"];
};

const awaitReady = async function awaitReady(session: Session, attempt = 0): Promise<void> {
    const failure = await evaluate(session, `window.${ERROR_FLAG} ?? null`);
    if (typeof failure === "string") {
        throw new TypeError(STAGE_FAILED + SUBJECT_SEPARATOR + failure);
    }
    if ((await evaluate(session, `window.${READY_FLAG} === true`)) === true) {
        return;
    }
    if (attempt >= READY_ATTEMPTS) {
        const step = await evaluate(session, `window.${STEP_FLAG} ?? null`);
        throw new Error(STAGE_NOT_READY + SUBJECT_SEPARATOR + String(step));
    }
    await wait(READY_POLL_MS);
    await awaitReady(session, attempt + 1);
};

const captureFrame = async function captureFrame(session: Session, profile: Profile, frame: number): Promise<Buffer> {
    await evaluate(session, `window.${RENDER_HOOK}(${String(frame)})`);
    const shot = await session.send("Page.captureScreenshot", {
        clip: { height: profile.height, scale: 1, width: profile.width, x: 0, y: 0 },
        format: "png",
    });
    const { data } = shot;
    if (typeof data !== "string" || data.length === 0) {
        throw new Error(EMPTY_SCREENSHOT + SUBJECT_SEPARATOR + String(frame));
    }
    return Buffer.from(data, PNG_BASE64);
};

const captureProfile = async function captureProfile(
    session: Session,
    options: CaptureOptions,
    spec: CardSpec,
    profile: Profile,
): Promise<readonly RenderedImage[]> {
    await session.send("Emulation.setDeviceMetricsOverride", {
        deviceScaleFactor: 1,
        height: profile.height,
        mobile: false,
        width: profile.width,
    });
    const query = new URLSearchParams([
        [CARD_PARAMETER, spec.id],
        [PROFILE_PARAMETER, profile.id],
    ]);
    const url = `${options.url}?${query.toString()}`;
    const { errorText } = await session.send("Page.navigate", { url });
    if (typeof errorText === "string") {
        throw new TypeError(NAVIGATION_FAILED + SUBJECT_SEPARATOR + url + SUBJECT_SEPARATOR + errorText);
    }
    await awaitReady(session);
    const samples = spec.timeline.frames > 1 ? samplesOf(spec.timeline, OUTPUT_RATE) : [];
    const frames = await inSequence(samples, async (sample) => captureFrame(session, profile, sample));
    const key = await captureFrame(session, profile, spec.timeline.keyFrame);
    const hash = hashOf(spec, profile);
    const master =
        frames.length > 1
            ? await encodeLoop(frames, absolutePath("builds.root", WORK_FOLDER, spec.id + FILE_SEPARATOR + profile.id))
            : null;
    return inSequence(OUTPUT_SCALES, async (scale) => {
        const size = sizeOf(profile, scale);
        return {
            animation: master === null ? null : await gifFrom(master, size, spec.timeline),
            card: spec.id,
            hash,
            motion: await motionOf(frames, spec.timeline, size),
            profile: profile.id,
            scale,
            still: await stillOf(key, size),
            video: master === null ? null : await videoFrom(master, size),
        };
    });
};

const captureAll = async function captureAll(
    session: Session,
    options: CaptureOptions,
    jobs: readonly CaptureJob[],
): Promise<readonly RenderedImage[]> {
    const rendered = await inSequence(jobs, async (job) => {
        const images = await captureProfile(session, options, job.spec, job.profile);
        await options.onCaptured?.(images);
        return images;
    });
    return rendered.flat();
};

const needsGpu = function needsGpu(jobs: readonly CaptureJob[]): boolean {
    return jobs.some((job) => job.spec.layers.some((layer) => layer.kind === "shader"));
};

export const captureCards = async function captureCards(
    options: CaptureOptions,
    jobs: readonly CaptureJob[],
): Promise<readonly RenderedImage[]> {
    const binary = findBrowser(null);
    if (binary === null) {
        throw new Error(NO_BROWSER);
    }
    const release = holdCaptureLock();
    const profile = freshProfile(absolutePath("builds.root"));
    const child = launchBrowser(binary, {
        height: Math.max(...PROFILES.map((candidate) => candidate.height)),
        profileDir: profile,
        software: !(options.gpu || needsGpu(jobs)),
        width: Math.max(...PROFILES.map((candidate) => candidate.width)),
    });
    try {
        return await settleBrowser(child, async () => {
            const endpoint = await devtoolsEndpoint(profile, BROWSER_TIMEOUT_MS);
            if (endpoint === null) {
                throw new Error(NO_DEVTOOLS);
            }
            const session = await openSession(endpoint, true);
            await session.send("Page.enable");
            await session.send("Runtime.enable");
            const rendered = await captureAll(session, options, jobs);
            session.close();
            return rendered;
        });
    } finally {
        release();
    }
};

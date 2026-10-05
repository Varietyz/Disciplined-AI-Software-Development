import type { DiagramProgress, DiagramWalk } from "#types/diagram.types";
import {
    NO_BROWSER,
    STAGE_NOT_READY,
    diagramFailed,
    diagramRelaunch,
    diagramStalled,
    noEndpoint,
    noMarkup,
    stageThrew,
} from "#configuration/strings/diagram.strings";
import { devtoolsEndpoint, openSession } from "#core/adapters/browser.adapter";
import { freshProfile, launchBrowser, settleBrowser } from "#core/factories/browser.factory";
import type { Session } from "#types/browser.types";
import { absolutePath } from "@ssot/paths";
import { discoverSources } from "#core/loaders/diagram.loader";
import { findBrowser } from "#core/resolvers/browser.resolver";
import { isRecord } from "#core/selectors/base.selector";
import { openStage } from "#core/adapters/diagram.adapter";
import process from "node:process";
import { wait } from "#core/timers/base.timer";
import { withWalk } from "#core/converters/diagram.converter";
import { writeAssets } from "#core/persistence/diagram.persistence";

const STAGE_WIDTH = 1600;
const STAGE_HEIGHT = 1200;
const BROWSER_TIMEOUT_MS = 60_000;
const READY_POLL_MS = 100;
const READY_ATTEMPTS = 300;
const DIAGRAM_ID = "diagram";
const RENDER_LAUNCHES = 3;

const replyValue = function replyValue(reply: Record<string, unknown>): unknown {
    const details = reply["exceptionDetails"];
    if (isRecord(details)) {
        const thrown = details["exception"];
        const text = isRecord(thrown) && typeof thrown["description"] === "string" ? thrown["description"] : "";
        throw new Error(stageThrew(text.length > 0 ? text : String(details["text"])));
    }
    const { result } = reply;
    return isRecord(result) ? result["value"] : undefined;
};

const evaluate = async function evaluate(session: Session, expression: string): Promise<unknown> {
    return replyValue(await session.send("Runtime.evaluate", { awaitPromise: true, expression, returnByValue: true }));
};

const awaitReady = async function awaitReady(session: Session, attempt = 0): Promise<void> {
    if ((await evaluate(session, "window.diagramsReady === true")) === true) {
        return;
    }
    if (attempt >= READY_ATTEMPTS) {
        throw new Error(STAGE_NOT_READY);
    }
    await wait(READY_POLL_MS);
    await awaitReady(session, attempt + 1);
};

const LINE_END = "\n";

const headOf = function headOf(source: string): string {
    const [first = ""] = source.split(LINE_END);
    return first.trim();
};

const messageOf = function messageOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
};

const markupOf = function markupOf(reply: Record<string, unknown>, index: number, source: string): unknown {
    try {
        return replyValue(reply);
    } catch (error) {
        throw new Error(diagramFailed(index, headOf(source), messageOf(error)), { cause: error });
    }
};

const renderOne = async function renderOne(session: Session, index: number, source: string): Promise<Error | string> {
    const id = `${DIAGRAM_ID}-${String(index)}`;
    const call = `renderDiagram(${JSON.stringify(id)}, ${JSON.stringify(source)})`;
    const reply = await session
        .send("Runtime.evaluate", { awaitPromise: true, expression: call, returnByValue: true })
        .catch((error: unknown) => new Error(messageOf(error)));
    if (reply instanceof Error) {
        return reply;
    }
    const markup = markupOf(reply, index, source);
    if (typeof markup !== "string" || markup.length === 0) {
        throw new Error(noMarkup(index));
    }
    return markup;
};

const renderAll = async function renderAll(
    session: Session,
    sources: readonly string[],
    done: ReadonlyMap<string, string>,
    index = 0,
): Promise<DiagramProgress> {
    const source = sources.at(index);
    if (source === undefined) {
        return { reason: "", rendered: done, stalledAt: null };
    }
    if (done.has(source)) {
        return renderAll(session, sources, done, index + 1);
    }
    const markup = await renderOne(session, index, source);
    if (markup instanceof Error) {
        return { reason: markup.message, rendered: done, stalledAt: index };
    }
    return renderAll(session, sources, new Map([...done, [source, markup]]), index + 1);
};

const renderThrough = async function renderThrough(
    binary: string,
    stageUrl: string,
    sources: readonly string[],
    done: ReadonlyMap<string, string>,
): Promise<DiagramProgress> {
    const profile = freshProfile(absolutePath("builds.root"));
    const child = launchBrowser(binary, {
        height: STAGE_HEIGHT,
        profileDir: profile,
        software: true,
        width: STAGE_WIDTH,
    });
    return settleBrowser(child, async (handle) => {
        const endpoint = await devtoolsEndpoint(profile, BROWSER_TIMEOUT_MS);
        if (endpoint === null) {
            throw new Error(noEndpoint(binary, profile, handle.exitCode()));
        }
        const session = await openSession(endpoint, false);
        await session.send("Page.enable");
        await session.send("Runtime.enable");
        await session.send("Page.navigate", { url: stageUrl });
        await awaitReady(session);
        const progress = await renderAll(session, sources, done);
        session.close();
        return progress;
    });
};

const renderFrom = async function renderFrom(
    binary: string,
    stageUrl: string,
    sources: readonly string[],
    done: ReadonlyMap<string, string>,
    launch: number,
): Promise<ReadonlyMap<string, string>> {
    const progress = await renderThrough(binary, stageUrl, sources, done);
    if (progress.stalledAt === null) {
        return progress.rendered;
    }
    if (launch >= RENDER_LAUNCHES) {
        throw new Error(diagramStalled(progress.stalledAt, headOf(sources[progress.stalledAt] ?? ""), launch));
    }
    process.stdout.write(diagramRelaunch(progress.stalledAt, progress.reason));
    return renderFrom(binary, stageUrl, sources, progress.rendered, launch + 1);
};

export const renderDiagrams = async function renderDiagrams(
    sources: readonly string[],
): Promise<ReadonlyMap<string, string>> {
    if (sources.length === 0) {
        return new Map();
    }
    const binary = findBrowser(null);
    if (binary === null) {
        throw new Error(NO_BROWSER);
    }
    const stage = await openStage();
    try {
        return await renderFrom(binary, stage.url, sources, new Map(), 1);
    } finally {
        stage.close();
    }
};

export const buildDiagrams = async function buildDiagrams(walk: DiagramWalk): Promise<number> {
    const sources = await discoverSources();
    const rendered = await renderDiagrams(sources);
    const walked = new Map([...rendered].map(([source, markup]) => [source, withWalk(markup, walk)] as const));
    writeAssets(absolutePath("app.diagrams"), walked);
    return rendered.size;
};

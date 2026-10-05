import { EMPTY_FRAME, NO_DEVTOOLS, summaryLine } from "#configuration/strings/viewport.strings";
import {
    VIEWPORT_DEFAULTS,
    VIEWPORT_PLATFORM,
    VIEWPORT_RULES,
    VIEWPORT_TOUCH_POINTS,
    VIEWPORT_USER_AGENT,
} from "#configuration/configs/viewport.config";
import { VIEWPORT_PROBE, auditPage, scrollThrough } from "#core/probes/viewport.probe";
import type { ViewportOptions, ViewportResult } from "#types/viewport.types";
import { auditExpression, resultLines, scrollExpression } from "#core/formatters/viewport.formatter";
import { auditOf, hasFinding, shotNameOf } from "#core/converters/viewport.converter";
import { devtoolsEndpoint, openSession } from "@banes-lab/build-scripts/core/adapters/browser.adapter.ts";
import { freshProfile, launchBrowser, settleBrowser } from "@banes-lab/build-scripts/core/factories/browser.factory.ts";
import { writeReport, writeShot } from "#core/persistence/viewport.persistence";
import type { Session } from "@banes-lab/build-scripts/types/browser.types.ts";
import process from "node:process";
import { serveBuiltSite } from "#core/adapters/viewport.adapter";
import { wait } from "@banes-lab/build-scripts/core/timers/base.timer.ts";

const AUDIT_EXPRESSION = auditExpression(auditPage, VIEWPORT_RULES, VIEWPORT_PROBE);
const SCROLL_EXPRESSION = scrollExpression(scrollThrough, VIEWPORT_RULES);

const emulatePhone = async function emulatePhone(session: Session, options: ViewportOptions): Promise<void> {
    await session.send("Page.enable");
    await session.send("Runtime.enable");
    await session.send("Emulation.setDeviceMetricsOverride", {
        deviceScaleFactor: VIEWPORT_DEFAULTS.scale,
        height: options.height,
        mobile: true,
        width: options.width,
    });
    await session.send("Emulation.setUserAgentOverride", {
        platform: VIEWPORT_PLATFORM,
        userAgent: VIEWPORT_USER_AGENT,
    });
    await session.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: VIEWPORT_TOUCH_POINTS });
};

const auditRoute = async function auditRoute(
    session: Session,
    options: ViewportOptions,
    origin: string,
    route: string,
): Promise<ViewportResult> {
    await session.send("Page.navigate", { url: origin + route });
    await wait(options.settleMs);
    await session.send("Runtime.evaluate", { awaitPromise: true, expression: SCROLL_EXPRESSION, returnByValue: true });
    const reply = await session.send("Runtime.evaluate", { expression: AUDIT_EXPRESSION, returnByValue: true });
    const { result } = reply;
    const audit = auditOf(typeof result === "object" && result !== null ? Reflect.get(result, "value") : null);
    if (audit === null) {
        throw new Error(JSON.stringify(reply["exceptionDetails"] ?? reply));
    }
    const { data } = await session.send("Page.captureScreenshot", { format: "png" });
    if (typeof data !== "string" || data.length === 0) {
        throw new Error(EMPTY_FRAME);
    }
    writeShot(options.outDir, shotNameOf(route), data);
    return { audit, route };
};

const auditInSequence = async function auditInSequence(
    session: Session,
    options: ViewportOptions,
    origin: string,
    routes: readonly string[],
): Promise<readonly ViewportResult[]> {
    return routes.reduce<Promise<readonly ViewportResult[]>>(async (previous, route) => {
        const done = await previous;
        const result = await auditRoute(session, options, origin, route);
        process.stdout.write(resultLines(result));
        return [...done, result];
    }, Promise.resolve([]));
};

export const auditRoutes = async function auditRoutes(
    binary: string,
    options: ViewportOptions,
    root: string,
    routes: readonly string[],
): Promise<boolean> {
    const site = await serveBuiltSite(root);
    const profile = freshProfile(options.outDir);
    const child = launchBrowser(binary, {
        height: options.height,
        profileDir: profile,
        software: options.software,
        width: options.width,
    });
    try {
        return await settleBrowser(child, async () => {
            const endpoint = await devtoolsEndpoint(profile, options.timeoutMs);
            if (endpoint === null) {
                process.stderr.write(NO_DEVTOOLS);
                return false;
            }
            const session = await openSession(endpoint, false);
            await emulatePhone(session, options);
            const results = await auditInSequence(session, options, site.origin, routes);
            session.close();
            writeReport(options.outDir, results);
            const failing = results.filter((result) => hasFinding(result.audit)).length;
            process.stdout.write(summaryLine(failing, results.length));
            return failing === 0;
        });
    } finally {
        site.close();
    }
};

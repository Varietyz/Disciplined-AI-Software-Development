import { NO_DEVTOOLS, clickedLine } from "#configuration/strings/snapshot.strings";
import { devtoolsEndpoint, openSession } from "@banes-lab/build-scripts/core/adapters/browser.adapter.ts";
import { dirname, resolve } from "node:path";
import { freshProfile, launchBrowser, settleBrowser } from "@banes-lab/build-scripts/core/factories/browser.factory.ts";
import type { Session } from "@banes-lab/build-scripts/types/browser.types.ts";
import type { SnapshotOptions } from "#types/snapshot.types";
import process from "node:process";
import { wait } from "@banes-lab/build-scripts/core/timers/base.timer.ts";
import { writeArtifacts } from "#core/persistence/snapshot.persistence";

const HERE = ".";

const settleAndClick = async function settleAndClick(session: Session, options: SnapshotOptions): Promise<void> {
    if (options.clickAt === null) {
        await wait(options.settleMs);
        return;
    }
    await wait(Math.min(options.clickAfterMs, options.settleMs));
    const [x = 0, y = 0] = options.clickAt;
    const spot = { button: "left", clickCount: 1, x, y };
    await session.send("Input.dispatchMouseEvent", { ...spot, type: "mousePressed" });
    await session.send("Input.dispatchMouseEvent", { ...spot, type: "mouseReleased" });
    process.stdout.write(clickedLine(x, y));
    await wait(Math.max(0, options.settleMs - options.clickAfterMs));
};

const captureThrough = async function captureThrough(session: Session, options: SnapshotOptions): Promise<string> {
    await session.send("Page.enable");
    await session.send("Runtime.enable");
    await session.send("Emulation.setDeviceMetricsOverride", {
        deviceScaleFactor: 1,
        height: options.height,
        mobile: false,
        width: options.width,
    });
    await session.send("Page.navigate", { url: options.url });
    await settleAndClick(session, options);
    if (options.out === null) {
        return "";
    }
    const { data } = await session.send("Page.captureScreenshot", { format: "png" });
    return typeof data === "string" ? data : "";
};

export const capturePage = async function capturePage(binary: string, options: SnapshotOptions): Promise<boolean> {
    const profile = freshProfile(resolve(dirname(options.out ?? options.log ?? HERE)));
    const child = launchBrowser(binary, {
        height: options.height,
        profileDir: profile,
        software: options.software,
        width: options.width,
    });
    return settleBrowser(child, async () => {
        const endpoint = await devtoolsEndpoint(profile, options.timeoutMs);
        if (endpoint === null) {
            process.stderr.write(NO_DEVTOOLS);
            return false;
        }
        const session = await openSession(endpoint, true);
        const data = await captureThrough(session, options);
        const records = session.records();
        session.close();
        return writeArtifacts(options, data, records);
    });
};

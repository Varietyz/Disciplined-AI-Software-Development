import type { BrowserHandle, BrowserWindow } from "#types/browser.types";
import { type ChildProcess, spawn } from "node:child_process";
import {
    EXIT_WAIT_MS,
    PROFILE_PREFIX,
    PROFILE_REMOVE_RETRIES,
    PROFILE_RETRY_DELAY_MS,
} from "#configuration/constants/browser.constants";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { browserStartFailed } from "#configuration/strings/browser.strings";
import { join } from "node:path";
import { once } from "node:events";
import process from "node:process";
import { terminateTree } from "#core/adapters/server.adapter";
import { wait } from "#core/timers/base.timer";

export const freshProfile = function freshProfile(root: string): string {
    mkdirSync(root, { recursive: true });
    return mkdtempSync(join(root, PROFILE_PREFIX));
};

const WINDOWS = "win32";

const softwareFlags: readonly string[] = ["--headless=new", "--use-gl=angle", "--use-angle=swiftshader"];

const hardwareFlags: readonly string[] = ["--enable-features=Vulkan"];

export const browserArguments = function browserArguments(window: BrowserWindow): string[] {
    return [
        ...(window.software ? softwareFlags : hardwareFlags),
        "--remote-debugging-port=0",
        `--user-data-dir=${window.profileDir}`,
        `--window-size=${String(window.width)},${String(window.height)}`,
        "--hide-scrollbars",
        "--mute-audio",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--ignore-certificate-errors",
        "--allow-insecure-localhost",
        "about:blank",
    ];
};

const isRunning = function isRunning(child: ChildProcess): boolean {
    return child.pid !== undefined && child.exitCode === null && child.signalCode === null;
};

const stopped = async function stopped(child: ChildProcess): Promise<void> {
    if (!isRunning(child) || child.pid === undefined) {
        return;
    }
    const exit = once(child, "exit");
    terminateTree(child.pid);
    await Promise.race([exit, wait(EXIT_WAIT_MS)]);
};

const asError = function asError(reason: unknown): Error {
    return reason instanceof Error ? reason : new Error(String(reason));
};

export const settleBrowser = async function settleBrowser<T>(
    handle: BrowserHandle,
    work: (handle: BrowserHandle) => Promise<T>,
): Promise<T> {
    const [outcome] = await Promise.allSettled([work(handle)]);
    const [closing] = await Promise.allSettled([handle.close()]);
    if (outcome.status === "fulfilled") {
        if (closing.status === "rejected") {
            throw asError(closing.reason);
        }
        return outcome.value;
    }
    const primary = asError(outcome.reason);
    if (closing.status === "rejected") {
        throw new AggregateError([primary, asError(closing.reason)], primary.message);
    }
    throw primary;
};

export const launchBrowser = function launchBrowser(binary: string, window: BrowserWindow): BrowserHandle {
    const child = spawn(binary, browserArguments(window), { detached: process.platform !== WINDOWS, stdio: "ignore" });
    child.on("error", (cause: Error) => {
        process.stderr.write(browserStartFailed(binary, cause.message));
    });
    return {
        close: async (): Promise<void> => {
            await stopped(child);
            rmSync(window.profileDir, {
                force: true,
                maxRetries: PROFILE_REMOVE_RETRIES,
                recursive: true,
                retryDelay: PROFILE_RETRY_DELAY_MS,
            });
        },
        exitCode: (): number | null => child.exitCode,
    };
};

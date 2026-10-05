import type { BrowserHandle, BrowserWindow } from "@banes-lab/build-scripts/types/browser.types.ts";
import {
    browserArguments,
    freshProfile,
    launchBrowser,
    settleBrowser,
} from "@banes-lab/build-scripts/core/factories/browser.factory.ts";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const WINDOW: BrowserWindow = { height: 10, profileDir: "profile", software: true, width: 20 };
const MISSING = join(tmpdir(), "no-such-browser-binary");

describe("browserArguments", () => {
    it("asks the system for a free devtools port, and carries the profile and the viewport", () => {
        const args = browserArguments(WINDOW);
        expect(args).toContain("--remote-debugging-port=0");
        expect(args).toContain("--user-data-dir=profile");
        expect(args).toContain("--window-size=20,10");
    });

    it("renders headless in software unless gpu rendering is asked for", () => {
        const software = browserArguments(WINDOW);
        expect(software).toContain("--headless=new");
        expect(software).toContain("--use-angle=swiftshader");
    });

    it("renders gpu work in a headed window on Vulkan, because headless Chrome exposes no hardware WebGPU adapter", () => {
        const hardware = browserArguments({ ...WINDOW, software: false });
        expect(hardware).not.toContain("--headless=new");
        expect(hardware).not.toContain("--use-angle=swiftshader");
        expect(hardware).toContain("--enable-features=Vulkan");
    });
});

describe("launchBrowser", () => {
    it("closes a browser that never started and removes its profile with everything in it", async () => {
        const profileDir = freshProfile(tmpdir());
        writeVerbatim(join(profileDir, "Local State"), "{}");
        const handle = launchBrowser(MISSING, { ...WINDOW, profileDir });
        await handle.close();
        expect(existsSync(profileDir)).toBe(false);
    });
});

const PRIMARY = "the work failed";
const CLEANUP = "the profile stayed locked";

const handleClosing = function handleClosing(closes: boolean): BrowserHandle {
    return {
        close: async () => {
            await Promise.resolve();
            if (!closes) {
                throw new Error(CLEANUP);
            }
        },
        exitCode: () => null,
    };
};

const failing = async function failing(): Promise<number> {
    await Promise.resolve();
    throw new Error(PRIMARY);
};

describe("settleBrowser", () => {
    it("returns the work's value once the browser has closed", async () => {
        await expect(
            settleBrowser(handleClosing(true), async () => {
                await Promise.resolve();
                return 1;
            }),
        ).resolves.toBe(1);
    });

    it("keeps the work's failure first, and a cleanup failure beside it rather than in its place", async () => {
        await expect(settleBrowser(handleClosing(true), failing)).rejects.toThrow(PRIMARY);
        const both = await settleBrowser(handleClosing(false), failing).catch((error: unknown) => error);
        expect(both).toBeInstanceOf(AggregateError);
        expect(both instanceof AggregateError ? both.errors.map((held: Error) => held.message) : []).toStrictEqual([
            PRIMARY,
            CLEANUP,
        ]);
        expect(both instanceof Error ? both.message : "").toBe(PRIMARY);
    });

    it("fails on a cleanup failure after work that succeeded", async () => {
        await expect(
            settleBrowser(handleClosing(false), async () => {
                await Promise.resolve();
                return 1;
            }),
        ).rejects.toThrow(CLEANUP);
    });
});

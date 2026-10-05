import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { SNAPSHOT_ARGV } from "@project/scripts/configuration/configs/snapshot.config.ts";
import type { SnapshotOptions } from "@project/scripts/types/snapshot.types.ts";
import { argvOf } from "@govlab/argv";
import { capturePage } from "@project/scripts/core/coordinators/snapshot.coordinator.ts";
import { join } from "node:path";
import { launchBrowser } from "@banes-lab/build-scripts/core/factories/browser.factory.ts";
import { logLines } from "@project/scripts/core/formatters/snapshot.formatter.ts";
import { readOptions } from "@project/scripts/core/converters/snapshot.converter.ts";
import { tmpdir } from "node:os";
import { writeArtifacts } from "@project/scripts/core/persistence/snapshot.persistence.ts";

vi.mock("@banes-lab/build-scripts/core/factories/browser.factory.ts", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    launchBrowser: vi.fn(() => ({ close: vi.fn<() => Promise<void>>().mockResolvedValue(), exitCode: () => null })),
}));

const scratch = function scratch(): string {
    return mkdtempSync(join(tmpdir(), "snapshot-"));
};

const options = function options(overrides: Partial<SnapshotOptions>): SnapshotOptions {
    return {
        browser: null,
        clickAfterMs: 0,
        clickAt: null,
        height: 1,
        log: null,
        out: null,
        settleMs: 0,
        software: true,
        timeoutMs: 0,
        url: "https://site.test",
        width: 1,
        ...overrides,
    };
};

describe("readOptions", () => {
    it("refuses a call without a url or without any artifact", () => {
        expect(readOptions(argvOf(SNAPSHOT_ARGV, ["--out", "a.png"]))).toBeNull();
        expect(readOptions(argvOf(SNAPSHOT_ARGV, ["--url", "https://site.test"]))).toBeNull();
    });

    it("reads every flag with its default", () => {
        const read = readOptions(
            argvOf(SNAPSHOT_ARGV, ["--url", "https://site.test", "--log", "c.log", "--click", "3,4"]),
        );
        expect(read?.clickAt).toStrictEqual([3, 4]);
        expect(read?.software).toBe(true);
        expect(read?.width).toBe(1440);
    });

    it("drops a malformed click and honors the gpu flag", () => {
        const read = readOptions(argvOf(SNAPSHOT_ARGV, ["--url", "u", "--out", "o.png", "--click", "x", "--gpu"]));
        expect(read?.clickAt).toBeNull();
        expect(read?.software).toBe(false);
    });
});

describe("logLines", () => {
    it("tallies repeated records and appends their source", () => {
        const record = { level: "error", source: "a.js:1", text: "boom" };
        expect(logLines([record, record, { level: "log", source: "", text: "hi" }])).toBe(
            "error: boom [x2]  (a.js:1)\nlog: hi\n",
        );
    });
});

describe("writeArtifacts", () => {
    it("writes the log and the screenshot", () => {
        const directory = scratch();
        const out = join(directory, "shot.png");
        const log = join(directory, "console.log");
        const written = writeArtifacts(options({ log, out }), Buffer.from("png").toString("base64"), []);
        expect(written).toBe(true);
        expect(readFileSync(out, "utf8")).toBe("png");
        expect(existsSync(log)).toBe(true);
    });

    it("refuses an empty frame when a screenshot was asked for", () => {
        const out = join(scratch(), "shot.png");
        expect(writeArtifacts(options({ out }), "", [])).toBe(false);
    });
});

describe("capturePage", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("kills the browser and reports failure when devtools never answers", async () => {
        vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockRejectedValue(new Error("refused")));
        const out = join(scratch(), "shot.png");
        await expect(capturePage("browser", options({ out }))).resolves.toBe(false);
        expect(launchBrowser).toHaveBeenCalled();
    });
});

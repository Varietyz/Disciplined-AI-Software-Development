import { ELLIPSIS, STEP_SUMMARY_LIMIT } from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    createByteProgress,
    createJournal,
    createProgress,
} from "@banes-lab/deploy/core/reporters/journal.reporter.ts";
import { SECONDS_SUFFIX } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";

describe("createJournal", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("collects logged and marked steps into the summary", () => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const journal = createJournal();
        journal.log("first");
        journal.mark("second");
        const summary = journal.summary();
        expect(summary).toContain("first");
        expect(summary).toContain("second");
        expect(summary).toContain(SECONDS_SUFFIX);
    });

    it("truncates a summary past the step limit", () => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const journal = createJournal();
        journal.log("x".repeat(STEP_SUMMARY_LIMIT + 1));
        expect(journal.summary().endsWith(ELLIPSIS)).toBe(true);
    });

    it("draws a live bar in a terminal and records each quarter in the journal", () => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const journal = createJournal();
        const written: string[] = [];
        let clock = 0;
        const sink = { isTTY: true, write: (text: string) => written.push(text) > 0 };
        const progress = createProgress(
            journal,
            { label: "Upload", size: 100, total: 4, unit: "file(s)" },
            sink,
            () => clock,
        );
        for (const step of [1, 2, 3, 4]) {
            clock = step * 1000;
            progress.advance(1, 25, step === 4);
        }
        progress.finish();
        expect(written.some((text) => text.startsWith("\r"))).toBe(true);
        expect(written.at(-1)).toBe("\n");
        const summary = journal.summary();
        expect(summary).toContain("Upload");
        expect(summary).toContain("100%: 3 of 4 file(s)");
        expect(summary).toContain("1 failed");
    });

    it("writes one line per step when the output is not a terminal", () => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const written: string[] = [];
        const sink = { isTTY: false, write: (text: string) => written.push(text) > 0 };
        const progress = createProgress(
            createJournal(),
            { label: "Upload", size: 100, total: 100, unit: "file(s)" },
            sink,
            () => 1,
        );
        for (let step = 0; step < 12; step += 1) {
            progress.advance(1, 1, false);
        }
        expect(written).toHaveLength(2);
        expect(written.every((text) => text.endsWith("\n") && !text.startsWith("\r"))).toBe(true);
    });

    it("turns a byte stream into one transfer that completes once", () => {
        vi.spyOn(process.stdout, "write").mockReturnValue(true);
        const journal = createJournal();
        const sink = { isTTY: false, write: () => true };
        const download = createByteProgress(journal, "Backup download", "archive", sink, () => 1);
        download.step(50, 100);
        download.step(100, 100);
        download.step(100, 100);
        download.finish();
        expect(journal.summary()).toContain("100%: 1 of 1 archive");
    });

    it("routes errors to the console", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        const journal = createJournal();
        journal.error("bad");
        expect(error).toHaveBeenCalledWith("bad");
    });
});

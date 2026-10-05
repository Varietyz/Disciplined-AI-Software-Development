import { expect, test, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { runLint } from "@govlab/quality/core/coordinators/concern.coordinator.ts";
import { tmpdir } from "node:os";

test("runLint runs one concern's tools and returns the exit code of the run", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "concern-run-"));
    const written: string[] = [];
    const spy = vi.spyOn(process.stdout, "write").mockImplementation((chunk: Uint8Array | string): boolean => {
        written.push(String(chunk));
        return true;
    });
    try {
        const code = await runLint(
            {
                auto: false,
                backup: false,
                concern: "lua",
                config: null,
                dryRun: false,
                ecosystems: [],
                fix: false,
                paths: ["missing"],
                reporter: "json",
            },
            { env: process.env, root },
        );
        const report: unknown = JSON.parse(written.join(""));
        const summary = typeof report === "object" && report !== null && "summary" in report ? report.summary : null;
        const errors = typeof summary === "object" && summary !== null && "errors" in summary ? summary.errors : null;
        expect(typeof errors).toBe("number");
        expect(code).toBe(typeof errors === "number" && errors > 0 ? 1 : 0);
    } finally {
        spy.mockRestore();
    }
});

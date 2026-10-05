import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { runInherited, superviseJob } from "@govlab/docs/core/adapters/shell.adapter.ts";
import { join } from "node:path";
import process from "node:process";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const OK = 0;
const TIMEOUT_CODE = 124;
const PROBE_EXIT = 3;
const SLOW_MS = 5000;
const SHORT_TIMEOUT_MS = 200;
const GENEROUS_TIMEOUT_MS = 20_000;

const root = mkdtempSync(join(tmpdir(), "docs-shell-"));

afterAll(() => {
    rmSync(root, { force: true, maxRetries: 5, recursive: true, retryDelay: 100 });
});

const job = function job(label: string, args: string[], timeoutMs: number): Parameters<typeof superviseJob>[0] {
    return { args, command: process.execPath, cwd: process.cwd(), label, timeoutMs };
};

describe("superviseJob", () => {
    it("returns the child's exit code and captured output", async () => {
        const result = await superviseJob(
            job("probe", ["-e", "process.stdout.write('job-probe')"], GENEROUS_TIMEOUT_MS),
        );
        expect(result).toMatchObject({ code: OK, timedOut: false });
        expect(result.out).toContain("job-probe");
    });

    it("kills a job that outruns its timeout and says so", async () => {
        const result = await superviseJob(
            job("slow", ["-e", `setTimeout(() => {}, ${String(SLOW_MS)})`], SHORT_TIMEOUT_MS),
        );
        expect(result).toMatchObject({ code: TIMEOUT_CODE, timedOut: true });
        expect(result.out).toContain("timed out");
    });

    it("reports a command it cannot start as a failure", async () => {
        const result = await superviseJob({
            ...job("missing", [], GENEROUS_TIMEOUT_MS),
            command: join(root, "not-an-executable"),
        });
        expect(result.code).not.toBe(OK);
        expect(result.label).toBe("missing");
    });
});

describe("runInherited", () => {
    it("returns the script's exit status", () => {
        const script = join(root, "exit.mjs");
        writeVerbatim(script, `process.exit(${String(PROBE_EXIT)});\n`);
        expect(runInherited(script, [])).toBe(PROBE_EXIT);
    });
});

import { describe, expect, it, vi } from "vitest";
import { runCaptured, runLive, runTee } from "@govlab/pipeline/core/adapters/shell.adapter.ts";
import process from "node:process";
import { shellFor } from "@govlab/pipeline/core/resolvers/shell.resolver.ts";

const OK = 0;
const FAIL_STATUS = 3;
const MARKER = "executor-probe";
const NO_SUCH_COMMAND = "definitely-not-an-installed-binary-xyz";
const SHELL = shellFor(process.platform);

const nodeEval = function nodeEval(source: string): string {
    return `node -e "${source}"`;
};

const silenced = async function silenced(run: () => Promise<unknown>): Promise<void> {
    const out = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const err = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
        await run();
    } finally {
        out.mockRestore();
        err.mockRestore();
    }
};

describe("runCaptured", () => {
    it("returns the exit code and the captured stdout", async () => {
        const outcome = await runCaptured(SHELL, nodeEval(`process.stdout.write('${MARKER}')`));
        expect(outcome.code).toBe(OK);
        expect(outcome.out).toContain(MARKER);
    });

    it("captures stderr into the same buffer, so a failure trace is kept", async () => {
        const outcome = await runCaptured(SHELL, nodeEval(`process.stderr.write('${MARKER}')`));
        expect(outcome.out).toContain(MARKER);
    });

    it("carries a non-zero exit through unchanged", async () => {
        const outcome = await runCaptured(SHELL, nodeEval(`process.exit(${String(FAIL_STATUS)})`));
        expect(outcome.code).toBe(FAIL_STATUS);
    });

    it("reports a failing exit for a command the shell cannot run", async () => {
        const outcome = await runCaptured(SHELL, NO_SUCH_COMMAND);
        expect(outcome.code).not.toBe(OK);
    });
});

describe("runLive", () => {
    it("returns the child's exit code", async () => {
        await silenced(async () => {
            await expect(runLive(SHELL, nodeEval(`process.stdout.write('${MARKER}')`))).resolves.toBe(OK);
        });
    });

    it("returns the failing status", async () => {
        const command = nodeEval(`process.exit(${String(FAIL_STATUS)})`);
        await silenced(async () => {
            await expect(runLive(SHELL, command)).resolves.toBe(FAIL_STATUS);
        });
    });
});

describe("runTee", () => {
    it("both relays and captures the child's output", async () => {
        const written: string[] = [];
        const spy = vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
            written.push(String(chunk));
            return true;
        });
        try {
            const outcome = await runTee(SHELL, nodeEval(`process.stdout.write('${MARKER}')`));
            expect(outcome.out).toContain(MARKER);
            expect(written.join("")).toContain(MARKER);
        } finally {
            spy.mockRestore();
        }
    });

    it("carries a non-zero exit through unchanged", async () => {
        const command = nodeEval(`process.exit(${String(FAIL_STATUS)})`);
        await silenced(async () => {
            await expect(runTee(SHELL, command)).resolves.toStrictEqual({ code: FAIL_STATUS, out: "" });
        });
    });
});

import { describe, it } from "vitest";
import { raiseRefused, relocateNotVenue } from "coordination-surface/tools/core/strings/venue.strings.ts";
import assert from "node:assert/strict";
import { runExclusive } from "coordination-surface/tools/core/orchestrators/invocation.orchestrator.ts";

class ExitError extends Error {
    public readonly code: number;

    public readonly printed: string;

    public constructor(code: number, printed: string) {
        super(`exited ${String(code)}`);
        this.name = "ExitError";
        this.code = code;
        this.printed = printed;
    }
}

const stubProcess = function stubProcess(argv: readonly string[]): () => void {
    const held = {
        argv: process.argv,
        exit: process.exit.bind(process),
        write: process.stdout.write.bind(process.stdout),
    };
    let printed = "";
    process.argv = ["node", "board.entrypoint.ts", ...argv];
    process.stdout.write = (chunk: Uint8Array | string): boolean => {
        printed += String(chunk);
        return true;
    };
    process.exit = (code?: number | string | null): never => {
        throw new ExitError(Number(code), printed);
    };
    return () => {
        process.argv = held.argv;
        process.exit = held.exit;
        process.stdout.write = held.write;
    };
};

const exclusive = async function exclusive(argv: readonly string[]): Promise<ExitError | null> {
    const restore = stubProcess(argv);
    try {
        await runExclusive({ absolute: "", caller: "A", target: "board.txt" });
        return null;
    } catch (error) {
        if (error instanceof ExitError) {
            return error;
        }
        throw error;
    } finally {
        restore();
    }
};

describe("runExclusive", () => {
    it("returns when no exclusive form is requested, and finishes with the first requested form's outcome", async () => {
        assert.equal(await exclusive([]), null);
        const finished = await exclusive(["--relocate", "notes.md"]);
        assert.deepEqual([finished?.code, finished?.printed], [2, raiseRefused(relocateNotVenue("notes.md"))]);
    });
});

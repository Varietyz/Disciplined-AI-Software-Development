import { FIELD_NEEDS_VALUE, operandsMissing } from "coordination-surface/tools/core/strings/board.strings.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { postComposable } from "coordination-surface/tools/core/coordinators/record.coordinator.ts";

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

const run = function run(argv: readonly string[]): ExitError | string | null {
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
    try {
        return postComposable({ absolute: "", caller: "A", target: "board.txt" });
    } catch (error) {
        if (error instanceof ExitError) {
            return error;
        }
        throw error;
    } finally {
        process.argv = held.argv;
        process.exit = held.exit;
        process.stdout.write = held.write;
    }
};

describe("postComposable", () => {
    it("posts nothing without a composable flag, and refuses a field named without its value", () => {
        assert.equal(run([]), null);
        const refused = run(["--field", "Status"]);
        assert.ok(refused instanceof ExitError);
        assert.deepEqual([refused.code, refused.printed], [2, operandsMissing([FIELD_NEEDS_VALUE])]);
    });
});

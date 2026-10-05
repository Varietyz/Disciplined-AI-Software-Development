import { describe, it } from "vitest";
import { dischargeNotVenue, venueNoRemoval } from "coordination-surface/tools/core/strings/board.strings.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tidyOf } from "coordination-surface/tools/core/coordinators/collapse.coordinator.ts";
import { tmpdir } from "node:os";

const VENUE = "probe.blocking.md";

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

const captured = function captured<T>(
    argv: readonly string[],
    run: () => T,
): { printed: string; result: ExitError | T } {
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
        const result = run();
        return { printed, result };
    } catch (error) {
        if (error instanceof ExitError) {
            return { printed: error.printed, result: error };
        }
        throw error;
    } finally {
        process.argv = held.argv;
        process.exit = held.exit;
        process.stdout.write = held.write;
    }
};

describe("tidyOf", () => {
    it("does nothing without a removal flag, refuses a removal on a venue, and reports a discharge outside one", () => {
        const absolute = join(tmpdir(), "coordination-absent", VENUE);
        assert.equal(captured([], () => tidyOf({ absolute, caller: "A", target: VENUE })).result, 0);

        const venue = captured(["--compress", "Status"], () => tidyOf({ absolute, caller: "A", target: VENUE }));
        assert.ok(venue.result instanceof ExitError);
        assert.deepEqual([venue.result.code, venue.printed], [2, venueNoRemoval(VENUE)]);

        const discharge = captured(["--discharge", "a clause"], () =>
            tidyOf({ absolute, caller: "A", target: "notes.md" }),
        );
        assert.deepEqual([discharge.result, discharge.printed], [2, dischargeNotVenue("notes.md")]);
    });
});

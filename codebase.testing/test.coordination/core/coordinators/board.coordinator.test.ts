import {
    admitWaiter,
    awaitChange,
    runBarrier,
    writingSeats,
} from "coordination-surface/tools/core/coordinators/board.coordinator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { currentWaiters } from "coordination-surface/tools/core/registries/board.registry.ts";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { watchAbsent } from "coordination-surface/tools/core/strings/board.strings.ts";
import { writeVerbatim } from "@govlab/canonical-write";

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

const NOW = 1_000_000;
const TIMEOUT = 5000;
const BOARD = "Agent A — ACTIVE\n  Owns: tools\nAgent B — ACTIVE\n  Owns: config\n";

const rootWithBoard = function rootWithBoard(): { root: string; board: string } {
    const root = mkdtempSync(join(tmpdir(), "coordination-board-"));
    const board = join(root, "collab.comms.active");
    writeVerbatim(board, BOARD);
    return { board, root };
};

describe("writingSeats", () => {
    it("keeps a parked seat and drops a seat with no claim and no recent interaction", () => {
        const { root } = rootWithBoard();
        assert.deepEqual(writingSeats(root, ["A", "B"], ["B"], NOW), ["B"]);
    });
});

describe("runBarrier", () => {
    it("reports the barrier open when the board is missing and nobody is counted", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-barrier-"));
        assert.equal(runBarrier(root, join(root, "absent.board"), NOW).code, 1);
    });
});

describe("admitWaiter", () => {
    it("parks the first waiter, then refuses a second one when every counted seat is already parked", () => {
        const { root, board } = rootWithBoard();
        const first = admitWaiter(root, board, { agent: "A", now: NOW, pid: 7, target: board, timeout: TIMEOUT });
        assert.equal(first.code, 0);
        assert.equal(first.id, `7-${String(NOW)}`);
        assert.deepEqual(
            currentWaiters(root, NOW).map((waiter) => waiter.agent),
            ["A"],
        );

        const second = admitWaiter(root, board, { agent: "B", now: NOW, pid: 8, target: board, timeout: TIMEOUT });
        assert.equal(second.code, 3);
        assert.equal(second.id, "");
    });
});

const stubProcess = function stubProcess(): () => void {
    const held = {
        argv: process.argv,
        exit: process.exit.bind(process),
        write: process.stdout.write.bind(process.stdout),
    };
    let printed = "";
    process.argv = ["node", "board.entrypoint.ts"];
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

describe("awaitChange", () => {
    it("refuses to wait on a surface that does not exist", async () => {
        const restore = stubProcess();
        try {
            const target = "absent.board";
            const absolute = join(tmpdir(), "coordination-await-absent", target);
            await assert.rejects(awaitChange({ absolute, caller: "A", target }), (error: unknown) => {
                assert.ok(error instanceof ExitError);
                assert.deepEqual([error.code, error.printed], [2, watchAbsent(target)]);
                return true;
            });
        } finally {
            restore();
        }
    });
});

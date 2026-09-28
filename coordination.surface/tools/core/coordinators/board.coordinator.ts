import { argumentValue, finish } from "../readers/invocation.reader.ts";
import { currentWaiters, releaseWaiter, writeWaiters } from "../registries/board.registry.ts";
import { existsSync, readFileSync, statSync } from "node:fs";
import { isResolved, projectRoot, slotCount, surfacePath } from "../../../config/surface.config.ts";
import {
    waitAllParked,
    waitSolitary,
    watchAbsent,
    watchChanged,
    watchQuiet,
    watchRemoved,
    watching,
} from "../strings/board.strings.ts";
import type { Admission } from "../types/board.types.ts";
import type { Invocation } from "../types/invocation.types.ts";
import { activeSeats } from "../analyzers/board.analyzer.ts";
import { barrierState } from "../runners/board.runner.ts";
import { changesSince } from "../reporters/board.reporter.ts";
import { heldClaims } from "../registries/claim.registry.ts";
import { lastInteraction } from "../registries/snapshot.registry.ts";
import { resolve } from "node:path";

const NO_WAIT_FLAG = "--no-wait";

const SLOT_EXPIRY_MS = 3_600_000;

const POLL_MS = 1000;

interface Watch {
    readonly id: string;
    readonly absolute: string;
    readonly target: string;
    readonly baseline: number;
    readonly deadline: number;
    readonly timeout: number;
}

const livenessWindow = function livenessWindow(): number | null {
    if (!isResolved("convention", "run_live_window_ms")) {
        return null;
    }
    return slotCount("convention", "run_live_window_ms");
};

export const writingSeats = function writingSeats(
    repoRoot: string,
    seats: readonly string[],
    parked: readonly string[],
    now: number,
): string[] {
    const window = livenessWindow();
    if (window === null) {
        return [...seats];
    }

    const held = new Set(parked);
    const running = new Set(heldClaims(repoRoot).map((claim) => claim.agent));

    return seats.filter((seat) => {
        if (held.has(seat)) {
            return true;
        }
        if (running.has(seat)) {
            return true;
        }

        const stamped = lastInteraction(repoRoot, seat);
        return stamped > 0 && now - stamped < window;
    });
};

const rosterOf = function rosterOf(repoRoot: string, board: string, parked: readonly string[], now: number): number {
    if (!existsSync(board)) {
        return 0;
    }

    const index = resolve(repoRoot, surfacePath("agent_index"));
    const seated = activeSeats(readFileSync(board, "utf8"), existsSync(index) ? readFileSync(index, "utf8") : "");

    return writingSeats(repoRoot, seated, parked, now).length;
};

export const runBarrier = function runBarrier(
    repoRoot: string,
    board: string,
    now: number,
): { message: string; code: number } {
    const waiting = currentWaiters(repoRoot, now);
    return barrierState(
        rosterOf(
            repoRoot,
            board,
            waiting.map((entry) => entry.agent),
            now,
        ),
        waiting.length,
    );
};

export const admitWaiter = function admitWaiter(
    repoRoot: string,
    board: string,
    request: { agent: string; target: string; timeout: number; now: number; pid: number },
): Admission {
    const waiting = currentWaiters(repoRoot, request.now);
    const agents = rosterOf(
        repoRoot,
        board,
        waiting.map((entry) => entry.agent),
        request.now,
    );

    if (agents > 0 && waiting.length >= agents - 1) {
        const solitary = waiting.length === 0;

        return {
            code: 3,
            id: "",
            message: solitary ? waitSolitary(agents, waiting.length) : waitAllParked(agents, waiting.length),
        };
    }

    const id = `${String(request.pid)}-${String(request.now)}`;
    writeWaiters(repoRoot, [...waiting, { agent: request.agent, expiresAt: request.now + request.timeout, id }]);

    return {
        code: 0,
        id,
        message: watching(request.target, Math.round(request.timeout / 1000), waiting.length + 1, agents),
    };
};

const modifiedAt = function modifiedAt(path: string): number | null {
    if (!existsSync(path)) {
        return null;
    }
    return statSync(path).mtimeMs;
};

const sleep = async function sleep(ms: number): Promise<void> {
    await new Promise<void>((done) => {
        setTimeout(done, ms);
    });
};

const deliverSince = function deliverSince(absolute: string, named: string): void {
    process.stdout.write(changesSince(projectRoot(), absolute, argumentValue("--agent") ?? "", named));
};

const release = function release(id: string): void {
    releaseWaiter(projectRoot(), id, Date.now());
};

const poll = async function poll(watch: Watch): Promise<never> {
    if (Date.now() >= watch.deadline) {
        release(watch.id);
        process.stdout.write(watchQuiet(watch.target));
        deliverSince(watch.absolute, watch.target);
        process.exit(1);
    }

    await sleep(POLL_MS);
    const current = modifiedAt(watch.absolute);
    if (current === null) {
        release(watch.id);
        finish(watchRemoved(watch.target), 2);
    }

    if (current !== watch.baseline) {
        release(watch.id);
        const waited = Math.round((watch.timeout - (watch.deadline - Date.now())) / 1000);
        process.stdout.write(watchChanged(watch.target, waited));
        deliverSince(watch.absolute, watch.target);
        process.exit(0);
    }

    return poll(watch);
};

export const awaitChange = async function awaitChange({ absolute, caller, target }: Invocation): Promise<never> {
    if (process.argv.includes(NO_WAIT_FLAG)) {
        deliverSince(absolute, target);
        process.exit(0);
    }

    const baseline = modifiedAt(absolute);
    if (baseline === null) {
        finish(watchAbsent(target), 2);
    }

    const now = Date.now();
    const timeout = SLOT_EXPIRY_MS;
    const admission = admitWaiter(projectRoot(), resolve(projectRoot(), surfacePath("board")), {
        agent: caller,
        now,
        pid: process.pid,
        target,
        timeout,
    });

    process.stdout.write(admission.message);
    if (admission.code !== 0) {
        process.exit(admission.code);
    }

    return poll({ absolute, baseline, deadline: now + timeout, id: admission.id, target, timeout });
};

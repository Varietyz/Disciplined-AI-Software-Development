import type { ClaimStanding, RunClaim } from "../types/claim.types.ts";
import { RELEASE_UNIDENTIFIED, runsAbandoned, runsInFlight } from "../strings/claim.strings.ts";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fieldOf, tryParse } from "../readers/json.reader.ts";
import { isResolved, slotCount } from "../../../config/surface.config.ts";

import { GENERATED_DIR } from "../constants/path.constants.ts";
import { hostname } from "node:os";
import { join } from "node:path";
import { safeKey } from "../formatters/text.formatter.ts";

const CLAIMS = "run.claims";

const TAIL = ".claim.generated.json";

const UNKNOWN = "unknown";

const WHOLE = "whole";

const NO_PROCESS = "ESRCH";

const LIVENESS_PROBE = 0;

const MILLISECONDS = 1000;

const claimRoot = function claimRoot(repoRoot: string): string {
    return join(repoRoot, GENERATED_DIR, CLAIMS);
};

const keyOf = function keyOf(agent: string, at: number): string {
    return `${safeKey(agent)}-${String(at)}`;
};

const liveWindow = function liveWindow(): number | null {
    return isResolved("convention", "run_live_window_ms") ? slotCount("convention", "run_live_window_ms") : null;
};

const textOf = function textOf(value: unknown, fallback: string): string {
    return typeof value === "string" ? value : fallback;
};

const countOf = function countOf(value: unknown): number {
    return typeof value === "number" ? value : 0;
};

const claimOf = function claimOf(root: string, entry: string): RunClaim[] {
    const read = tryParse(readFileSync(join(root, entry), "utf8"));
    if (read === null) {
        return [{ agent: UNKNOWN, at: 0, host: UNKNOWN, id: entry, pid: 0, scope: UNKNOWN }];
    }

    const { value } = read;
    if (typeof value !== "object" || value === null) {
        return [];
    }

    return [
        {
            agent: textOf(fieldOf(value, "agent"), UNKNOWN),
            at: countOf(fieldOf(value, "at")),
            host: textOf(fieldOf(value, "host"), UNKNOWN),
            id: entry.slice(0, entry.length - TAIL.length),
            pid: countOf(fieldOf(value, "pid")),
            scope: textOf(fieldOf(value, "scope"), UNKNOWN),
        },
    ];
};

export const heldClaims = function heldClaims(repoRoot: string): RunClaim[] {
    const root = claimRoot(repoRoot);
    if (!existsSync(root)) {
        return [];
    }
    return readdirSync(root)
        .filter((entry) => entry.endsWith(TAIL))
        .flatMap((entry) => claimOf(root, entry));
};

const covers = function covers(held: string, mine: string): boolean {
    return held === WHOLE || held === mine;
};

export const writeSetsOverlap = function writeSetsOverlap(held: string, mine: string): boolean {
    return held === WHOLE || mine === WHOLE || held === mine;
};

const codeOf = function codeOf(error: unknown): string {
    if (typeof error !== "object" || error === null) {
        return "";
    }
    return textOf(fieldOf(error, "code"), "");
};

const onThisHost = function onThisHost(claim: RunClaim): boolean {
    return claim.pid > 0 && claim.host !== UNKNOWN && claim.host === hostname();
};

const witnessedGone = function witnessedGone(claim: RunClaim): boolean {
    if (!onThisHost(claim)) {
        return false;
    }

    try {
        process.kill(claim.pid, LIVENESS_PROBE);
        return false;
    } catch (error) {
        return codeOf(error) === NO_PROCESS;
    }
};

const ageOf = function ageOf(claim: RunClaim, at: number): number | null {
    return claim.at === 0 ? null : at - claim.at;
};

const stillRunning = function stillRunning(claim: RunClaim, at: number, window: number | null): boolean {
    const age = ageOf(claim, at);
    return !witnessedGone(claim) && window !== null && age !== null && Math.abs(age) < window;
};

const described = function described(claim: RunClaim, at: number): string {
    const age = ageOf(claim, at);
    const since = age === null ? "" : ` ${String(Math.round(age / MILLISECONDS))}s ago`;
    return `${claim.scope} by ${claim.agent}${since}`;
};

const precedes = function precedes(claim: RunClaim, at: number, agent: string): boolean {
    return claim.at === at ? claim.agent.localeCompare(agent, "en") < 0 : claim.at < at;
};

const writeClaim = function writeClaim(root: string, mine: string, entry: Omit<RunClaim, "id">): void {
    mkdirSync(root, { recursive: true });
    writeFileSync(join(root, `${mine}${TAIL}`), `${JSON.stringify(entry, null, 4)}\n`, "utf8");
};

export const claimStanding = function claimStanding(
    repoRoot: string,
    scope: string,
    at: number,
    agent: string,
): ClaimStanding {
    const root = claimRoot(repoRoot);
    const mine = keyOf(agent, at);
    writeClaim(root, mine, { agent, at, host: hostname(), pid: process.pid, scope });

    const others = heldClaims(repoRoot).filter((claim) => claim.id !== mine);
    const window = liveWindow();
    const running = others.filter((claim) => stillRunning(claim, at, window));
    const dead = others.filter((claim) => !running.includes(claim));

    for (const claim of dead) {
        rmSync(join(root, `${claim.id}${TAIL}`), { force: true });
    }

    const live = running.map((claim) => described(claim, at));
    const incomplete = dead.map((claim) => described(claim, at));
    const yields = running.some((claim) => precedes(claim, at, agent));
    const lines = [
        ...(live.length > 0 ? [runsInFlight(yields, live)] : []),
        ...(incomplete.length > 0 ? [runsAbandoned(incomplete)] : []),
    ];

    return {
        covering: running.filter((claim) => covers(claim.scope, scope)).map((claim) => described(claim, at)),
        decision: yields ? "yield" : "proceed",
        incomplete,
        message: lines.length === 0 ? null : lines.join(". "),
        overlapping: running
            .filter((claim) => writeSetsOverlap(claim.scope, scope))
            .map((claim) => described(claim, at)),
    };
};

export const releaseStanding = function releaseStanding(repoRoot: string, agent: string, at: number): string | null {
    if (agent.length === 0 || at <= 0) {
        return RELEASE_UNIDENTIFIED;
    }

    const root = claimRoot(repoRoot);
    if (existsSync(root)) {
        rmSync(join(root, `${keyOf(agent, at)}${TAIL}`), { force: true });
    }
    return null;
};

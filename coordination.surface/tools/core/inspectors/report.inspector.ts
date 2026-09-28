import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fieldOf, tryParse } from "../readers/json.reader.ts";

import type { Finding } from "../types/segment.types.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import { REPORT_SUFFIX } from "../constants/report.constants.ts";
import { boardFinding } from "../factories/board.factory.ts";
import { resolve } from "node:path";

const GATE_PREFIX = "Gate — ";
const STATE_FIELD = "State:";
const PASSING = "PASS";
const FAILING = "RED";

interface StatedGate {
    readonly holder: string;
    readonly line: number;
    readonly stated: string;
}

const isCounted = function isCounted(authoritative: unknown, bypassed: unknown): boolean {
    return authoritative === true && (bypassed === undefined || bypassed === false);
};

const countedVerdict = function countedVerdict(value: unknown): [string, string] | null {
    if (typeof value !== "object" || value === null) {
        return null;
    }

    const tool = fieldOf(value, "tool");
    const verdict = fieldOf(value, "verdict");
    const counted = isCounted(fieldOf(value, "authoritative"), fieldOf(value, "bypassed"));
    const state = verdict === "pass" ? PASSING : FAILING;

    return counted && typeof tool === "string" && typeof verdict === "string" ? [tool, state] : null;
};

const readReport = function readReport(path: string): unknown {
    return tryParse(readFileSync(path, "utf8"))?.value ?? null;
};

const toolVerdicts = function toolVerdicts(repoRoot: string): Map<string, string> {
    const folder = resolve(repoRoot, GENERATED_DIR);
    if (!existsSync(folder)) {
        return new Map();
    }

    return new Map(
        readdirSync(folder)
            .filter((name) => name.endsWith(REPORT_SUFFIX))
            .map((name) => resolve(folder, name))
            .map((path) => countedVerdict(readReport(path)))
            .filter((entry): entry is [string, string] => entry !== null),
    );
};

const holderAfter = function holderAfter(trimmed: string, holder: string): string {
    return trimmed.startsWith(GATE_PREFIX) ? trimmed.slice(GATE_PREFIX.length).trim() : holder;
};

const statedGates = function statedGates(board: string): StatedGate[] {
    const out: StatedGate[] = [];
    let holder = "";

    for (const [index, raw] of board.split("\n").entries()) {
        const trimmed = raw.trim();
        const stated = holder !== "" && trimmed.startsWith(STATE_FIELD);
        if (stated) {
            out.push({ holder, line: index + 1, stated: trimmed.slice(STATE_FIELD.length).trim() });
        }
        holder = holderAfter(trimmed, stated ? "" : holder);
    }

    return out;
};

export const checkGateState = function checkGateState(board: string, repoRoot: string): Finding[] {
    const derived = toolVerdicts(repoRoot);

    return statedGates(board).flatMap((gate) => {
        const computed = derived.get(gate.holder);
        if (computed === undefined || computed === gate.stated) {
            return [];
        }

        return [
            boardFinding(
                "staleGateState",
                gate.line,
                gate.stated,
                `the board states ${gate.stated} while the authoritative run on disk resolves ${computed}`,
                `${computed}, derived from the report rather than transcribed`,
                "a State field is a verdict TRANSCRIBED from a run, which makes it a cache with no invalidation: it is true when written and false the moment any agent writes a file, and nothing reports the disagreement. The value is DERIVED — the report on disk carries the tool identity and the verdict, so the field has exactly one correct value at any moment. Healing is withheld deliberately: this board is written concurrently by every agent, a writer rewriting it from content that has moved loses another writer's work, and a gate that writes to it would be that construct with a gate's authority",
            ),
        ];
    });
};

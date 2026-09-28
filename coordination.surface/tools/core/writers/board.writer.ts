import type { CompressOutcome, SpanConflict, Witnessed } from "../types/board.types.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { compareSpans } from "../resolvers/board.resolver.ts";
import { recordContended } from "../strings/board.strings.ts";

export const refuse = function refuse(message: string, code: number): CompressOutcome {
    return { code, excised: [], message, write: null };
};

const contended = function contended(target: string, agent: string, conflict: SpanConflict): CompressOutcome {
    const changes = [
        ...conflict.added.map((line) => `  + ${line.trim().slice(0, 110)}\n`),
        ...conflict.removed.map((line) => `  - ${line.trim().slice(0, 110)}\n`),
    ];

    return { code: 1, excised: [], message: recordContended(target, agent, changes), write: null };
};

export const landWitnessed = function landWitnessed(
    witnessed: Witnessed,
    landed: CompressOutcome,
    retry: () => CompressOutcome,
): CompressOutcome {
    const witness = readFileSync(witnessed.absolute, "utf8");
    if (witness === witnessed.before) {
        writeFileSync(witnessed.absolute, witnessed.written, "utf8");
        return landed;
    }

    const conflict = compareSpans(witnessed.before, witness, witnessed.agent);
    return conflict.overlapping ? contended(witnessed.target, witnessed.agent, conflict) : retry();
};

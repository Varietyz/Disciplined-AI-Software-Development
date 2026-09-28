import type { GateOutcome } from "../types/gate.types.ts";

export const CLEAR_STATES: ReadonlySet<string> = new Set(["proven", "exempt"]);

const TREE_READ_NOTE = " · this kind's fixture leaves a declared read to the tree";

export const verdictKey = function verdictKey(rule: string, kind: string | undefined): string {
    return kind === undefined ? rule : `${rule}/${kind}`;
};

export const worstOf = function worstOf(held: string | undefined, arriving: string): string {
    if (held === undefined) {
        return arriving;
    }
    if (!CLEAR_STATES.has(held)) {
        return held;
    }
    return arriving;
};

export const worstVerdicts = function worstVerdicts(entries: readonly [string, string][]): Record<string, string> {
    const verdicts: Record<string, string> = {};
    for (const [key, state] of entries) {
        verdicts[key] = worstOf(verdicts[key], state);
    }
    return verdicts;
};

export const movedOf = function movedOf(
    verdicts: Readonly<Record<string, string>>,
    prior: Readonly<Record<string, string>>,
    exposed: readonly string[],
): string[] {
    const exposedKinds = new Set(exposed.map((entry) => entry.slice(0, entry.indexOf(":"))));
    return Object.entries(verdicts).flatMap(([kind, state]) => {
        const was = prior[kind];
        if (was === undefined || was === state) {
            return [];
        }
        const note = exposedKinds.has(kind) ? TREE_READ_NOTE : "";
        return [`${kind}: ${was} → ${state}${note}`];
    });
};

export const countIn = function countIn(outcomes: readonly GateOutcome[], state: string): number {
    return outcomes.filter((outcome) => outcome.state === state).length;
};

import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";
import { branchDisagrees, branchExercised, branchThrew } from "../strings/gate.strings.ts";
import type { GateOutcome } from "../types/gate.types.ts";
import { growFixtureTree } from "../generators/fixture.generator.ts";

interface Exercise {
    readonly observed: BranchObservation | null;
    readonly error: string;
}

const disagreements = function disagreements(observed: BranchObservation, expected: BranchObservation): string[] {
    const out: string[] = [];
    const keys = new Set([...Object.keys(expected), ...Object.keys(observed)]);

    for (const key of keys) {
        const seen = observed[key];
        const wanted = expected[key];
        if (seen === wanted) {
            continue;
        }
        out.push(`${key} ${String(seen)} where ${String(wanted)} is declared`);
    }

    return out;
};

const rendered = function rendered(observation: BranchObservation): string {
    return Object.entries(observation)
        .map(([key, value]) => `${key} ${String(value)}`)
        .join(" · ");
};

const exercise = function exercise(fixture: BranchFixture): Exercise {
    const tree = growFixtureTree(fixture.seed);
    try {
        return { error: "", observed: fixture.exercise(tree.root) };
    } catch (error) {
        return { error: String(error), observed: null };
    } finally {
        tree.release();
    }
};

export const judgeBranch = function judgeBranch(fixture: BranchFixture): GateOutcome {
    const { error, observed } = exercise(fixture);
    if (observed === null) {
        return { detail: branchThrew(error), rule: `${fixture.subject} · ${fixture.branch}`, state: "noisy" };
    }

    const apart = disagreements(observed, fixture.expect);
    if (apart.length > 0) {
        return {
            detail: branchDisagrees(apart.join(", ")),
            rule: `${fixture.subject} · ${fixture.branch}`,
            state: "silent",
        };
    }

    return {
        detail: branchExercised(rendered(observed)),
        rule: `${fixture.subject} · ${fixture.branch}`,
        state: "proven",
    };
};

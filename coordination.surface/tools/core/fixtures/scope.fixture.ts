import { AGGREGATE_REPORT, channelReportName, channelScopeOf } from "../reporters/rule.reporter.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const SCOPES = ["rule=surface", "tools/core/runners", "tools/core", "stage=content", "whole"];

function channelling(): BranchObservation {
    const names = SCOPES.map((scope) => channelReportName(scope));
    const recovered = names.map((name) => channelScopeOf(name));

    return {
        distinct: new Set(names).size,
        invertible: recovered.every((scope, at) => scope === SCOPES[at]),
        collides: names.includes(AGGREGATE_REPORT),
    };
}

function nesting(): BranchObservation {
    const inner = channelReportName("tools/core");
    const outer = channelReportName(inner);

    return {
        distinct: inner === outer ? 1 : 2,
        invertible: channelScopeOf(outer) === inner && channelScopeOf(inner) === "tools/core",
        collides: false,
    };
}

export const SCOPE_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "scope.transformer",
        branch: "every declared scope composing its own channel, recoverable from the name and never the whole-scope one",
        seed: [],
        exercise: () => channelling(),
        expect: { distinct: SCOPES.length, invertible: true, collides: false },
    },
    {
        subject: "scope.transformer",
        branch: "a scope whose text is itself a channel name, where an encoding that is not total would collide",
        seed: [],
        exercise: () => nesting(),
        expect: { distinct: 2, invertible: true, collides: false },
    },
];

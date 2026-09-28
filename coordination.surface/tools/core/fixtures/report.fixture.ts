import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { GENERATED_DIR } from "../constants/path.constants.ts";
import { AGGREGATE_REPORT, channelReportName, writePipelineReport } from "../reporters/rule.reporter.ts";
import type { PipelineReport } from "../types/rule.types.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

function report(scope: string, authoritative: boolean, moved: readonly string[], at = 2000): PipelineReport {
    return {
        tool: "govern",
        verdict: "pass",
        registered: 1,
        agent: "Z",
        at,
        scope,
        authoritative,
        scanned: 1,
        bypassed: false,
        mutated: false,
        mode: "held",
        written: [],
        escaped: [],
        unfulfilled: [],
        stages: [],
        reports: [],
        findings: [],
        moved: [...moved],
        derivations: {},
    };
}

function publishing(root: string, scope: string, authoritative: boolean, moved: readonly string[]): BranchObservation {
    writePipelineReport(root, report(scope, authoritative, moved));

    return {
        aggregate: existsSync(resolve(root, GENERATED_DIR, AGGREGATE_REPORT)),
        channel: existsSync(resolve(root, GENERATED_DIR, channelReportName(scope))),
    };
}

function superseding(root: string): BranchObservation {
    writePipelineReport(root, report("whole", true, [], 5000));
    writePipelineReport(root, report("whole", true, [], 1000));

    const held = JSON.parse(readFileSync(resolve(root, GENERATED_DIR, AGGREGATE_REPORT), "utf8")) as { at?: unknown };

    return {
        aggregate: held.at === 5000,
        channel: existsSync(resolve(root, GENERATED_DIR, channelReportName("whole-superseded"))),
    };
}

export const REPORT_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "rule.reporter",
        branch: "a whole-scope run older than the aggregate on disk, which neither replaces a newer measurement nor writes a second file beside it — the older run STREAMS, because a report is overwritten so it is always the truth after a run and there is one of it",
        seed: [],
        exercise: (root) => superseding(root),
        expect: { aggregate: true, channel: false },
    },
    {
        subject: "rule.reporter",
        branch: "a whole-scope run whose read set MOVED, which is the whole-scope derivation with its standing withdrawn",
        seed: [],
        exercise: (root) => publishing(root, "whole", true, ["a-peer-surface.md"]),
        expect: { aggregate: true, channel: false },
    },
    {
        subject: "rule.reporter",
        branch: "a narrowed run, which writes NOTHING — not over the aggregate and not beside it, because a second document about the aggregate's subject under a key derived from how the run was invoked is accumulation",
        seed: [],
        exercise: (root) => publishing(root, "rule=surface", false, []),
        expect: { aggregate: false, channel: false },
    },
];

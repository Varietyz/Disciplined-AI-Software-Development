import {
    claimedUnwritten,
    covered,
    healingHeld,
    joinedResult,
    narrowedRun,
    notMeasured,
    otherRuns,
    repairedWhileReading,
    runContended,
    scopeUnresolved,
    wroteOutsideScope,
} from "coordination-surface/tools/core/strings/pipeline.strings.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

type Case = readonly [string, readonly (number | string)[]];

const RUN = "B since 12:00 over tools/core";

const AGGREGATE = "pipeline.report.generated.json";

const unnamed = function unnamed(cases: readonly Case[]): string[] {
    return cases.flatMap(([message, operands]) =>
        operands.map(String).flatMap((operand) => (message.includes(operand) ? [] : [`${message} lacks ${operand}`])),
    );
};

describe("the pipeline's messages", () => {
    it("name the runs, paths, scopes and rules each one reports", () => {
        const cases: Case[] = [
            [healingHeld(1, [RUN]), [1, RUN]],
            [covered(1, [RUN]), [1, RUN]],
            [wroteOutsideScope(["docs/a.md"]), ["docs/a.md"]],
            [claimedUnwritten(["docs/b.md"]), ["docs/b.md"]],
            [scopeUnresolved("tools/absent"), ["tools/absent"]],
            [repairedWhileReading(["docs/c.md"]), ["docs/c.md"]],
            [runContended(2, ["docs/d.md"]), [2, "docs/d.md"]],
            [narrowedRun("kit/core", AGGREGATE), ["kit/core", AGGREGATE]],
            [notMeasured(["board", "venue"]), ["board", "venue"]],
            [otherRuns(RUN), [RUN]],
            [
                joinedResult({ agent: "B", findings: 3, scope: "whole", verdict: "fail" }, AGGREGATE),
                ["FAIL", "B", 3, "whole", AGGREGATE],
            ],
        ];
        assert.deepEqual(unnamed(cases), []);
    });
});

import {
    AGGREGATE_REPORT,
    channelReportName,
    channelScopeOf,
    joinLiveRun,
    supersedingRun,
    writePipelineReport,
    writeRuleReport,
} from "coordination-surface/tools/core/reporters/rule.reporter.ts";
import { describe, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

type PipelineReport = Parameters<typeof writePipelineReport>[1];
type RuleReport = Parameters<typeof writeRuleReport>[2];

const RULE_REPORT: RuleReport = {
    authoritative: true,
    findings: [],
    healed: [],
    invariant: "",
    rule: "board",
    scanned: 0,
    scope: "whole",
    stage: "content",
    verdict: "pass",
};

const PIPELINE_REPORT: PipelineReport = {
    agent: "A",
    at: 100,
    authoritative: true,
    bypassed: false,
    derivations: {},
    escaped: [],
    findings: [],
    mode: "healing",
    moved: [],
    mutated: false,
    registered: 0,
    reports: [],
    scanned: 0,
    scope: "whole",
    stages: [],
    tool: "govern",
    unfulfilled: [],
    verdict: "pass",
    written: [],
};

const aggregate = function aggregate(root: string, body: string): void {
    mkdirSync(join(root, GENERATED_DIR), { recursive: true });
    writeVerbatim(join(root, GENERATED_DIR, AGGREGATE_REPORT), body);
};

describe("channelReportName and channelScopeOf", () => {
    it("round-trip a scope through its channel report name, and read no scope from any other name", () => {
        assert.equal(channelScopeOf(channelReportName("kit/core")), "kit/core");
        assert.equal(channelScopeOf("board.report.generated.json"), null);
        assert.equal(channelScopeOf("pipeline..report.generated.json"), null);
    });
});

describe("the aggregate report", () => {
    it("writes a rule report, and writes the aggregate only for an authoritative run no later run superseded", async () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-pipeline-"));
        try {
            const rule = writeRuleReport(root, "board", RULE_REPORT);
            assert.ok(existsSync(rule));
            assert.equal(supersedingRun(root, 100), 0);
            aggregate(root, "{broken");
            assert.equal(supersedingRun(root, 100), 0);
            aggregate(root, JSON.stringify({ agent: "A", at: 200, findings: [], scope: "whole", verdict: "pass" }));
            assert.equal(supersedingRun(root, 100), 200);
            assert.equal(supersedingRun(root, 300), 0);

            assert.equal(writePipelineReport(root, { ...PIPELINE_REPORT, authoritative: false }), null);
            assert.equal(writePipelineReport(root, PIPELINE_REPORT), null);
            const written = writePipelineReport(root, { ...PIPELINE_REPORT, at: 300 });
            assert.equal(written?.endsWith(AGGREGATE_REPORT), true);

            const joined = await joinLiveRun(root, 250);
            assert.equal(joined.code, 0);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

import { afterAll, beforeAll, describe, it } from "vitest";
import {
    contradictedContracts,
    deleteReport,
    findingShapeGaps,
    isConstructShaped,
    missingFindingFields,
    missingReportIdentity,
    orphanReports,
    reportMissing,
    selfAuditedReports,
    unaccountedScopeGaps,
    unevaluableScopes,
    withdrawnStandings,
} from "coordination-surface/tools/core/validators/governance.validator.ts";
import { existsSync, mkdirSync, mkdtempSync, rmSync, utimesSync } from "node:fs";
import { GENERATED_DIR } from "coordination-surface/tools/core/constants/path.constants.ts";
import { REPORT_SUFFIX } from "coordination-surface/tools/core/constants/report.constants.ts";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const PAST = new Date("2020-01-01T00:00:00Z");

const writeReport = function writeReport(root: string, id: string, value: unknown): string {
    const path = join(root, GENERATED_DIR, `${id}${REPORT_SUFFIX}`);
    writeVerbatim(path, JSON.stringify(value));
    return path;
};

describe("isConstructShaped", () => {
    it("accepts a lowercase word and refuses a digit, a separator or nothing", () => {
        assert.equal(isConstructShaped("board"), true);
        assert.equal(isConstructShaped("board2"), false);
        assert.equal(isConstructShaped("two-words"), false);
        assert.equal(isConstructShaped(""), false);
    });
});

describe("the report checks", () => {
    let root = "";

    beforeAll(() => {
        root = mkdtempSync(join(tmpdir(), "coordination-governance-"));
        mkdirSync(join(root, GENERATED_DIR), { recursive: true });
        writeReport(root, "partial", { rule: "partial", scope: "all", stage: "content" });
        writeReport(root, "scalar", 3);
        writeReport(root, "gapped", { derivations: { reached: ["a", "b"], skippedVendored: ["c"] }, scanned: 5 });
        writeReport(root, "accounted", { derivations: { reached: ["a", "b"], skippedVendored: ["c"] }, scanned: 3 });
        writeReport(root, "unlisted", { derivations: { reached: 2 }, scanned: 4 });
        writeReport(root, "silent", { derivations: {}, scanned: 4, verdict: "PASS" });
        writeReport(root, "governance", { derivations: { names: [] }, scanned: 4, verdict: "PASS" });
        writeReport(root, "note", { rule: "note" });
        const stale = writeReport(root, "stale", { derivations: { names: ["docs/a.txt", "flat"] } });
        mkdirSync(join(root, "docs"));
        writeVerbatim(join(root, "docs", "a.txt"), "");
        utimesSync(stale, PAST, PAST);
    });

    afterAll(() => {
        rmSync(root, { force: true, recursive: true });
    });

    it("names a missing report and each identity field a present one lacks", () => {
        assert.equal(reportMissing(root, "partial"), false);
        assert.equal(reportMissing(root, "absent"), true);
        assert.deepEqual(missingReportIdentity(root, "partial"), ["authoritative", "verdict"]);
        assert.deepEqual(missingReportIdentity(root, "scalar"), ["scope", "authoritative", "verdict"]);
        assert.deepEqual(missingReportIdentity(root, "absent"), []);
    });

    it("lists a rule report no registered rule claims, and deletes a report by name", () => {
        assert.deepEqual(orphanReports(root, new Set(["other"])), [`partial${REPORT_SUFFIX}`]);
        assert.deepEqual(orphanReports(root, new Set(["partial"])), []);
        const doomed = `doomed${REPORT_SUFFIX}`;
        writeReport(root, "doomed", {});
        deleteReport(root, doomed);
        assert.equal(existsSync(join(root, GENERATED_DIR, doomed)), false);
    });

    it("reports a handed count the reached list and the named skips do not account for", () => {
        assert.deepEqual(unaccountedScopeGaps(root), [
            { handed: 5, named: 1, reached: 2, report: `gapped${REPORT_SUFFIX}` },
            { handed: 4, named: 0, reached: -1, report: `unlisted${REPORT_SUFFIX}` },
        ]);
    });

    it("reports a verdict over files with no published population, and a report the auditor wrote about itself", () => {
        assert.deepEqual(unevaluableScopes(root), [{ handed: 4, report: `silent${REPORT_SUFFIX}` }]);
        assert.deepEqual(selfAuditedReports(root, "governance"), [`governance${REPORT_SUFFIX}`]);
    });

    it("withdraws the standing of a report older than a surface it reached", () => {
        assert.deepEqual(withdrawnStandings(root), [
            { report: `stale${REPORT_SUFFIX}`, staleSurfaces: ["docs/a.txt"] },
        ]);
    });
});

describe("contradictedContracts", () => {
    it("reports a composite-keyed contract whose key carries a member without the separator", () => {
        const [message] = contradictedContracts({
            keys: { property: "composite-keyed", subject: "pairs" },
            other: { property: "flat", subject: "pairs" },
            pairs: ["a/b", "loose"],
        });
        assert.equal(message?.includes("loose"), true);
        assert.deepEqual(
            contradictedContracts({ keys: { property: "composite-keyed", subject: "pairs" }, pairs: ["a/b"] }),
            [],
        );
    });
});

describe("findingShapeGaps", () => {
    it("names each required field a finding-emitting source never declares", () => {
        const sources: Record<string, string> = {
            "a.ts": "findings.push({ rule: id, path });",
            "b.md": "findings.push({",
            "c.ts": "const quiet = 1;",
        };
        const read = (path: string): string => sources[path] ?? "";
        const paths = Object.keys(sources);
        assert.deepEqual(findingShapeGaps(paths, read, ["rule", "path", "locus"]), [{ field: "locus", path: "a.ts" }]);
        assert.deepEqual(missingFindingFields("a.ts", read, new Set(paths), ["rule", "stack"]), ["stack"]);
    });
});

import type { Finding, FindingBuilder } from "coordination-surface/tools/core/types/segment.types.ts";
import {
    checkRoleCoverage,
    checkRoleShape,
    roleFieldsFrom,
    roleSectionsFrom,
    roleSubsectionsFrom,
    unfilledMeasuredSections,
} from "coordination-surface/tools/core/inspectors/role.inspector.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const ERRORS = "## Measured errors";

const WINS = "## Measured wins";

const TEMPLATE = [
    "---",
    "letter: <LETTER>",
    "type: ROLE",
    "---",
    "# HOW THIS TEMPLATE IS USED",
    "# IDENTITY",
    "# REFUSES",
    ERRORS,
    "<one measured error per line>",
    WINS,
].join("\n");

const build: FindingBuilder = (kind, locus, actual, expected, decide): Finding => ({
    actual,
    expected,
    healed: false,
    line: 1,
    locus,
    path: "",
    remediation: { action: "declare", decide, deterministic: false, from: locus, target: "", to: null },
    rule: kind,
    stack: [],
});

const shapeOf = function shapeOf(findings: readonly Finding[]): string[][] {
    return findings.map((finding) => [finding.rule, finding.locus]);
};

describe("roleSectionsFrom, roleSubsectionsFrom and roleFieldsFrom", () => {
    it("derives the section set, the measured subsections and the frontmatter operands from the template", () => {
        assert.deepEqual(roleSectionsFrom(TEMPLATE), ["# IDENTITY", "# REFUSES"]);
        assert.deepEqual(roleSubsectionsFrom(TEMPLATE), [ERRORS, WINS]);
        assert.deepEqual(roleFieldsFrom(TEMPLATE), ["letter:", "type: ROLE"]);
        assert.deepEqual(roleFieldsFrom("# no frontmatter"), []);
    });
});

describe("unfilledMeasuredSections", () => {
    it("tells an absent subsection from one that holds only its template seed", () => {
        const source = `${ERRORS}\n<one measured error per line>\n# NEXT`;
        assert.deepEqual(unfilledMeasuredSections(source, TEMPLATE), [
            { section: ERRORS, state: "unfilled" },
            { section: WINS, state: "absent" },
        ]);
    });
});

describe("checkRoleCoverage", () => {
    it("reports each active letter that owns no role document", () => {
        const files = ["roles/governance.a.role.md"];
        assert.deepEqual(shapeOf(checkRoleCoverage(["A", "B"], files, build)), [["roleMissing", "B"]]);
    });
});

describe("checkRoleShape", () => {
    it("reports a missing operand, a missing section and an unfilled measured subsection", () => {
        const source = ["---", "letter: B", "---", "# IDENTITY", ERRORS, WINS, "- over-scoped a claim"].join("\n");
        assert.deepEqual(shapeOf(checkRoleShape("b.role.md", source, TEMPLATE, build)), [
            ["roleFieldMissing", "type: ROLE"],
            ["roleSectionMissing", "# REFUSES"],
            ["measuredSectionUnfilled", ERRORS],
        ]);
    });
});

import {
    bodyOf,
    checkIdentity,
    checkKeys,
    participationOf,
    preloadedSkills,
} from "coordination-surface/tools/core/inspectors/agent.inspector.ts";
import { describe, it } from "vitest";
import type { Finding } from "coordination-surface/tools/core/types/segment.types.ts";
import assert from "node:assert/strict";

const BODY = ["THIS AGENT IS **B** and it reviews.", "SKILLS: collaboration-protocol, missing-skill"].join("\n");

const SPEC = ["---", "name: reviewer-b", "description: reviews drafts", "owner: someone", "---", BODY].join("\n");

const build = function build(kind: string, locus: string, actual: string, expected: string, decide: string): Finding {
    return {
        actual,
        expected,
        healed: false,
        line: 0,
        locus,
        path: "",
        remediation: { action: "declare", decide, deterministic: false, from: null, target: "", to: null },
        rule: kind,
        stack: [],
    };
};

const kindsOf = function kindsOf(findings: readonly Finding[]): string[] {
    return findings.map((finding) => finding.rule);
};

describe("bodyOf and participationOf", () => {
    it("reads the body below the frontmatter and the letter the body declares", () => {
        assert.equal(bodyOf(SPEC), BODY);
        assert.equal(bodyOf("no frontmatter"), "no frontmatter");
        assert.equal(bodyOf("---\nunclosed"), "");
        assert.equal(participationOf(SPEC), "B");
        assert.equal(participationOf("---\nname: x\n---\nno marker"), null);
    });
});

describe("preloadedSkills", () => {
    it("reads the skills the body's SKILLS line names, and ignores a frontmatter key", () => {
        assert.deepEqual(preloadedSkills(SPEC), ["collaboration-protocol", "missing-skill"]);
        assert.deepEqual(preloadedSkills("---\nskills: [a, b]\n---\nbody"), []);
    });
});

describe("checkKeys", () => {
    it("reports each frontmatter key the configuration does not list", () => {
        assert.deepEqual(kindsOf(checkKeys("reviewer.B.md", SPEC, build)), ["undeliveredKey"]);
    });
});

describe("checkIdentity", () => {
    it("reports an unindexed letter, an unresolved skill and a letter missing from the filename", () => {
        const findings = checkIdentity("reviewer.md", SPEC, new Set(["A"]), new Set(["collaboration-protocol"]), build);
        assert.deepEqual(kindsOf(findings), ["participationUnindexed", "skillDoesNotResolve", "letterNotInName"]);
    });

    it("reports only the missing declaration when the body names no letter", () => {
        const findings = checkIdentity("x.md", "---\nname: x\n---\nbody", new Set(), new Set(), build);
        assert.deepEqual(kindsOf(findings), ["participationUndeclared"]);
    });

    it("reports nothing for a fully declared agent", () => {
        const skills = new Set(["collaboration-protocol", "missing-skill"]);
        assert.deepEqual(checkIdentity("reviewer.B.md", SPEC, new Set(["B"]), skills, build), []);
    });
});

import { countFindings, fromDisk } from "coordination-surface/tools/core/resolvers/gate.resolver.ts";
import { describe, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

type Declaration = Parameters<typeof countFindings>[1];

const finding = function finding(
    rule: string,
): Declaration extends { check: (...args: never[]) => infer R } ? R : never {
    return {
        findings: [
            {
                actual: "",
                expected: null,
                healed: false,
                line: 0,
                locus: "",
                path: "",
                remediation: { action: "none", decide: "", deterministic: false, from: null, target: "", to: null },
                rule,
                stack: [],
            },
        ],
        healed: [],
    };
};

const declaration = function declaration(check: Declaration["check"]): Declaration {
    return { check, extensions: [], heals: false, invariant: "", jurisdiction: "all", kinds: [], stage: "content" };
};

describe("countFindings", () => {
    it("runs a rule over its samples, keeps only the findings of one kind when asked, and reports a throw", () => {
        const sampled = declaration((context) => {
            assert.equal(context.read("a.md"), "sample");
            return { findings: [...finding("probe/one").findings, ...finding("probe/two").findings], healed: [] };
        });
        const samples = [{ path: "a.md", text: "sample" }];
        const unkinded: { readonly kind?: string } = {};
        assert.equal(countFindings("probe", sampled, "", samples, unkinded.kind).findings.length, 2);
        assert.equal(countFindings("probe", sampled, "", samples, "one").findings.length, 1);
        const thrown = countFindings(
            "probe",
            declaration(() => {
                throw new Error("broke");
            }),
            "",
            samples,
            unkinded.kind,
        );
        assert.equal(thrown.error?.includes("broke"), true);
        assert.deepEqual(thrown.findings, []);
    });
});

describe("fromDisk", () => {
    it("reads declared files from a root and answers empty text for one that is missing", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-gate-"));
        try {
            writeVerbatim(join(root, "a.md"), "on disk");
            const context = fromDisk("probe", root, ["a.md"], ["b.md", "a.md"]);
            assert.deepEqual(context.paths, ["a.md", "b.md"]);
            assert.equal(context.read("a.md"), "on disk");
            assert.equal(context.read("b.md"), "");
            assert.deepEqual([context.exists("a.md"), context.exists("b.md")], [true, false]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

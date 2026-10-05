import { collectSpecifierFindings, memberOf } from "@ssot/govlab/codemods/analyzers/specifier.analyzer.ts";
import { describe, expect, it } from "vitest";
import { relativePath } from "@ssot/paths";

describe("collectSpecifierFindings", () => {
    const findings = collectSpecifierFindings();

    it("reports no cross-member relative import, which is the invariant the codemod exists to hold", () => {
        expect(findings.map((finding) => `${finding.file}:${String(finding.line)} ${finding.from}`)).toStrictEqual([]);
    });

    it("carries a rewrite span and a target for every finding it does report", () => {
        for (const finding of findings) {
            expect(finding.end).toBeGreaterThan(finding.start);
            expect(finding.to.length).toBeGreaterThan(0);
        }
    });
});

describe("memberOf", () => {
    it("names the workspace member a path sits in, and none for a path outside every member", () => {
        const member = relativePath("app.member");
        expect(memberOf(`${member}/core/probe.ts`)?.rel).toBe(member);
        expect(memberOf("outside/probe.ts")).toBeNull();
    });
});

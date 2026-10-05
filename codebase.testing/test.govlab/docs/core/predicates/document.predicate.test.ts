import { describe, expect, it } from "vitest";
import {
    isBoundaryFilename,
    isGeneratedDoc,
    isHarnessOwned,
    isHostBoundary,
} from "@govlab/docs/core/predicates/document.predicate.ts";

describe("isBoundaryFilename", () => {
    it("recognizes the boundary names and the HOW-TO pattern", () => {
        for (const name of [
            "README.md",
            "LICENSE",
            "SECURITY.md",
            "CONTRIBUTING.md",
            "AGENTS.md",
            "HOW-TO-DEPLOY.md",
        ]) {
            expect(isBoundaryFilename(name)).toBe(true);
        }
        expect(isBoundaryFilename("govlab.md")).toBe(false);
        expect(isBoundaryFilename("HOW-TO-DEPLOY.txt")).toBe(false);
    });
});

describe("isHostBoundary and isHarnessOwned", () => {
    it("reads the host boundary set plus the install suffix, and the harness root prefix", () => {
        const boundary = new Set(["HOST.md"]);
        expect(isHostBoundary("HOST.md", boundary)).toBe(true);
        expect(isHostBoundary("SERVER-INSTALL.md", boundary)).toBe(true);
        expect(isHostBoundary("notes.md", boundary)).toBe(false);
        expect(isHarnessOwned(".harness/rules/x.md", ".harness/")).toBe(true);
        expect(isHarnessOwned(".harness/rules/x.md", null)).toBe(false);
    });
});

describe("isGeneratedDoc", () => {
    it("finds the generated mark near the top, after frontmatter too, and not deep in the body", () => {
        expect(isGeneratedDoc("<!-- Auto-generated 2026 v1 -->\n# T")).toBe(true);
        expect(isGeneratedDoc("---\ntype: guide\n---\n<!-- auto-generated -->\n# T")).toBe(true);
        expect(isGeneratedDoc(["# T", "", "a", "b", "c", "d", "do not edit"].join("\n"))).toBe(false);
    });
});

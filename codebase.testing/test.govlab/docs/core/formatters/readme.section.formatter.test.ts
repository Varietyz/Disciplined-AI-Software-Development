import { describe, expect, it } from "vitest";
import {
    renderApi,
    renderConcepts,
    renderDeps,
    renderDomains,
    renderMetrics,
    renderPrinciples,
    renderRepoMetrics,
} from "@govlab/docs/core/formatters/readme.section.formatter.ts";
import { README_CONTEXT } from "./readme.fixture.ts";

describe("renderApi", () => {
    it("lists members flat for one axis and under axis headings for several, with their notes", () => {
        const main = [{ axis: "main", kind: "fn", name: "run", signature: "function run(): void" }];
        expect(renderApi(main, [{ name: "run", note: "starts it" }])).toBe("- `function run(): void` — starts it");
        const split = [...main, { axis: "backend", kind: "const", name: "PORT", signature: "PORT" }];
        expect(renderApi(split)).toContain("### Backend\n\n- `PORT` (const)");
    });
});

describe("renderDeps", () => {
    it("lists sorted dependencies, or says the package is a leaf or has no local package", () => {
        expect(renderDeps({ dependencies: { a: "1", b: "1" } })).toBe("- `a`\n- `b`");
        expect(renderDeps({ name: "x" })).toContain("a leaf with no runtime dependencies");
        expect(renderDeps({})).toContain("no local `package.json`");
    });
});

describe("the governance sections", () => {
    it("render principles with their relations, concepts by dimension and domains by meta", () => {
        expect(renderPrinciples([{ category: "Design", enables: ["B"], name: "A", severity: "mandatory" }])).toContain(
            "- **A** — _Design_ · mandatory. Enables B.",
        );
        const concepts = renderConcepts([
            { dimension: "security", id: "csp" },
            { dimension: "a11y", id: "alt" },
        ]);
        expect(concepts.indexOf("**alt**")).toBeLessThan(concepts.indexOf("**csp**"));
        expect(
            renderDomains([
                { meta: "ai", sub: "speech" },
                { meta: "ai", sub: "agents" },
            ]),
        ).toContain("- **ai** — agents, speech");
    });
});

describe("renderRepoMetrics and renderMetrics", () => {
    it("render the repository rows present, nothing for an empty record, and the metrics footer", () => {
        expect(renderRepoMetrics(null)).toBe("");
        expect(renderRepoMetrics({})).toBe("");
        const repo = renderRepoMetrics({ branch: "main", commits: 3, languages: { ".ts": "9" } });
        expect(repo).toContain("- **Default branch**: `main`");
        expect(repo).toContain("- **Languages**: .ts 9");
        expect(renderMetrics(README_CONTEXT)).toBe("---\n\nstable · 1 exports · 1 deps · 0 principles · 0 concepts");
    });
});

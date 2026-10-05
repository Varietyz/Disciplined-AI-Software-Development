import { expect, test } from "vitest";
import { coverageMarkdown } from "@govlab/quality/core/formatters/catalog.formatter.ts";

const RULES = 12;

test("coverageMarkdown lists each tool and each ecosystem with its rule count", () => {
    const markdown = coverageMarkdown({
        byEcosystem: { python: 4, typescript: 8 },
        ecosystems: 2,
        tools: [{ ecosystem: "typescript", rules: 8, tool: "eslint", version: "9.0.0" }],
        totalRules: RULES,
    });
    expect(markdown).toContain("**12 rules** across **1 tools** and **2 ecosystems**.");
    expect(markdown).toContain("| eslint | typescript | 8 | 9.0.0 |");
    expect(markdown.indexOf("| typescript | 8 |")).toBeLessThan(markdown.indexOf("| python | 4 |"));
});

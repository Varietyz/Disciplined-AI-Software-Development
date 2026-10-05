import { createMermaidChecker, validateCharts } from "@govlab/docs/core/validators/diagram.validator.ts";
import { describe, expect, it } from "vitest";

const GOOD = '# Charts\n\n```mermaid\nflowchart TD\n    A["a"] --> B["b"]\n```\n';
const BROKEN = `${GOOD}\n\`\`\`mermaid\nnotadiagramtype foo bar\n\`\`\`\n`;

describe("validateCharts", () => {
    it("passes clean charts and reports a broken block with its line", async () => {
        const clean = await validateCharts(GOOD);
        expect(clean.available).toBe(true);
        expect(clean.findings).toStrictEqual([]);
        const flagged = await validateCharts(BROKEN);
        expect(flagged.findings).toHaveLength(1);
        expect(flagged.findings[0]?.line).toBeGreaterThan(0);
    });
});

describe("createMermaidChecker", () => {
    it("checks a document with diagrams and skips one without", async () => {
        const checker = createMermaidChecker();
        expect(await checker.check("# no diagrams here")).toStrictEqual([]);
        expect(await checker.check(BROKEN)).toHaveLength(1);
    });
});

import { describe, expect, it } from "vitest";
import { SYSTEM_MODEL } from "../formatters/system.fixture.ts";
import { mermaidHardening } from "@govlab/docs/core/analyzers/diagram.analyzer.ts";
import { renderRenderable } from "@govlab/docs/core/formatters/markdown.formatter.ts";
import { systemDoc } from "@govlab/docs/core/converters/system.converter.ts";
import { validateCharts } from "@govlab/docs/core/validators/diagram.validator.ts";

const DIAGRAM_SECTIONS = 6;

describe("systemDoc", () => {
    it("composes a reference document with a section per populated diagram plus the runtime boundary", () => {
        const doc = systemDoc(SYSTEM_MODEL);
        expect(doc).toMatchObject({
            concern: "architecture",
            name: "system-architecture",
            status: "current",
            type: "reference",
        });
        expect(doc.body).toHaveLength(DIAGRAM_SECTIONS + 1);
        expect(systemDoc({ name: "Empty" }).body).toStrictEqual([]);
    });

    it("emits mermaid that hardens clean and parses", async () => {
        const markdown = systemDoc(SYSTEM_MODEL)
            .body.map((section) => `## ${section.heading}\n\n${renderRenderable(section.content)}`)
            .join("\n\n");
        expect(mermaidHardening(markdown)).toStrictEqual([]);
        const parsed = await validateCharts(markdown);
        expect(parsed.available).toBe(true);
        expect(parsed.findings).toStrictEqual([]);
    });
});

import { describe, expect, it } from "vitest";
import { pagBlockOf, pagTextOf } from "@govlab/context/core/selectors/document.selector.ts";
import type { DocumentSource } from "@govlab/context/types/grammar.document.types.ts";

const TEMPLATE: DocumentSource = { kind: "template", path: "template.md", relative: "template.md" };
const AGENT: DocumentSource = { kind: "agent", path: "agent.md", relative: "agent.md" };

const FENCED = [
    "# A template",
    "",
    "prose before the block",
    "",
    "```py CODE: PAG sample",
    "THIS TASK EXECUTES a sample",
    "# PHASE 1: the retired head",
    "```",
].join("\n");

describe("pagBlockOf", () => {
    it("extracts the fenced PAG block and reports the file line its first line sits on", () => {
        expect(pagBlockOf(FENCED)).toStrictEqual({
            firstLine: 6,
            text: "THIS TASK EXECUTES a sample\n# PHASE 1: the retired head",
        });
    });

    it("yields null when no fence carries the PAG info string", () => {
        expect(pagBlockOf("```ts\nconst x = 1;\n```")).toBeNull();
    });
});

describe("pagTextOf", () => {
    it("reads an agent whole and a template by its block", () => {
        expect(pagTextOf(AGENT, "THIS AGENT audits")).toStrictEqual({ firstLine: 1, text: "THIS AGENT audits" });
        expect(pagTextOf(TEMPLATE, "no block here")).toBeNull();
    });
});

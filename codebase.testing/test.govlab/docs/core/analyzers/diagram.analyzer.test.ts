import { describe, expect, it } from "vitest";
import { mermaidHardening } from "@govlab/docs/core/analyzers/diagram.analyzer.ts";

const wrap = function wrap(body: string): string {
    return ["```mermaid", body, "```", ""].join("\n");
};

const codesOf = function codesOf(source: string): string[] {
    return mermaidHardening(source).map((hit) => hit.code);
};

describe("mermaidHardening", () => {
    it("scans only inside mermaid fences", () => {
        expect(
            codesOf("Prose with (parens) and a <br/> tag.\n\n```ts EXAMPLE: x\nconst a = (1);\n```\n"),
        ).toStrictEqual([]);
        expect(codesOf(["# title", "", "Legend: a - b (c) [d]"].join("\n"))).toStrictEqual([]);
    });

    it("flags non-ASCII text and a break tag", () => {
        expect(codesOf(wrap('flowchart TD\n    A["a — b"] --> B["c · d"]'))).toContain("mermaid-non-ascii");
        expect(codesOf(wrap('flowchart TD\n    A["one<br/>two"]'))).toContain("mermaid-html-break");
    });

    it("flags parentheses as shapes and as label text", () => {
        expect(codesOf(wrap('flowchart TD\n    A(["stadium shape"])'))).toContain("mermaid-paren");
        expect(codesOf(wrap('flowchart LR\n    a[("cylinder")]'))).toContain("mermaid-paren");
        expect(codesOf(wrap('flowchart TD\n    A["text (aside)"]'))).toContain("mermaid-paren");
    });

    it("flags a reserved character inside a label and allows the shape delimiters", () => {
        expect(codesOf(wrap('flowchart TD\n    A["has [bracket]"]'))).toContain("mermaid-label-reserved");
        expect(codesOf(wrap('flowchart TD\n    A["ok"] --> B{"decide?"}'))).toStrictEqual([]);
    });

    it("flags a mid-line semicolon and a subgraph direction, and allows a trailing semicolon", () => {
        expect(codesOf(wrap("sequenceDiagram\n    A->>B: one; two"))).toContain("mermaid-semicolon");
        expect(codesOf(wrap("flowchart TD\n    A --> B\n    classDef x fill:#fff;"))).not.toContain(
            "mermaid-semicolon",
        );
        expect(codesOf(wrap("flowchart TD\n    subgraph S\n        direction TB\n        A --> B\n    end"))).toContain(
            "mermaid-subgraph-direction",
        );
    });

    it("passes the render-safe vocabulary the generators emit", () => {
        const chart = [
            "flowchart LR",
            '    a["entry"]',
            '    b[["collaborator"]]',
            '    d{"decision"}',
            "    a -->|fail| b",
            "    classDef kEntry stroke:#2f6f4f,stroke-width:2px;",
            "    class a kEntry;",
        ].join("\n");
        expect(codesOf(wrap(chart))).toStrictEqual([]);
    });
});

import { describe, expect, it } from "vitest";
import { mermaidBlocks } from "@govlab/docs/core/parsers/diagram.parser.ts";

describe("mermaidBlocks", () => {
    it("collects only mermaid fences with the line their body starts on", () => {
        const source = ["# T", "```ts", "const a = 1;", "```", "```mermaid", "flowchart TD", "  A --> B", "```"].join(
            "\n",
        );
        expect(mermaidBlocks(source)).toStrictEqual([{ code: "flowchart TD\n  A --> B", startLine: 6 }]);
        expect(mermaidBlocks("no fences")).toStrictEqual([]);
    });
});

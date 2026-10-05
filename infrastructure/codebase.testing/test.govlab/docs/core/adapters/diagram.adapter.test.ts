import { describe, expect, it } from "vitest";
import { createMermaidParser } from "@govlab/docs/core/adapters/diagram.adapter.ts";

const parsed = async function parsed(source: string): Promise<string | null> {
    const parser = await createMermaidParser();
    return parser.available ? parser.parse(source) : parser.reason;
};

describe("createMermaidParser", () => {
    it("loads the parser", async () => {
        expect((await createMermaidParser()).available).toBe(true);
    });

    it("accepts valid diagrams and returns a message for invalid syntax", async () => {
        expect(await parsed('flowchart TD\n    A["start"] --> B["done"]')).toBeNull();
        expect(await parsed("sequenceDiagram\n    A->>B: hello")).toBeNull();
        expect((await parsed("notarealdiagramtype\n    foo bar"))?.length).toBeGreaterThan(0);
        expect((await parsed("flowchart TD\n    A[[[ broken"))?.length).toBeGreaterThan(0);
    });
});

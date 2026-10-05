import { describe, expect, it } from "vitest";
import type { ClassModel } from "@govlab/docs/types/diagram.types.ts";
import { createMermaidParser } from "@govlab/docs/core/adapters/diagram.adapter.ts";
import { emitClassDiagram } from "@govlab/docs/core/formatters/diagram.structure.formatter.ts";

const parsed = async function parsed(source: string): Promise<string | null> {
    const parser = await createMermaidParser();
    return parser.available ? parser.parse(source) : parser.reason;
};

const MODEL: ClassModel = {
    classes: [
        { id: "DomFactory", label: "dom factory", members: [{ name: "render" }, { name: "createElement" }] },
        { id: "EventManager", label: "event manager", members: [] },
    ],
    relations: [{ from: "DomFactory", kind: "aggregation", label: "injects", to: "EventManager" }],
};

describe("emitClassDiagram", () => {
    it("emits a class diagram that parses and is deterministic", async () => {
        const out = emitClassDiagram(MODEL);
        expect(await parsed(out)).toBeNull();
        expect(emitClassDiagram(MODEL)).toBe(out);
    });
});

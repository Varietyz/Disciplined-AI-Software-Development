import { describe, expect, it } from "vitest";
import type { StateModel } from "@govlab/docs/types/diagram.types.ts";
import { createMermaidParser } from "@govlab/docs/core/adapters/diagram.adapter.ts";
import { emitStateDiagram } from "@govlab/docs/core/formatters/diagram.machine.formatter.ts";

const parsed = async function parsed(source: string): Promise<string | null> {
    const parser = await createMermaidParser();
    return parser.available ? parser.parse(source) : parser.reason;
};

const MODEL: StateModel = {
    initial: "idle",
    nodes: [
        { id: "idle", label: "idle" },
        { id: "awaiting", label: "awaiting reply" },
        { id: "applied", label: "applied" },
    ],
    transitions: [
        { from: "idle", label: "start", to: "awaiting" },
        { from: "awaiting", to: "applied" },
    ],
};

describe("emitStateDiagram", () => {
    it("emits a state diagram that parses and is deterministic", async () => {
        const out = emitStateDiagram(MODEL);
        expect(await parsed(out)).toBeNull();
        expect(emitStateDiagram(MODEL)).toBe(out);
    });
});

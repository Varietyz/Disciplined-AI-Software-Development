import { describe, expect, it } from "vitest";
import type { SequenceModel } from "@govlab/docs/types/diagram.types.ts";
import { createMermaidParser } from "@govlab/docs/core/adapters/diagram.adapter.ts";
import { emitSequence } from "@govlab/docs/core/formatters/diagram.sequence.formatter.ts";

const parsed = async function parsed(source: string): Promise<string | null> {
    const parser = await createMermaidParser();
    return parser.available ? parser.parse(source) : parser.reason;
};

const MODEL: SequenceModel = {
    autonumber: true,
    participants: [
        { id: "O", label: "orchestrator" },
        { id: "R", label: "relay" },
    ],
    steps: [
        { message: { from: "O", kind: "sync", text: "call; queued", to: "R" } },
        { note: { over: ["R"], text: "block on channel" } },
        { message: { from: "R", kind: "return", text: "result", to: "O" } },
    ],
};

describe("emitSequence", () => {
    it("emits a sequence that parses, is deterministic and carries no raw semicolon", async () => {
        const out = emitSequence(MODEL);
        expect(await parsed(out)).toBeNull();
        expect(out).not.toContain(";");
        expect(emitSequence(MODEL)).toBe(out);
    });
});

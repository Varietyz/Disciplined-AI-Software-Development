import type { ContentGraph, GraphContext } from "@banes-lab/content/types/coverage.types.ts";
import {
    conceptsTaughtAcross,
    taughtAcross,
    untaughtOf,
    validateGraph,
    validateUnion,
} from "@banes-lab/content/core/validators/coverage.validator.ts";
import { describe, expect, it } from "vitest";

const graph = function graph(sections: ContentGraph["sections"]): ContentGraph {
    return { page: "page", sections };
};

const context = function context(
    sections: readonly string[],
    known: readonly string[],
    taught: readonly string[] = [],
): GraphContext {
    return { known: new Set(known), payloadSections: new Map([["page", sections]]), taught: new Set(taught) };
};

describe("validateGraph", () => {
    it("passes a graph whose concepts have one home, whose requirements point backward and whose traces resolve", () => {
        const held = graph({
            first: { requires: [], teaches: ["loop"], traces: ["slug_a"] },
            second: { requires: ["loop"], teaches: ["gate"], traces: [] },
            third: { narrative: true, requires: [], teaches: [], traces: [] },
        });
        expect(validateGraph(held, context(["first", "second", "third"], ["slug_a"]))).toStrictEqual([]);
    });

    it("fails a payload section the graph does not declare and a section neither teaching nor narrative", () => {
        const held = graph({ first: { requires: [], teaches: [], traces: [] } });
        const findings = validateGraph(held, context(["first", "ghost"], []));
        expect(findings.map((finding) => finding.section)).toStrictEqual(["ghost", "first"]);
    });

    it("fails an unknown trace, a concept taught twice, a forward requirement and a cycle", () => {
        const held = graph({
            first: { requires: ["gate"], teaches: ["loop"], traces: ["missing"] },
            second: { requires: ["loop"], teaches: ["gate", "loop"], traces: [] },
        });
        const messages = validateGraph(held, context(["first", "second"], [])).map((finding) => finding.message);
        expect(messages.some((message) => message.endsWith("missing"))).toBe(true);
        expect(messages.some((message) => message.endsWith("loop"))).toBe(true);
        expect(messages.some((message) => message.includes("later"))).toBe(true);
        expect(messages.some((message) => message.includes("cycle"))).toBe(true);
    });
});

describe("requirements that cross pages", () => {
    it("passes a requirement another page teaches and fails one no page teaches", () => {
        const held = graph({ first: { requires: ["elsewhere", "nowhere"], teaches: ["loop"], traces: [] } });
        const messages = validateGraph(held, context(["first"], [], ["elsewhere", "loop"])).map(
            (finding) => finding.message,
        );
        expect(messages.some((message) => message.endsWith("elsewhere"))).toBe(false);
        expect(messages.some((message) => message.endsWith("nowhere"))).toBe(true);
    });

    it("collects every concept any page teaches", () => {
        const first = graph({ a: { requires: [], teaches: ["loop"], traces: [] } });
        const second: ContentGraph = {
            page: "other",
            sections: { b: { requires: [], teaches: ["gate"], traces: [] } },
        };
        expect([...taughtAcross([first, second])]).toStrictEqual(["loop", "gate"]);
    });

    it("finds a cycle that only exists across two pages", () => {
        const first = graph({ a: { requires: ["gate"], teaches: ["loop"], traces: [] } });
        const second: ContentGraph = {
            page: "other",
            sections: { b: { requires: ["loop"], teaches: ["gate"], traces: [] } },
        };
        expect(validateGraph(first, context(["a"], [], ["loop", "gate"]))).toStrictEqual([]);
        expect(validateUnion([first, second]).map((finding) => finding.message.includes("cycle"))).toContain(true);
    });

    it("finds no cycle in a union whose requirements all point backward", () => {
        const first = graph({ a: { requires: [], teaches: ["loop"], traces: [] } });
        const second: ContentGraph = {
            page: "other",
            sections: { b: { requires: ["loop"], teaches: ["gate"], traces: [] } },
        };
        expect(validateUnion([first, second])).toStrictEqual([]);
    });
});

describe("untaughtOf and conceptsTaughtAcross", () => {
    it("lists the slugs no section traces and a concept two pages both teach", () => {
        const first = graph({ a: { requires: [], teaches: ["loop"], traces: ["slug_a"] } });
        const second: ContentGraph = {
            page: "other",
            sections: { b: { requires: [], teaches: ["loop"], traces: [] } },
        };
        expect(untaughtOf([first, second], ["slug_a", "slug_b"])).toStrictEqual(["slug_b"]);
        expect(conceptsTaughtAcross([first, second])).toHaveLength(1);
    });
});

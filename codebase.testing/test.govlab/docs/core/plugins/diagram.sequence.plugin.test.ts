import { describe, expect, it } from "vitest";
import type { DetectedProtocol } from "@govlab/docs/types/graph.types.ts";
import type { DiagramContext } from "@govlab/docs/types/figure.types.ts";
import { diagram } from "@govlab/docs/core/plugins/diagram.sequence.plugin.ts";
import { mermaidHardening } from "@govlab/docs/core/analyzers/diagram.analyzer.ts";

const withProtocol = function withProtocol(protocol: DetectedProtocol | null): DiagramContext {
    return {
        codeGraph: { edges: [], nodes: [], protocol, state: null },
        layout: { cluster: false, direction: "TD", nodeCap: 15, perAxis: false },
        moduleDeps: [],
        moduleName: "@govlab/demo",
        shape: "leaf",
    };
};

describe("the sequence diagram", () => {
    it("needs at least two awaited messages", () => {
        const thin = withProtocol({
            messages: [{ async: true, text: "save", to: "store" }],
            participants: ["store"],
            self: "run",
        });
        expect(diagram.appliesTo(thin)).toBe(false);
    });

    it("emits a hardened sequence diagram naming the calling function", () => {
        const context = withProtocol({
            messages: [
                { async: true, text: "charge", to: "gateway" },
                { async: true, text: "store", to: "vault" },
                { async: true, text: "sendReceipt", to: "email" },
            ],
            participants: ["gateway", "vault", "email"],
            self: "processPayment",
        });
        expect(diagram.appliesTo(context)).toBe(true);
        const mermaid = diagram.render(context)?.mermaid ?? "";
        expect(mermaid.startsWith("sequenceDiagram")).toBe(true);
        expect(mermaid).toContain("processPayment");
        expect(mermaidHardening(["```mermaid", mermaid, "```"].join("\n"))).toStrictEqual([]);
    });
});

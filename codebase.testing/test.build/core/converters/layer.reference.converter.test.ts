import type { LayerNodeView, TensionView } from "@banes-lab/web/types/ontology.types.ts";
import { describe, expect, it } from "vitest";
import { layerRecord, tensionRecord } from "@banes-lab/build-scripts/core/converters/layer.reference.converter.ts";

const CONTRACT = { label: "Contract", ref: "contract:layer" };
const MEMBER = { label: "Member", ref: "arch:member" };

const LAYER: LayerNodeView = {
    contract: CONTRACT,
    id: "domain",
    incoming: [],
    label: "Domain",
    members: [MEMBER],
    outgoing: [],
};

const TENSION: TensionView = {
    a: { label: "Speed", ref: "arch:speed" },
    b: { label: "Safety", ref: "arch:safety" },
    explicit: true,
    id: "speed-safety",
    mechanism: { label: "Gate", ref: "arch:gate" },
    rule: "The gate decides.",
    scopeA: { label: "A", ref: null },
    scopeB: { label: "B", ref: null },
};

describe("layerRecord", () => {
    it("names the layer, links its contract and members, and takes the contract's intent as its summary", () => {
        const record = layerRecord(LAYER, new Map([["contract:layer", "Owns the rules."]]));
        expect(record.name).toBe("Domain");
        expect(record.summary).toBe("Owns the rules.");
        expect(record.relations.map((relation) => relation.edges)).toStrictEqual([[CONTRACT], [MEMBER]]);
    });
});

describe("tensionRecord", () => {
    it("names both poles, links them and the mechanism, and carries the rule", () => {
        const record = tensionRecord(TENSION);
        expect(record.name).toBe("Speed / Safety");
        expect(record.summary).toBe("The gate decides.");
        expect(record.relations).toHaveLength(2);
    });
});

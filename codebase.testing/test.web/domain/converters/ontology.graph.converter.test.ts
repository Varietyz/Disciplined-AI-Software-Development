import { describe, expect, it } from "vitest";
import {
    diagram,
    edgeLine,
    localId,
    node,
    nodeId,
    nodeLabel,
} from "@banes-lab/web/domain/converters/ontology.graph.converter.ts";

describe("diagrams", () => {
    it("derives safe node ids, escapes labels and joins lines", () => {
        expect(nodeId("Single Responsibility (SRP)")).toBe("n_single_responsibility__srp_");
        expect(nodeLabel('say "hi"')).toBe("say 'hi'");
        expect(node("a", "A")).toBe('    n_a["A"]');
        expect(edgeLine("a", " --> ", "b")).toBe("    n_a --> n_b");
        expect(diagram("flowchart LR", ["x"])).toBe("flowchart LR\nx");
    });
});

describe("localId", () => {
    it("reads the id of an edge into the same collection when the group holds it", () => {
        const members = new Set(["a"]);
        expect(localId({ label: "A", ref: "architecture:a" }, "architecture", members)).toBe("a");
        expect(localId({ label: "B", ref: "architecture:b" }, "architecture", members)).toBeNull();
        expect(localId({ label: "A", ref: "lexicon:a" }, "architecture", members)).toBeNull();
        expect(localId({ label: "A", ref: null }, "architecture", members)).toBeNull();
    });
});

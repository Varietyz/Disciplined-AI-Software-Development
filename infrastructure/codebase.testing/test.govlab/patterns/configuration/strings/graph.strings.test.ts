import {
    deadNode,
    effectCycle,
    missingProducer,
    orphanNode,
    ownProducer,
    producedTwice,
    stepsBack,
} from "@govlab/patterns/configuration/strings/graph.strings.ts";
import { describe, expect, it } from "vitest";

describe("the graph strings", () => {
    it("name the node each refusal concerns", () => {
        for (const line of [producedTwice("n"), ownProducer("n"), effectCycle("n"), orphanNode("n"), deadNode("n")]) {
            expect(line).toContain('"n"');
        }
    });

    it("name both ends of an edge", () => {
        expect(missingProducer("n", "p")).toBe('node "n" consumes missing producer "p"');
        expect(stepsBack("p", "n")).toBe('edge "p" → "n" steps back on the reasoning axis');
    });
});

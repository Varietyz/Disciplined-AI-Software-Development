import { describe, expect, it } from "vitest";
import { explanationFinding, makeFinding, reasonOf } from "@govlab/patterns/core/factories/finding.factory.ts";
import { coordinate } from "@govlab/patterns/core/factories/axis.factory.ts";

const COORD = coordinate({
    analysis: "structure",
    ontology: "composition",
    reasoning: "observation",
    representation: "topology",
});

describe("the finding factory", () => {
    it("reasonOf pairs an observation with its explanation", () => {
        expect(reasonOf("seen", "because")).toStrictEqual({ explanation: "because", observation: "seen" });
    });

    it("makeFinding derives the math type from the analysis axis and starts at zero support", () => {
        const finding = makeFinding({
            coordinate: COORD,
            field: "f",
            name: "n",
            narrative: reasonOf("o", "e"),
            observation: {},
        });
        expect(finding.mathType).toBe("algebra");
        expect(finding.support).toBe(0);
        expect("significance" in finding).toBe(false);
    });

    it("explanationFinding stamps the explanation rung on the declared axes", () => {
        const finding = explanationFinding({
            analysis: "frequency",
            explained: "e",
            field: "f",
            name: "n",
            observation: {},
            observed: "o",
            ontology: "probability",
            representation: "symbolic",
        });
        expect(finding.coordinate.reasoning).toBe("explanation");
        expect(finding.narrative).toStrictEqual({ explanation: "e", observation: "o" });
    });
});

import { describe, expect, it } from "vitest";
import { repairDefectsOf, repairKindLookup } from "@govlab/context/core/validators/repair.validator.ts";
import type { Principle } from "@govlab/context/types/architecture.types.ts";
import { createGovlabContext } from "@govlab/context";

const KINDS = new Map([
    ["lexicon:extract-interface", "technique"],
    ["lexicon:fat-interface", "anti-pattern"],
    ["lexicon:cost", "metric"],
]);

const principle = function principle(fields: Partial<Principle>): Principle {
    return {
        category: "c",
        conflicts_with: [],
        definition: "A design rule.",
        detected_by: [],
        enables: [],
        enforced_by: [],
        id: "isp",
        measured_by: [],
        name: "ISP",
        refactored_by: [],
        reinforces: [],
        requires: [],
        scope: [],
        severity: "recommended",
        tensions_with: [],
        type: "principle",
        ...fields,
    };
};

const reasonsOf = function reasonsOf(principles: readonly Principle[]): readonly string[] {
    return repairDefectsOf(principles, (ref) => KINDS.get(ref) ?? null).map(
        (defect) => `${defect.field} ${defect.target}: ${defect.reason}`,
    );
};

describe("repairDefectsOf", () => {
    it("accepts a principle repaired by a technique and violated by an anti-pattern, and an anti-pattern that says how it forms", () => {
        expect(
            reasonsOf([
                principle({ refactored_by: ["lexicon:extract-interface"], violated_by: ["lexicon:fat-interface"] }),
                principle({ formed_by: "Bundling unrelated operations.", id: "fat", type: "anti-pattern" }),
            ]),
        ).toStrictEqual([]);
    });

    it("refuses a ref that names no record and one whose kind the field does not admit", () => {
        expect(
            reasonsOf([
                principle({
                    refactored_by: ["lexicon:cost", "lexicon:ghost"],
                    violated_by: ["lexicon:extract-interface"],
                }),
            ]),
        ).toStrictEqual([
            "refactored_by lexicon:cost: names a metric, where the field admits technique, pattern, mechanism, activity, approach, style, model, artifact",
            "refactored_by lexicon:ghost: names no record",
            "violated_by lexicon:extract-interface: names a technique, where the field admits anti-pattern",
        ]);
    });

    it("refuses a principle with no violation, formed_by outside an anti-pattern, and an anti-pattern without it", () => {
        expect(
            reasonsOf([principle({ formed_by: "A sentence." }), principle({ id: "fat", type: "anti-pattern" })]),
        ).toStrictEqual([
            "formed_by : carries formed_by, which only an anti-pattern holds",
            "violated_by : names no anti-pattern that violates it",
            "formed_by : is an anti-pattern with no formed_by sentence on how it forms",
        ]);
    });
});

describe("repairKindLookup", () => {
    it("reads a principle's type and a term's kind, and answers null for any other collection", () => {
        const context = createGovlabContext();
        const kindOf = repairKindLookup(context);
        const [first] = context.arch.all();
        const [term] = context.lex.all();
        expect(kindOf(`architecture:${first?.id ?? ""}`)).toBe(first?.type);
        expect(kindOf(`lexicon:${term?.id ?? ""}`)).toBe(term?.kind);
        expect(kindOf("algorithms:x")).toBeNull();
    });
});

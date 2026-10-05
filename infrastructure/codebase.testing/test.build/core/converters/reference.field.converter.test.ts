import { describe, expect, it } from "vitest";
import {
    hyphenatedOf,
    nameOf,
    recordOf,
    relationsOf,
    titleOf,
} from "@banes-lab/build-scripts/core/converters/reference.field.converter.ts";

const EDGE = { label: "Axis", ref: "reasoning:axis-a" };
const VIEW = { anchor: "lens-x", axisRef: EDGE, id: "x", question: "What holds?", related: [EDGE], title: "ignored" };

describe("relationsOf and recordOf", () => {
    it("turns every edge field into a kebab-cased relation, skips identity fields and takes the first summary field", () => {
        expect(relationsOf(VIEW)).toStrictEqual([
            { edges: [EDGE], relation: "axis-ref" },
            { edges: [EDGE], relation: "related" },
        ]);
        expect(recordOf(VIEW, "lens", "X")).toMatchObject({ kind: "lens", name: "X", summary: "What holds?" });
    });
});

describe("nameOf, titleOf and hyphenatedOf", () => {
    it("prefers a view's own name and otherwise titles its id", () => {
        expect(nameOf({ name: "Named" }, "a-b")).toBe("Named");
        expect(nameOf({}, "a-b")).toBe("A B");
        expect(titleOf("single-responsibility")).toBe("Single Responsibility");
        expect(hyphenatedOf("conflicts_with")).toBe("conflicts-with");
    });
});

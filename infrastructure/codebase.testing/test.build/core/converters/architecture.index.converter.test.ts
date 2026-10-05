import {
    archIndexOf,
    categoryLabelsOf,
} from "@banes-lab/build-scripts/core/converters/architecture.index.converter.ts";
import { createGovlabContext, slugify } from "@govlab/context";
import { describe, expect, it } from "vitest";

const context = createGovlabContext();

describe("archIndexOf", () => {
    it("finds a principle by its id, its name and each alias, all slugged", () => {
        const index = archIndexOf(context);
        const principle = context.arch.get("single-responsibility");
        expect(index.get("single-responsibility")).toBe(principle);
        expect(index.get(slugify(principle?.name ?? ""))).toBe(principle);
    });
});

describe("categoryLabelsOf", () => {
    it("maps every category slug to the label the principles carry", () => {
        const labels = categoryLabelsOf(context);
        const [first] = context.arch.all();
        expect(labels.get(slugify(first?.category ?? ""))).toBe(first?.category);
    });
});

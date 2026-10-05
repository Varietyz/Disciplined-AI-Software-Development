import { describe, expect, it } from "vitest";
import { NODE_KIND } from "@banes-lab/build-scripts/configuration/constants/ontology.constants.ts";
import { createGovlabContext } from "@govlab/context";
import { reasonIndexOf } from "@banes-lab/build-scripts/core/converters/reason.index.converter.ts";

describe("reasonIndexOf", () => {
    it("holds every reasoning record's id under its kind", () => {
        const context = createGovlabContext();
        const index = reasonIndexOf(context);
        expect(index.get(NODE_KIND)?.size).toBe(context.reason.nodes().length);
        const [node] = context.reason.nodes();
        expect(index.get(NODE_KIND)?.has(node?.id ?? "")).toBe(true);
    });
});

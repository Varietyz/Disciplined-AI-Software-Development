import { type Exemplar, createGovlabContext } from "@govlab/context";
import { describe, expect, it } from "vitest";
import {
    distinctsOf,
    exemplarOf,
    groupBy,
    layerRef,
    orNull,
} from "@banes-lab/build-scripts/core/converters/view.converter.ts";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";
import { createReverseIndex } from "@banes-lab/build-scripts/core/converters/ontology.index.converter.ts";
import { forceNames } from "@banes-lab/build-scripts/core/converters/layer.converter.ts";

const context = createGovlabContext();
const resolve = createResolver(context);
const sources = { context, forces: forceNames(context), index: createReverseIndex(context, resolve), resolve };

describe("the view helpers", () => {
    it("turns an empty or missing text into null and keeps any other", () => {
        expect(orNull()).toBeNull();
        expect(orNull("")).toBeNull();
        expect(orNull("held")).toBe("held");
    });

    it("copies an exemplar and answers null for a record without one", () => {
        const exemplar: Exemplar = { after: "b", before: "a", lang: "flow", medium: "composite" };
        expect(exemplarOf()).toBeNull();
        expect(exemplarOf(exemplar)).toStrictEqual(exemplar);
        expect(exemplarOf(exemplar)).not.toBe(exemplar);
    });

    it("groups items by key in first-seen order", () => {
        expect(groupBy(["ab", "b", "ac"], (item) => item.charAt(0))).toStrictEqual([
            ["a", ["ab", "ac"]],
            ["b", ["b"]],
        ]);
    });

    it("places a principle in its layer and answers null for an id no layer holds", () => {
        expect(layerRef(sources, "stated-invariant")?.ref?.startsWith("layer:")).toBe(true);
        expect(layerRef(sources, "no-such-record")).toBeNull();
    });

    it("resolves each distinct declaration through the resolver it is given and keeps its reason", () => {
        const found = distinctsOf([{ id: "architecture:determinism", reason: "one differs" }], resolve.target);
        expect(found).toStrictEqual([{ reason: "one differs", record: resolve.target("architecture:determinism") }]);
        expect(found[0]?.record.ref).toBe("architecture:determinism");
        expect(distinctsOf(undefined, resolve.target)).toStrictEqual([]);
    });
});

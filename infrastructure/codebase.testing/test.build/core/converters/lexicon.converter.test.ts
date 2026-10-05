import { describe, expect, it } from "vitest";
import type { EdgeRef } from "@banes-lab/web/types/link.types.ts";
import type { PrincipleCategoryView } from "@banes-lab/web/types/ontology.types.ts";
import { createGovlabContext } from "@govlab/context";
import { createResolver } from "@banes-lab/build-scripts/core/resolvers/ontology.resolver.ts";
import { createReverseIndex } from "@banes-lab/build-scripts/core/converters/ontology.index.converter.ts";
import { forceNames } from "@banes-lab/build-scripts/core/converters/layer.converter.ts";
import { snapshotOf } from "@banes-lab/build-scripts/core/converters/ontology.converter.ts";
import { termsOf } from "@banes-lab/build-scripts/core/converters/lexicon.converter.ts";

const context = createGovlabContext();
const resolve = createResolver(context);
const sources = { context, forces: forceNames(context), index: createReverseIndex(context, resolve), resolve };

const TERM_ID = "deferred-setting";

const principleGroups = function principleGroups(term: EdgeRef | null): readonly PrincipleCategoryView[] {
    const [group] = snapshotOf(context).principles;
    const [principle] = group?.principles ?? [];
    if (group === undefined || principle === undefined) {
        throw new Error("no principle");
    }
    return [{ ...group, principles: [{ ...principle, term }] }];
};

describe("termsOf", () => {
    it("names a term's principle only where that principle names the term", () => {
        const [principle] = principleGroups(null)[0]?.principles ?? [];
        const twinned = termsOf(sources, principleGroups({ label: TERM_ID, ref: `lexicon:${TERM_ID}` }));
        const terms = twinned.flatMap((group) => group.terms);
        expect(terms.find((term) => term.id === TERM_ID)?.principle).toStrictEqual({
            label: principle?.name,
            ref: `architecture:${principle?.id ?? ""}`,
        });
        expect(terms.filter((term) => term.principle !== null)).toHaveLength(1);
        const untwinned = termsOf(sources, principleGroups(null)).flatMap((group) => group.terms);
        expect(untwinned.every((term) => term.principle === null)).toBe(true);
    });

    it("groups every term under its category and resolves each declared distinct record", () => {
        const groups = termsOf(sources, []);
        expect(groups.reduce((total, group) => total + group.terms.length, 0)).toBe(context.lex.ids().length);
        const coordination = groups.find((group) => group.id === "coordination-surfaces");
        expect(coordination?.terms.some((term) => term.id === TERM_ID)).toBe(true);
        const distincts = groups.flatMap((group) => group.terms.flatMap((term) => term.distinctFrom));
        expect(distincts.every((entry) => entry.record.ref !== null)).toBe(true);
    });

    it("carries each tag category's example shape and each tag's example or rename", () => {
        const groups = termsOf(sources, []);
        const placed = groups.find((group) => group.id === "domain-concerns");
        const renamed = groups.find((group) => group.id === "refused-tags");
        expect(placed?.exampleShape?.ref).toBe("vocabulary:example-shape-placed-file");
        expect(renamed?.exampleShape?.ref).toBe("vocabulary:example-shape-renamed-file");
        expect(placed?.terms.find((term) => term.id === "model-tag")?.example).toBe("models/order.model.ts");
        expect(renamed?.terms.find((term) => term.id === "manager-as-a-tag")?.exemplar?.after).toBe(
            "coordinators/audio.coordinator.ts",
        );
        expect(groups.find((group) => group.id === "core-vocabulary")?.exampleShape).toBeNull();
    });
});

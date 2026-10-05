import { type PrincipleCategory, createArchRelations, createGovlabContext, createLexicon } from "@govlab/context";
import { CheckTable } from "@govlab/context/core/stores/check.store.ts";
import type { Faces } from "@govlab/context/types/context.types.ts";
import { ReadAudit } from "@govlab/context/core/observers/record.observer.ts";
import type { TermCategory } from "@govlab/context/types/lexicon.types.ts";
import { createLayerJoin } from "@govlab/context/core/factories/layer.factory.ts";
import { loadBundledData } from "@govlab/context/core/loaders/reason.loader.ts";

export const PLANTED_ID = "planted-rule";
export const PLANTED_GATE = ["a planted gate"];

export const bundledReason = (): ReturnType<typeof loadBundledData> =>
    loadBundledData(new ReadAudit("reasoning"), new CheckTable());

export const plantedPrinciple = (id: string, extra: object = {}): PrincipleCategory => ({
    category: "planted",
    records: [
        {
            conflicts_with: [],
            definition: "A design rule that is planted for the test.",
            detected_by: ["d"],
            enables: [],
            enforced_by: [],
            exemplar: { after: "a planted after", before: "a planted before", lang: "ts", medium: "code" },
            id,
            measured_by: ["m"],
            name: id,
            refactored_by: [],
            reinforces: [],
            requires: [],
            scope: ["module"],
            severity: "recommended",
            tensions_with: [],
            type: "principle",
            ...extra,
        },
    ],
});

export const plantedFaces = (categories: PrincipleCategory[], terms: TermCategory[]): Faces => {
    const context = createGovlabContext();
    const arch = createArchRelations({ data: categories });
    const lex = createLexicon({ data: terms });
    return {
        algo: context.algo,
        arch,
        layerJoin: createLayerJoin({ algo: context.algo, arch, lex }),
        lex,
        pag: context.pag,
        reason: context.reason,
    };
};

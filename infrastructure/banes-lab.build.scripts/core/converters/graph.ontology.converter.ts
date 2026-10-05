import type { FieldRule, OntologyGraph, Undeclared, Vocabulary } from "#types/graph.types";
import type { GraphEdge } from "@banes-lab/web/types/graph.types.js";
import { ONTOLOGY_LAYER } from "#configuration/constants/graph.constants";
import type { Population } from "#types/catalog.types";
import type { ReferenceFaces } from "#types/ontology.types";
import type { ReferenceRelation } from "@banes-lab/web/types/reference.types.js";
import { graphNode } from "#core/factories/graph.factory";

interface Source {
    readonly face: string;
    readonly kind: string;
    readonly ref: string;
}

type FieldOutcome = "ambiguous" | "emitted" | "inverse" | "undeclared";

interface Ruling {
    readonly outcome: FieldOutcome;
    readonly rule: FieldRule | null;
}

const UNDECLARED: Ruling = { outcome: "undeclared", rule: null };
const AMBIGUOUS: Ruling = { outcome: "ambiguous", rule: null };

type TargetOutcome = "emitted" | "unresolved" | "unruled";

interface Ruled {
    readonly key: string;
    readonly outcome: FieldOutcome;
    readonly relation: ReferenceRelation;
    readonly rule: FieldRule | null;
}

interface Rules {
    readonly overrides: ReadonlyMap<string, FieldRule>;
    readonly vocabulary: Vocabulary;
}

const rulingOf = function rulingOf(rule: FieldRule): Ruling {
    return { outcome: rule.relation === null ? "inverse" : "emitted", rule };
};

const overrideFor = function overrideFor(override: FieldRule, vocabulary: Vocabulary): Ruling {
    const declared = override.relation === null || vocabulary.pairs.some((pair) => pair.forward === override.relation);
    return declared ? rulingOf(override) : UNDECLARED;
};

const ruleFor = function ruleFor(source: Source, relation: string, rules: Rules): Ruling {
    const override =
        rules.overrides.get(`${source.face}:${source.kind}:${relation}`) ??
        rules.overrides.get(`${source.face}:${relation}`);
    if (override !== undefined) {
        return overrideFor(override, rules.vocabulary);
    }
    if (rules.vocabulary.pairs.some((pair) => pair.forward === relation)) {
        return rulingOf({ flip: false, relation });
    }
    const reversed = rules.vocabulary.pairs.filter((pair) => pair.reverse === relation);
    if (reversed.length === 1) {
        return rulingOf({ flip: true, relation: reversed[0]?.forward ?? null });
    }
    return reversed.length > 1 ? AMBIGUOUS : UNDECLARED;
};

const ruledFields = function ruledFields(
    source: Source,
    relations: readonly ReferenceRelation[],
    rules: Rules,
): readonly Ruled[] {
    return relations.map((relation) => {
        const ruling = ruleFor(source, relation.relation, rules);
        return {
            key: `${source.face}:${source.kind}:${relation.relation}`,
            outcome: ruling.outcome,
            relation,
            rule: ruling.rule,
        };
    });
};

const targetOutcome = function targetOutcome(held: Ruled, target: string | null): TargetOutcome {
    if (held.outcome !== "emitted") {
        return "unruled";
    }
    return target === null ? "unresolved" : "emitted";
};

const edgeOf = function edgeOf(ref: string, held: Ruled, target: string): GraphEdge {
    const forward = held.rule?.relation ?? "";
    return held.rule?.flip === true
        ? { from: target, relation: forward, to: ref }
        : { from: ref, relation: forward, to: target };
};

const tally = function tally(name: string, outcomes: readonly string[], parts: readonly string[]): Population {
    const counts = Object.fromEntries(parts.map((part) => [part, outcomes.filter((held) => held === part).length]));
    return { name, parts: counts, whole: outcomes.length };
};

const uniqueBy = function uniqueBy<T>(entries: readonly (readonly [string, T])[]): T[] {
    return [...new Map(entries).values()];
};

export const ontologyGraph = function ontologyGraph(
    faces: ReferenceFaces,
    vocabulary: Vocabulary,
    overrides: ReadonlyMap<string, FieldRule>,
): OntologyGraph {
    const records = [...faces].flatMap(([face, index]) =>
        Object.entries(index).map(([ref, record]) => ({ face, record, ref })),
    );
    const fields = records.flatMap((held) =>
        ruledFields({ face: held.face, kind: held.record.kind, ref: held.ref }, held.record.relations, {
            overrides,
            vocabulary,
        }).map((ruled) => ({ held, ruled })),
    );
    const targets = fields.flatMap(({ held, ruled }) =>
        ruled.relation.edges.map((edge) => ({ edge, held, outcome: targetOutcome(ruled, edge.ref), ruled })),
    );
    const named = function named(outcome: FieldOutcome): (readonly [string, Undeclared])[] {
        return fields
            .filter(({ ruled }) => ruled.outcome === outcome)
            .map(({ held, ruled }) => [
                ruled.key,
                { face: held.face, kind: held.record.kind, relation: ruled.relation.relation },
            ]);
    };
    return {
        ambiguous: uniqueBy(named("ambiguous")),
        edges: targets.flatMap(({ edge, held, outcome, ruled }) =>
            outcome === "emitted" && edge.ref !== null ? [edgeOf(held.ref, ruled, edge.ref)] : [],
        ),
        fields: uniqueBy(
            fields.flatMap(({ held, ruled }) =>
                ruled.rule === null
                    ? []
                    : [
                          [
                              ruled.key,
                              {
                                  face: held.face,
                                  flip: ruled.rule.flip,
                                  kind: held.record.kind,
                                  relation: ruled.relation.relation,
                                  stored: ruled.rule.relation,
                              },
                          ] as const,
                      ],
            ),
        ),
        nodes: records.map((held) => graphNode(held.ref, held.record.kind, ONTOLOGY_LAYER, held.record.name)),
        populations: [
            tally(
                "records",
                records.map(() => "read"),
                ["read"],
            ),
            tally(
                "relation fields",
                fields.map(({ ruled }) => ruled.outcome),
                ["emitted", "inverse", "ambiguous", "undeclared"],
            ),
            tally(
                "relation targets",
                targets.map(({ outcome }) => outcome),
                ["emitted", "unresolved", "unruled"],
            ),
        ],
        undeclared: uniqueBy(named("undeclared")),
        unresolved: targets
            .filter(({ outcome }) => outcome === "unresolved")
            .map(({ edge, held, ruled }) => ({ from: held.ref, label: edge.label, relation: ruled.relation.relation })),
    };
};

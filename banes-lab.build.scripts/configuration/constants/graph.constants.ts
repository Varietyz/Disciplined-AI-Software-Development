import {
    CALLS_RELATION_ID,
    CONTAINS_RELATION,
    DETECTED_BY_RELATION,
    ENFORCED_BY_RELATION,
    RELATION_PAIRS,
    relationId,
} from "@banes-lab/web/constants/graph.constants";
import { CLOSED_VOCABULARIES, ONTOLOGY_SCHEMA } from "@govlab/context";
import type { FieldRule, Vocabulary } from "#types/graph.types";

export const CHUNK_STEM = "graph";
export const CHUNK_JOINER = ".";
export const GENERATED_TAG = ".generated";
export const CHUNK_SUFFIX = `${GENERATED_TAG}.ts`;
export const PRODUCER_SUFFIX = ".producer.ts";
export const ANATOMY_PREFIX = "anatomy:";
export const CHECK_RELATIONS: ReadonlySet<string> = new Set([ENFORCED_BY_RELATION, DETECTED_BY_RELATION]);
export const ASSET_SPECIFIER = "#core/generated/";
export const SITE_LAYER = "site";

export const ONTOLOGY_LAYER = "ontology";
export const SECTION_KIND = "section";
export const PART_KIND = "part";
export const PAGE_KIND = "page";
export const TAB_KIND = "tab";
export const CHAPTER_PREFIX = "chapter:";
export const ROUTE_PREFIX = "route:";
export const SOURCE_FACET = "source";
export const ONTOLOGY_FACET = "ontology";
export const RECORDS_POPULATION = "records";
export const COVERED_KINDS: ReadonlySet<string> = new Set(["section", "file", "definition"]);

export const EXPECTED_ABSENCES: ReadonlyMap<string, ReadonlyMap<string, string>> = new Map();

export const AXES_RELATION = "axes";
export const LENSES_RELATION = "lenses";
export const NODES_RELATION = "nodes";
export const TEST_SURFACES_RELATION = "testSurfaces";
export const SURFACES_RELATION = "surfaces";
export const TECHNIQUES_RELATION = "techniques";

const REVERSE_SUFFIX = "-of";

export const GRAPH_VOCABULARY: Vocabulary = {
    calls: CALLS_RELATION_ID,
    contains: CONTAINS_RELATION,
    pairs: [
        ...RELATION_PAIRS,
        ...CLOSED_VOCABULARIES.map((vocabulary) => ({
            forward: vocabulary.relation,
            reverse: vocabulary.relation + REVERSE_SUFFIX,
        })),
    ],
};

const flipped = function flipped(relation: string): FieldRule {
    return { flip: true, relation };
};

const kept = function kept(relation: string): FieldRule {
    return { flip: false, relation };
};

const inverseOnly = function inverseOnly(): FieldRule {
    return { flip: false, relation: null };
};

const PATH_MARK = ".";
const SNAKE_MARK = "_";

const relationOf = function relationOf(path: string): string {
    return relationId(path.split(PATH_MARK).join(SNAKE_MARK));
};

const schemaRules = function schemaRules(): (readonly [string, FieldRule])[] {
    return [...ONTOLOGY_SCHEMA].flatMap(([kind, schema]) =>
        Object.entries(schema).flatMap(([path, spec]) => [
            ...(spec.relation === undefined
                ? []
                : [[`${kind}:${relationOf(path)}`, { flip: spec.flip === true, relation: spec.relation }] as const]),
            ...(spec.inverse === undefined || spec.target === undefined
                ? []
                : [
                      [
                          `${spec.target}:${relationOf(spec.inverse)}`,
                          { flip: spec.flip !== true, relation: spec.relation ?? relationOf(path) },
                      ] as const,
                  ]),
        ]),
    );
};

export const GRAPH_FIELD_RULES: ReadonlyMap<string, FieldRule> = new Map([
    ...schemaRules(),
    ["architecture:tensions", flipped("tensions-with")],
    ["architecture:referenced-by", inverseOnly()],
    ["lexicon:referenced-by", inverseOnly()],
    ["reasoning:referenced-by", inverseOnly()],
    ["architecture-category:principle", flipped("category")],
    ["lexicon-category:terms", flipped("category")],
    ["algorithms-domain:contracts", flipped("domain")],
    ["force:principles", flipped("force")],
    ["stage:edges", kept("transitions-to")],
    ["layer:referenced-by", flipped("layer")],
    ["reasoning:loop:stages", kept("contains")],
]);

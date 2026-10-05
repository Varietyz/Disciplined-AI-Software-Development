import type { CatalogRule, ConceptEntry } from "#types/catalog.types";
import type { ConceptKnob, KnobConcept, MappingConcept, MappingEntry } from "#types/canon.types";
import { stringArrayField, stringField } from "#core/selectors/record.selector";
import { TOGGLE_KNOB } from "#configuration/constants/emitter.constants";
import { TOGGLE_VALUE_TYPE } from "#configuration/constants/canon.constants";

interface Grouped {
    ecosystems: Set<string>;
    ruleIds: Set<string>;
}

type ByTool = Map<string, Grouped>;

interface Base {
    lang: string[] | string;
    ruleIds: string[];
}

const canonicalOf = function canonicalOf(rule: CatalogRule): string[] {
    const { canonical } = rule;
    return typeof canonical === "string" ? [canonical] : stringArrayField(rule, "canonical");
};

const groupByConcept = function groupByConcept(rules: readonly CatalogRule[]): Map<string, ByTool> {
    const byConcept = new Map<string, ByTool>();
    for (const rule of rules) {
        const tool = stringField(rule, "tool");
        for (const concept of canonicalOf(rule)) {
            const byTool = byConcept.get(concept) ?? new Map<string, Grouped>();
            const grouped = byTool.get(tool) ?? { ecosystems: new Set<string>(), ruleIds: new Set<string>() };
            grouped.ecosystems.add(stringField(rule, "ecosystem"));
            grouped.ruleIds.add(rule.ruleId);
            byTool.set(tool, grouped);
            byConcept.set(concept, byTool);
        }
    }
    return byConcept;
};

const knobEntry = function knobEntry(knob: ConceptKnob, base: Base, tool: string): MappingEntry {
    return {
        default: knob.default === undefined ? null : knob.default,
        fidelity: knob.fidelity,
        knob: knob.knob,
        lang: base.lang,
        provenance: knob.provenance,
        ruleCount: base.ruleIds.length,
        ruleIds: base.ruleIds,
        tool,
        verified: "doc-only",
        ...(knob.fixed === true ? { fixed: true } : {}),
        ...(knob.variant === undefined || knob.variant === "" ? {} : { variant: knob.variant }),
    };
};

const plainEntry = function plainEntry(base: Base, tool: string, valueType: string): MappingEntry {
    const common = { lang: base.lang, ruleCount: base.ruleIds.length, ruleIds: base.ruleIds, tool };
    return valueType === TOGGLE_VALUE_TYPE
        ? { ...common, fidelity: "exact", knob: TOGGLE_KNOB, verified: "doc-only" }
        : { ...common, fidelity: null, knob: null, knobStatus: "undiscovered", verified: "unverified" };
};

const entryForTool = function entryForTool(
    tool: string,
    grouped: Grouped,
    concept: { knob: KnobConcept | undefined; valueType: string },
): MappingEntry {
    const ruleIds = [...grouped.ruleIds].toSorted((a, b) => a.localeCompare(b));
    const ecosystems = [...grouped.ecosystems].toSorted((a, b) => a.localeCompare(b));
    const base = { lang: ecosystems.length === 1 ? (ecosystems[0] ?? "") : ecosystems, ruleIds };
    const knob = concept.knob?.tools[tool];
    return knob ? knobEntry(knob, base, tool) : plainEntry(base, tool, concept.valueType);
};

export const mappingConcepts = function mappingConcepts(
    rules: readonly CatalogRule[],
    concepts: readonly ConceptEntry[],
    knobs: Readonly<Record<string, KnobConcept>>,
): Map<string, MappingConcept> {
    const dimensionOf = new Map(concepts.map((concept) => [concept.id, concept.dimension]));
    const byConcept = groupByConcept(rules);
    const out = new Map<string, MappingConcept>();
    for (const id of [...byConcept.keys()].toSorted((a, b) => a.localeCompare(b))) {
        const knob = knobs[id];
        const valueType = knob ? knob.valueType : TOGGLE_VALUE_TYPE;
        const entries = [...(byConcept.get(id) ?? [])]
            .map(([tool, grouped]) => entryForTool(tool, grouped, { knob, valueType }))
            .toSorted((a, b) => b.ruleCount - a.ruleCount);
        out.set(id, {
            dimension: dimensionOf.get(id) ?? "unknown",
            entries,
            ruleCount: entries.reduce((sum, entry) => sum + entry.ruleCount, 0),
            toolCount: entries.length,
            valueType,
            ...(knob?.enum === undefined || knob.enum === null ? {} : { enum: knob.enum }),
        });
    }
    return out;
};

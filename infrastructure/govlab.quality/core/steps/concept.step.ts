import type { CatalogRule, ConceptEntry } from "#types/catalog.types";
import { loadConceptDefinitions, loadExemplars } from "#core/loaders/concept.loader";
import { CONCEPT_SAMPLE_MAX } from "#configuration/constants/concept.constants";
import type { ConceptDefinition } from "#types/concept.types";
import { absolutePath } from "@ssot/paths";
import { conceptsOfRule } from "#core/classifiers/concept.classifier";
import { defineStep } from "#core/registries/step.registry";
import { stringField } from "#core/selectors/record.selector";
import { undeclaredConcept } from "#configuration/strings/catalog.strings";

const PCT_SCALE = 100;
const PROMILLE = 1000;
const PROMILLE_DIV = 10;

interface Tally {
    byEcosystem: Record<string, number>;
    byTool: Record<string, number>;
    dimension: string;
    sample: string[];
    total: number;
}

const bump = function bump(counts: Record<string, number>, key: string): void {
    counts[key] = (counts[key] ?? 0) + 1;
};

const tallyRule = function tallyRule(
    tallies: Map<string, Tally>,
    rule: CatalogRule,
    concepts: readonly string[],
): void {
    const tool = stringField(rule, "tool");
    for (const concept of concepts) {
        const tally = tallies.get(concept);
        if (!tally) {
            throw new Error(undeclaredConcept(tool, rule.ruleId, concept));
        }
        tally.total += 1;
        bump(tally.byTool, tool);
        bump(tally.byEcosystem, stringField(rule, "ecosystem"));
        if (tally.sample.length < CONCEPT_SAMPLE_MAX) {
            tally.sample.push(`${tool}:${rule.ruleId}`);
        }
    }
};

const conceptEntries = function conceptEntries(tallies: Map<string, Tally>): ConceptEntry[] {
    const exemplars = loadExemplars();
    return [...tallies]
        .map(([id, tally]): ConceptEntry => {
            const exemplar = exemplars[id];
            return {
                byEcosystem: tally.byEcosystem,
                byTool: tally.byTool,
                dimension: tally.dimension,
                id,
                sample: tally.sample,
                tools: Object.keys(tally.byTool).length,
                total: tally.total,
                ...(exemplar === undefined || exemplar === null ? {} : { exemplar }),
            };
        })
        .toSorted((a, b) => b.total - a.total);
};

const summaryOf = function summaryOf(
    classified: readonly CatalogRule[],
    concepts: readonly ConceptEntry[],
): Record<string, unknown> {
    const mapped = classified.filter((rule) => Array.isArray(rule["canonical"])).length;
    const memberships = concepts.reduce((sum, concept) => sum + concept.total, 0);
    const byDimension: Record<string, number> = {};
    for (const concept of concepts) {
        byDimension[concept.dimension] = (byDimension[concept.dimension] ?? 0) + concept.total;
    }
    return {
        avgConceptsPerMappedRule: mapped ? Math.round((memberships / mapped) * PCT_SCALE) / PCT_SCALE : 0,
        byDimension,
        concepts: concepts.length,
        mapped,
        mappedPct: Math.round((mapped / classified.length) * PROMILLE) / PROMILLE_DIV,
        memberships,
        multiConcept: classified.filter((rule) => Array.isArray(rule["canonical"]) && rule["canonical"].length > 1)
            .length,
        totalRules: classified.length,
        unmapped: classified.length - mapped,
    };
};

const tallyFor = function tallyFor(definitions: readonly ConceptDefinition[]): Map<string, Tally> {
    return new Map(
        definitions.map((definition): [string, Tally] => [
            definition.id,
            { byEcosystem: {}, byTool: {}, dimension: definition.dimension, sample: [], total: 0 },
        ]),
    );
};

defineStep({
    gives: ["classified", "concepts"],
    name: "concept",
    needs: ["rules"],
    run: async (state, writer) => {
        const definitions = loadConceptDefinitions();
        const tallies = tallyFor(definitions);
        const classified = (state.rules ?? []).map((rule): CatalogRule => {
            const concepts = conceptsOfRule(rule, definitions);
            tallyRule(tallies, rule, concepts);
            return { ...rule, canonical: concepts.length > 0 ? concepts : null };
        });
        const concepts = conceptEntries(tallies);
        await writer.json(absolutePath("govlab.quality.generated.concepts"), {
            concepts,
            summary: summaryOf(classified, concepts),
        });
        return { classified, concepts };
    },
});

import { EMPTY_CONCERN_ID, duplicateConcern, unknownResolvedConcern } from "#configuration/strings/quality.strings";
import type {
    Indices,
    Logger,
    OntologyIssues,
    QualityRelations,
    QualityRelationsOptions,
    ResolveResult,
    RuleIndices,
} from "#types/quality.types";
import type { QualityConcept, QualityConcern, QualityData, QualityRule, QualityTool } from "#types/catalog.types";
import { loadQualityData } from "#core/loaders/quality.loader";
import { matchesFilter } from "#core/predicates/concern.predicate";

interface ConcernContribution {
    concern: QualityConcern;
    ruleGroup: QualityRule[];
    knobPerTool?: Record<string, string> | undefined;
}

const indexById = function indexById<T extends { id: string }>(items: T[]): Map<string, T> {
    return new Map(items.filter((item) => item.id).map((item): [string, T] => [item.id, item]));
};

const ensureIn = function ensureIn<T>(map: Map<string, T>, key: string, make: () => T): T {
    const value = map.get(key) ?? make();
    map.set(key, value);
    return value;
};

const indexConcerns = function indexConcerns(concerns: QualityConcern[], logger?: Logger): Map<string, QualityConcern> {
    const map = new Map<string, QualityConcern>();
    for (const concern of concerns) {
        if (!concern.id) {
            logger?.warn(EMPTY_CONCERN_ID);
            continue;
        }
        if (map.has(concern.id)) {
            logger?.warn(duplicateConcern(concern.id));
        }
        map.set(concern.id, concern);
    }
    return map;
};

const indexRules = function indexRules(rules: QualityRule[]): RuleIndices {
    const idx: RuleIndices = {
        byRule: new Map(),
        concernEcosystems: new Map(),
        concernTools: new Map(),
        rulesByConcern: new Map(),
    };
    for (const rule of rules) {
        idx.byRule.set(rule.id, rule);
        if (rule.concern) {
            ensureIn(idx.rulesByConcern, rule.concern, () => []).push(rule);
            ensureIn(idx.concernTools, rule.concern, () => new Set<string>()).add(rule.tool);
            ensureIn(idx.concernEcosystems, rule.concern, () => new Set<string>()).add(rule.ecosystem);
        }
    }
    return idx;
};

const buildIndices = function buildIndices(data: QualityData, logger?: Logger): Indices {
    const concerns = data.concerns.map((record): QualityConcern => ({ ...record, id: record.name }));
    const rules = data.rules.map((record): QualityRule => ({ ...record, id: record.name }));
    const tools = data.tools.map((record): QualityTool => ({ ...record, id: record.name }));
    const ruleIndices = indexRules(rules);
    return {
        ...ruleIndices,
        byConceptId: indexById(data.concepts),
        byConcern: indexConcerns(concerns, logger),
        byTool: indexById(tools),
        concepts: data.concepts,
        concerns,
        rules,
        tools,
    };
};

const concernContribution = function concernContribution(
    indices: Indices,
    id: string,
    logger?: Logger,
): ConcernContribution | null {
    const concern = indices.byConcern.get(id);
    if (!concern) {
        logger?.warn(unknownResolvedConcern(id));
        return null;
    }
    return { concern, knobPerTool: concern.knobPerTool, ruleGroup: [...(indices.rulesByConcern.get(id) ?? [])] };
};

const resolveImpl = function resolveImpl(indices: Indices, concernIds: string[], logger?: Logger): ResolveResult {
    const contributions = concernIds
        .map((id) => concernContribution(indices, id, logger))
        .filter((contribution): contribution is ConcernContribution => contribution !== null);
    const allRules = contributions.flatMap((contribution) => contribution.ruleGroup);
    const touched = [...new Set(allRules.map((rule) => rule.tool))].sort((a, b) => a.localeCompare(b));
    return {
        concerns: contributions.map((contribution) => contribution.concern),
        knobPerTool: Object.fromEntries(
            contributions.flatMap((contribution) =>
                contribution.knobPerTool ? [[contribution.concern.id, contribution.knobPerTool]] : [],
            ),
        ),
        rules: allRules,
        rulesByConcern: Object.fromEntries(
            contributions.map((contribution) => [contribution.concern.id, contribution.ruleGroup]),
        ),
        tools: touched.map((id) => indices.byTool.get(id)).filter((tool): tool is QualityTool => Boolean(tool)),
        values: Object.fromEntries(
            contributions.map((contribution) => [contribution.concern.id, contribution.concern.value]),
        ),
    };
};

const validateImpl = function validateImpl(indices: Indices): OntologyIssues {
    return {
        concernsWithoutValue: [],
        danglingRuleConcerns: indices.rules
            .filter((rule) => rule.concern !== "" && !indices.byConcern.has(rule.concern))
            .map((rule) => ({ concern: rule.concern, rule: rule.id })),
        rulesWithoutConcern: indices.rules.filter((rule) => rule.concern === "").map((rule) => rule.id),
        toolsWithoutEcosystem: indices.tools.filter((tool) => !tool.ecosystem).map((tool) => tool.id),
    };
};

const ecosystemsOf = function ecosystemsOf(rules: QualityRule[]): string[] {
    return [...new Set(rules.map((rule) => rule.ecosystem).filter(Boolean))].sort((a, b) => a.localeCompare(b));
};

export const createQualityRelations = function createQualityRelations(
    options: QualityRelationsOptions = {},
): QualityRelations {
    const { logger } = options;
    const indices = buildIndices(options.data ?? loadQualityData(), logger);
    return {
        concept: (id): QualityConcept | null => indices.byConceptId.get(id) ?? null,
        concepts: (): QualityConcept[] => [...indices.concepts],
        concern: (id): QualityConcern | null => indices.byConcern.get(id) ?? null,
        concerns: (): QualityConcern[] => [...indices.concerns],
        ecosystems: (): string[] => ecosystemsOf(indices.rules),
        query: (filter = {}): QualityConcern[] =>
            indices.concerns.filter((concern) => matchesFilter(indices, concern, filter)),
        resolve: (concernIds): ResolveResult => resolveImpl(indices, concernIds, logger),
        rule: (id): QualityRule | null => indices.byRule.get(id) ?? null,
        rules: (): QualityRule[] => [...indices.rules],
        rulesOf: (concernId): QualityRule[] => [...(indices.rulesByConcern.get(concernId) ?? [])],
        tool: (id): QualityTool | null => indices.byTool.get(id) ?? null,
        tools: (): QualityTool[] => [...indices.tools],
        validate: (): OntologyIssues => validateImpl(indices),
    };
};

import type { ConceptRecord } from "#types/readme.types";
import { isRecord } from "#core/predicates/record.predicate";
import { readJsonSafe } from "#core/loaders/base.loader";

const GOVLAB_TOOL_PREFIX = "govlab";
const CONCEPTS_KEY = "concepts";

const TOOL_BY_SLUG: ReadonlyMap<string, string> = new Map([
    ["context-lint", "govlab-context"],
    ["eslint-plugin", "govlab-eslint"],
    ["quality-engine", "govlab-native"],
    ["stylelint-plugin", "govlab-stylelint"],
]);

const conceptsOf = function conceptsOf(rule: Record<string, unknown>): string[] {
    const { canonical } = rule;
    if (Array.isArray(canonical)) {
        return canonical.filter((concept): concept is string => typeof concept === "string" && concept.length > 0);
    }
    return typeof canonical === "string" && canonical.length > 0 ? [canonical] : [];
};

const toolOf = function toolOf(rule: Record<string, unknown>): string | null {
    const { tool } = rule;
    return typeof tool === "string" && tool.startsWith(GOVLAB_TOOL_PREFIX) ? tool : null;
};

const buildByTool = function buildByTool(rules: readonly unknown[]): Map<string, Set<string>> {
    const byTool = new Map<string, Set<string>>();
    for (const rule of rules) {
        const tool = isRecord(rule) ? toolOf(rule) : null;
        if (tool !== null && isRecord(rule)) {
            byTool.set(tool, new Set([...(byTool.get(tool) ?? []), ...conceptsOf(rule)]));
        }
    }
    return byTool;
};

export const loadGovernanceDeriver = function loadGovernanceDeriver(
    allRulesPath: string,
): (slug: string) => string[] | null {
    const parsed = readJsonSafe(allRulesPath);
    const byTool = buildByTool(Array.isArray(parsed) ? parsed : []);
    return (slug: string): string[] | null => {
        const tool = TOOL_BY_SLUG.get(slug);
        const concepts = tool === undefined ? undefined : byTool.get(tool);
        if (concepts === undefined || concepts.size === 0) {
            return null;
        }
        return [...concepts].toSorted((left, right) => left.localeCompare(right));
    };
};

export const loadConceptMap = function loadConceptMap(indexPath: string): Map<string, ConceptRecord> {
    const data = readJsonSafe(indexPath);
    const concepts = isRecord(data) && Array.isArray(data[CONCEPTS_KEY]) ? data[CONCEPTS_KEY] : [];
    const map = new Map<string, ConceptRecord>();
    for (const concept of concepts) {
        if (isRecord(concept) && typeof concept["id"] === "string" && typeof concept["dimension"] === "string") {
            map.set(concept["id"], { dimension: concept["dimension"], id: concept["id"] });
        }
    }
    return map;
};

export const loadConceptIds = function loadConceptIds(indexPath: string): Set<string> {
    return new Set(loadConceptMap(indexPath).keys());
};

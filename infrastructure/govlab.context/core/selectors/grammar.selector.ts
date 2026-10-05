import type { ContextForResult, GrammarContext, KeywordRecord, KeywordRole, PagData } from "#types/grammar.types";
import { KEYWORD_SEPARATOR, REQUIRED_SECTIONS } from "#configuration/constants/grammar.constants";

export const keywordIdOf = function keywordIdOf(record: KeywordRecord): string {
    return record.keyword;
};

export const roleIdOf = function roleIdOf(record: KeywordRecord, role: KeywordRole): string {
    return `${role.category}${KEYWORD_SEPARATOR}${record.keyword}`;
};

export const hasRoleIn = function hasRoleIn(record: KeywordRecord, category: string): boolean {
    return record.roles.some((role) => role.category === category);
};

export const categoriesOf = function categoriesOf(data: PagData): string[] {
    return [...new Set(data.keywords.flatMap((record) => record.roles.map((role) => role.category)))].toSorted((a, b) =>
        a.localeCompare(b),
    );
};

const constructGroundsOf = function constructGroundsOf(data: PagData): Record<string, string[]> {
    const byCategory = new Map<string, Set<string>>();
    for (const role of data.keywords.flatMap((record) => record.roles)) {
        byCategory.set(role.category, new Set([...(byCategory.get(role.category) ?? []), ...(role.grounds ?? [])]));
    }
    return Object.fromEntries(
        [...byCategory].map(([category, set]) => [category, [...set].toSorted((a, b) => a.localeCompare(b))]),
    );
};

export const contextFor = function contextFor(type: string, ctx: GrammarContext): ContextForResult {
    const documentType = ctx.indexes.typeByName.get(type) ?? null;
    return {
        applicable: documentType !== null,
        contracts: documentType && ctx.resolver.contractsForType ? ctx.resolver.contractsForType(type) : [],
        documentType,
        grounding: {
            axis: documentType?.axis ?? null,
            constructGrounds: constructGroundsOf(ctx.data),
            model: documentType?.model ?? null,
        },
        palette: { constructs: categoriesOf(ctx.data), verbs: documentType ? [...documentType.verbs] : [] },
        requiredSections: [...REQUIRED_SECTIONS],
        template: ctx.indexes.templateByType.get(type) ?? null,
    };
};

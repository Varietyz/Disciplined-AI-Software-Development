import type { CatalogRule } from "#types/anatomy.types";
import { canonRefsFor } from "@govlab/quality/configuration/quality/generated/canon.generated.ts";
import { createQualityRelations } from "@govlab/quality/relations";

export const ruleRecordsOf = function ruleRecordsOf(
    rules: readonly CatalogRule[],
    records: ReadonlySet<string>,
): ReadonlyMap<string, string> {
    const concepts = new Map<string, Set<string>>();
    for (const rule of rules) {
        const held = concepts.get(rule.ruleId) ?? new Set<string>();
        for (const concept of rule.canonical ?? []) {
            held.add(concept);
        }
        concepts.set(rule.ruleId, held);
    }
    const resolved = new Map<string, string>();
    for (const [id, held] of concepts) {
        const refs = [...new Set(canonRefsFor([...held]))].filter((ref) => records.has(ref));
        const only = refs.find(() => refs.length === 1);
        if (only !== undefined) {
            resolved.set(id, only);
        }
    }
    return resolved;
};

export const catalogRuleRecord = function catalogRuleRecord(
    records: ReadonlySet<string>,
): (text: string) => string | null {
    const resolved = ruleRecordsOf(createQualityRelations().rules(), records);
    return (text) => resolved.get(text) ?? null;
};

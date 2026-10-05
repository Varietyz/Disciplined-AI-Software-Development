import type { BindingFinding, RuleSource } from "#types/binding.types";
import { ALGO_FACE } from "@govlab/constants";
import { canonicalOf } from "#core/parsers/binding.parser";

export const bindingFindings = function bindingFindings(
    rules: readonly RuleSource[],
    contracts: ReadonlySet<string>,
    isConcept: (concept: string) => boolean,
): BindingFinding[] {
    return rules.flatMap((rule): BindingFinding[] => {
        const findings: BindingFinding[] = [];
        if (!contracts.has(rule.id)) {
            findings.push({ detail: `${ALGO_FACE}:${rule.id}`, file: rule.file, id: rule.id, reason: "no-contract" });
        }
        const canonical = canonicalOf(rule.text);
        if (canonical === null || canonical.length === 0) {
            findings.push({ detail: "", file: rule.file, id: rule.id, reason: "no-canonical" });
            return findings;
        }
        for (const concept of canonical.filter((entry) => !isConcept(entry))) {
            findings.push({ detail: concept, file: rule.file, id: rule.id, reason: "unknown-concept" });
        }
        return findings;
    });
};

import { DECLARING_TOOL_PREFIX, EXPLICIT_CONCEPTS } from "#configuration/constants/concept.constants";
import { stringArrayField, stringField } from "#core/selectors/record.selector";
import type { CatalogRule } from "#types/catalog.types";
import type { ConceptDefinition } from "#types/concept.types";
import { isDigit } from "@govlab/constants";

const isAlnumChar = (ch: string): boolean => (ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9");

const tokenize = function tokenize(text: string): Set<string> {
    let marked = "";
    for (const ch of text.toLowerCase()) {
        marked += isAlnumChar(ch) ? ch : " ";
    }
    return new Set(marked.split(" ").filter(Boolean));
};

const digitRuns = function digitRuns(value: string): string[] {
    const runs: string[] = [];
    let digits = "";
    for (const ch of value.toLowerCase()) {
        if (isDigit(ch)) {
            digits += ch;
            continue;
        }
        if (digits) {
            runs.push(digits);
            digits = "";
        }
    }
    return digits ? [...runs, digits] : runs;
};

const cweSet = function cweSet(rule: CatalogRule): Set<string> {
    const { cwe } = rule;
    const declared = typeof cwe === "string" && cwe !== "" ? [cwe] : stringArrayField(rule, "cwe");
    const tagged = stringArrayField(rule, "tags").filter((tag) => tag.toLowerCase().includes("cwe"));
    return new Set([...declared, ...tagged].flatMap(digitRuns));
};

const matchesConcept = function matchesConcept(concept: ConceptDefinition, hay: string, words: Set<string>): boolean {
    if (concept.exclude.some((phrase) => hay.includes(phrase))) {
        return false;
    }
    return concept.phrases.some((phrase) => hay.includes(phrase)) || concept.words.some((word) => words.has(word));
};

const matchedConcepts = function matchedConcepts(
    rule: CatalogRule,
    definitions: readonly ConceptDefinition[],
): string[] {
    const hay = `${stringField(rule, "name")} ${stringField(rule, "description")} ${stringField(rule, "category")}`
        .toLowerCase()
        .split("`")
        .join("");
    const words = tokenize(hay);
    const cwes = cweSet(rule);
    return definitions
        .filter((concept) => concept.cwe.some((code) => cwes.has(code)) || matchesConcept(concept, hay, words))
        .map((concept) => concept.id);
};

export const conceptsOfRule = function conceptsOfRule(
    rule: CatalogRule,
    definitions: readonly ConceptDefinition[],
): string[] {
    const tool = stringField(rule, "tool");
    const explicit = EXPLICIT_CONCEPTS.get(`${tool}:${rule.ruleId}`);
    if (explicit) {
        return [...explicit];
    }
    const declared = tool.startsWith(DECLARING_TOOL_PREFIX) ? stringArrayField(rule, "canonical") : [];
    return declared.length > 0 ? declared : matchedConcepts(rule, definitions);
};

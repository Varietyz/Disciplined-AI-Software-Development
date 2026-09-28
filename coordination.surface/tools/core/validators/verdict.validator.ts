import { MIDDLE_TIERS } from "../constants/verdict.constants.ts";
import { RULE_ROOT } from "../constants/layer.constants.ts";
import { isWordCharacter } from "../predicates/token.predicate.ts";
import { localImports } from "../analyzers/graph.analyzer.ts";
import { stringLiterals } from "../predicates/literal.predicate.ts";

interface Tier {
    readonly tier: string;
    readonly line: number;
}

const isUpper = function isUpper(char: string): boolean {
    return char >= "A" && char <= "Z";
};

const isAllUpper = function isAllUpper(word: string): boolean {
    for (const char of word) {
        if (!isUpper(char)) {
            return false;
        }
    }
    return true;
};

const declaresTier = function declaresTier(source: string): boolean {
    return stringLiterals(source).some((literal) => MIDDLE_TIERS.includes(literal.value.toLowerCase()));
};

const claimedByRule = function claimedByRule(
    path: string,
    paths: readonly string[],
    read: (path: string) => string,
    known: ReadonlySet<string>,
): boolean {
    return paths
        .filter((consumer) => consumer.startsWith(RULE_ROOT))
        .some((consumer) => localImports(consumer, read(consumer), known).includes(path));
};

export const escapedVocabulary = function escapedVocabulary(
    paths: readonly string[],
    read: (path: string) => string,
    exemption: readonly string[],
): string[] {
    const known = new Set(paths);
    return paths
        .filter((path) => exemption.some((root) => path.startsWith(root)))
        .filter((path) => declaresTier(read(path)))
        .filter((path) => !claimedByRule(path, paths, read, known));
};

const wordEnd = function wordEnd(source: string, from: number): number {
    let end = from;
    while (end < source.length && isWordCharacter(source.charAt(end))) {
        end += 1;
    }
    return end;
};

export const declaredTiers = function declaredTiers(source: string): Tier[] {
    const out: Tier[] = [];
    let line = 1;
    let index = 0;

    while (index < source.length) {
        const char = source.charAt(index);
        if (isWordCharacter(char)) {
            const end = wordEnd(source, index);
            const word = source.slice(index, end);
            if (isAllUpper(word) && MIDDLE_TIERS.includes(word.toLowerCase())) {
                out.push({ line, tier: word.toLowerCase() });
            }
            index = end;
        } else {
            line += char === "\n" ? 1 : 0;
            index += 1;
        }
    }

    return out;
};

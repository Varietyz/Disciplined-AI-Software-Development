import type { DomainTier } from "#types/algorithm.types";
import type { VocabularyEntry } from "#types/vocabulary.types";

export const DOMAIN_TIER_VOCABULARY = [
    {
        definition:
            "A domain whose contracts run at a stage of the derivation loop and carry a stage, an axis, a math type and a yield.",
        value: "process",
    },
    { definition: "A domain whose contracts carry a math type and a yield and run at no loop stage.", value: "leaf" },
    { definition: "A domain whose contracts carry no math type, yield or loop stage.", value: "exempt" },
] as const satisfies readonly VocabularyEntry[];

export const DOMAIN_TIER_VALUES: readonly DomainTier[] = DOMAIN_TIER_VOCABULARY.map((entry) => entry.value);

export const DOMAIN_TIERS = { exempt: "exempt", leaf: "leaf", process: "process" } as const satisfies Record<
    DomainTier,
    DomainTier
>;

export const TYPED_TIERS: ReadonlySet<string> = new Set([DOMAIN_TIERS.process, DOMAIN_TIERS.leaf]);

export const ALGO_SUBJECT = "algo";

export const SYMBOLS_KEY = "symbols";

export const TIER_KEY = "tier";

export const COMPOSES_RELATION = "composes";

export const CORE_DEGREE = 2;

export const SYMBOL_NAME_SEPARATOR = " ";

export const MIN_QUOTED_LENGTH = 2;

export const QUOTE_PAIR_COUNT = 2;

export const QUOTE = '"';

export const ALTERNATIVE_SEPARATOR = "|";

export const NONTERMINAL_OPEN = "<";

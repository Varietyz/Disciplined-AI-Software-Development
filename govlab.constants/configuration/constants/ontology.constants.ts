export const ARCH_FACE = "architecture";
export const LEX_FACE = "lexicon";
export const ALGO_FACE = "algorithms";
export const REASON_FACE = "reasoning";
export const STAGE_FACE = "stage";
export const TENSION_FACE = "tension";
export const LAYER_FACE = "layer";
export const FORCE_FACE = "force";
export const KIND_FACE = "kind";
export const RELATION_FACE = "relation";
export const ARCH_CATEGORY_FACE = "architecture-category";
export const LEX_CATEGORY_FACE = "lexicon-category";
export const ALGO_DOMAIN_FACE = "algorithms-domain";
export const PAG_FACE = "pag";
export const VOCABULARY_FACE = "vocabulary";

export const FACE_SEPARATOR = ":";

export const ONTOLOGY_FACES: ReadonlySet<string> = new Set([
    ARCH_FACE,
    LEX_FACE,
    ALGO_FACE,
    REASON_FACE,
    STAGE_FACE,
    TENSION_FACE,
    LAYER_FACE,
    FORCE_FACE,
    KIND_FACE,
    RELATION_FACE,
    ARCH_CATEGORY_FACE,
    LEX_CATEGORY_FACE,
    ALGO_DOMAIN_FACE,
    PAG_FACE,
    VOCABULARY_FACE,
]);

export const REQUIRES_RELATION = "requires";
export const REINFORCES_RELATION = "reinforces";
export const ENABLES_RELATION = "enables";
export const CONFLICTS_WITH_RELATION = "conflicts-with";
export const TENSIONS_WITH_RELATION = "tensions-with";
export const TENSIONS_RELATION = "tensions";
export const CONTRACTS_RELATION = "contracts";
export const TERM_RELATION = "term";
export const REFERENCED_BY_RELATION = "referenced-by";
export const CATEGORY_RELATION = "category";
export const PRINCIPLE_RELATION = "principle";
export const CONTRACT_RELATION = "contract";
export const STAGE_RELATION = "stage";
export const AXIS_RELATION = "axis";
export const COMPOSES_RELATION = "composes";
export const COMPOSED_BY_RELATION = "composed-by";
export const GROUNDS_RELATION = "grounds";
export const GROUNDED_BY_RELATION = "grounded-by";
export const DERIVED_BY_RELATION = "derived-by";
export const DETECTS_RELATION = "detects";
export const REFACTORED_BY_RELATION = "refactored-by";
export const REFACTORS_RELATION = "refactors";
export const VIOLATED_BY_RELATION = "violated-by";
export const VIOLATES_RELATION = "violates";

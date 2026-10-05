export const CHECK_QUESTIONS = ["population", "freshness", "refusal", "observation", "evidence", "authority"] as const;

export const EVIDENCE_SIGNS = ["fires", "fires-and-accepts", "contradicted", "none"] as const;

export const EVIDENCE_QUESTION = "evidence";

export const SIGN_SEPARATOR = ":";

export const RECORD_KEY_SEPARATOR = ":";

export const BY_QUESTION = "by";

export const SHAPE_QUESTION = "shape";

export const DEPENDS_ON_QUESTION = "dependsOn";

export const CHECKING_EDGE_FIELDS = ["requires", "reinforces", "enables", "conflicts_with"] as const;

export const SECOND_CHECK_HOME = "check.by";

export const INVARIANT_KIND = "invariant";

export const DECLARATION_FIELDS = ["detects", "enforces"] as const;

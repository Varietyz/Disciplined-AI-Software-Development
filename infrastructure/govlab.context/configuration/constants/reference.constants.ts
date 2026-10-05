export const REASON_PREFIX = "reasoning:";

export const PAG_PREFIX = "pag:";

export const REF_SEPARATOR = ":";

export const REASON_COLLECTION_NAME = "reasoning";

export const PAG_SUBCOLLECTIONS = {
    doctype: "doctype",
    documentType: "document-type",
    keyword: "keyword",
    production: "production",
    template: "template",
} as const;

export const GATE_SUFFIX = "-gate";

export const DOMAIN_CONCEPT_CATEGORIES: ReadonlySet<string> = new Set([
    "arch-relationships",
    "architecture",
    "architectural-rules",
    "architectural-clusters",
    "anti-patterns",
    "css-cascade",
]);

export const PAG_GROUNDING_EXEMPT: ReadonlySet<string> = new Set(["contextual"]);

export const PAG_PRODUCTION_EXEMPT: ReadonlySet<string> = new Set(["document_declaration", "frontmatter"]);

export const ID_LABEL_SEPARATORS = [":", "-"] as const;

export const LABEL_SPACE = " ";

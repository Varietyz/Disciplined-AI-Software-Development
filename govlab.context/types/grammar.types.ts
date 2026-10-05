import type { PagDocument, TemplateResolveResult, ValidateResult } from "#types/grammar.document.types";
import type { CheckFacet } from "#types/check.types";
import type { DistinctDeclaration } from "#types/field.types";
import type { UnreadKey } from "#types/record.types";

export interface KeywordRole {
    category: string;
    meaning: string;
    example: string;
    grounds?: string[];
}

export interface KeywordRecord {
    keyword: string;
    roles: [KeywordRole, ...KeywordRole[]];
    aliases?: string[];
    distinctFrom?: DistinctDeclaration[];
}

export interface DocumentTypeRecord {
    type: string;
    defaultVerb: string;
    purpose: string;
    verbs: string[];
    aliases?: string[];
    grounds?: string[];
    model?: string;
    axis?: string;
}

export interface ProductionRecord {
    lhs: string;
    rhs: string;
    group: string;
    aliases?: string[];
    grounds?: string[];
}

export interface TemplateSlot {
    name: string;
    description: string;
    required: boolean;
    kind: string;
    enum?: string[];
}

export interface TemplateRecord {
    type: string;
    title: string;
    slots: TemplateSlot[];
    constraints: string[];
    body: string;
    aliases?: string[];
}

export interface PagData {
    keywords: KeywordRecord[];
    documentTypes: DocumentTypeRecord[];
    productions: ProductionRecord[];
    terminals: string[];
    templates: TemplateRecord[];
}

export interface ContractResolver {
    contractsForType?: (type: string) => string[];
}

export interface PagGrammarOptions {
    data?: PagData;
    resolver?: ContractResolver;
}

export interface ContextForResult {
    documentType: DocumentTypeRecord | null;
    applicable: boolean;
    palette: { verbs: string[]; constructs: string[] };
    grounding: { model: string | null; axis: string | null; constructGrounds: Record<string, string[]> };
    template: TemplateRecord | null;
    requiredSections: string[];
    contracts: string[];
}

export interface GrammarIssues {
    duplicateKeywordIds: string[];
    danglingTemplateSlots: { type: string; slot: string }[];
    docTypesWithoutVerb: string[];
    unknownTemplateTypes: string[];
    unrecognizedDocumentTypes: string[];
    unrecognizedDocumentVerbs: { type: string; verb: string }[];
    danglingNonterminals: { production: string; ref: string }[];
    unusedTerminals: string[];
}

export interface PagGrammar {
    attributions: () => string[];
    checkOf: (kind: string, id: string) => CheckFacet | null;
    keyword: (id: string) => KeywordRecord | null;
    keywords: (category?: string) => KeywordRecord[];
    categories: () => string[];
    documentType: (type: string) => DocumentTypeRecord | null;
    documentTypes: () => DocumentTypeRecord[];
    production: (lhs: string) => ProductionRecord | null;
    productions: () => ProductionRecord[];
    template: (type: string) => TemplateRecord | null;
    templates: () => TemplateRecord[];
    resolvePagTemplate: (type: string, slots: Record<string, string>) => TemplateResolveResult;
    parse: (text: string) => PagDocument;
    validate: (text: string) => ValidateResult;
    contextFor: (type: string) => ContextForResult;
    unreadKeys: () => UnreadKey[];
    validateOntology: () => GrammarIssues;
}

export interface GrammarIndexes {
    keywordById: Map<string, KeywordRecord>;
    typeByName: Map<string, DocumentTypeRecord>;
    productionByLhs: Map<string, ProductionRecord>;
    templateByType: Map<string, TemplateRecord>;
}

export interface GrammarContext {
    data: PagData;
    indexes: GrammarIndexes;
    resolver: ContractResolver;
}

export interface GrammarFile {
    object: Record<string, unknown>;
    source: string;
    kind: string;
}

export interface TemplateRef {
    readonly id: string;
    readonly kind: string;
    readonly line: number;
}

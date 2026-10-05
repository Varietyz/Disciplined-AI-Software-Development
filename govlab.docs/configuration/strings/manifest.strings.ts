export const MANIFEST_ERRORS = {
    algoGrammarShape: "'algoGrammar' must be an object ({ contracts: string[] })",
    capabilities: "'capabilities' must be an array of non-empty strings",
    contractsShape: "'algoGrammar.contracts' must be an array of non-empty strings",
    coversShape: "'coversSurfaces' must be an array of non-empty test-surface ids",
    docsShape: "'docs' must be an object",
    documentsShape: "'documents' must be an array of typed document declarations",
    domainsRequired: "'domains' is required — declare >=1 { meta, sub } from the software-domain vocabulary",
    ecosystem: "'ecosystem' must be a non-empty string when present",
    governanceShape: "'governance' must be an object ({ principles: string[] })",
    governedByShape: "'governedBy' must be an array of non-empty canonical concept ids",
    maturity: "'maturity' must be one of experimental | stable | deprecated",
    missingManifest: "_manifest.json is missing or not an object",
    principlesShape: "'governance.principles' must be an array of non-empty strings",
    repoMetrics: "'repoMetrics' must be a boolean (opt-in flag for the auto-derived repository-stats layer)",
    visibilityRequired: "'visibility' is required ({ private, hidden })",
    visibilityShape: "'visibility' must be an object",
} as const;

export const DOCS_FIELD_ERRORS = {
    aiContext: "docs.aiContext must be a renderable value (string | string[] | record[])",
    api: "docs.api must be a renderable value (string | string[] | record[])",
    apiNotes: "docs.apiNotes must be an array of { name, note } with non-empty strings",
    configuration: "docs.configuration must be a renderable value ([{ option, default, note }] records, or prose)",
    disposal: "docs.disposal must be a non-empty string array",
    install: "docs.install must be a string (empty to suppress the Install section) or a renderable value",
    overview: "docs.overview must be a non-empty string",
    quickStart: "docs.quickStart must be a renderable value ([{ intent, code }] records, or prose)",
    whenNotToUse: "docs.whenNotToUse must be a non-empty string array",
    whenToUse: "docs.whenToUse must be a non-empty string array",
} as const;

export const nonEmptyField = function nonEmptyField(field: string): string {
    return `'${field}' must be a non-empty string`;
};

export const visibilityFlag = function visibilityFlag(flag: string): string {
    return `visibility.${flag} must be a boolean`;
};

export const unknownVisibilityKey = function unknownVisibilityKey(key: string): string {
    return `unknown visibility key '${key}'`;
};

export const relationshipShape = function relationshipShape(field: string): string {
    return `'${field}' must be an array of { package, reason } with non-empty strings`;
};

export const computedField = function computedField(key: string): string {
    return `computed field '${key}' must not be declared (tooling derives it)`;
};

export const unknownKey = function unknownKey(key: string): string {
    return `unknown key '${key}'`;
};

export const unknownSectionKey = function unknownSectionKey(section: string, key: string): string {
    return `unknown ${section} key '${key}'`;
};

export const unknownContract = function unknownContract(id: string): string {
    return `algoGrammar.contracts: unknown contract id '${id}' (not in @govlab/context)`;
};

export const unknownPrinciple = function unknownPrinciple(id: string): string {
    return `governance.principles: unknown principle id '${id}' (not in @govlab/context)`;
};

export const unknownSurface = function unknownSurface(id: string): string {
    return `coversSurfaces: unknown test-surface id '${id}' (not in @govlab/context)`;
};

export const unknownConcept = function unknownConcept(id: string): string {
    return `governedBy: unknown canonical concept id '${id}' (not in @govlab/quality-relations canonical-index.generated.json)`;
};

export const deliverMode = function deliverMode(modes: string): string {
    return `'deliverAs' must be one of ${modes}`;
};

export const missingDocsField = function missingDocsField(key: string): string {
    return `docs is missing required field '${key}'`;
};

export const customDocsField = function customDocsField(key: string): string {
    return `custom docs field '${key}' must be a renderable value (string | string[] | record[])`;
};

export const documentType = function documentType(at: string, type: string): string {
    return `${at}.type '${type}' is not a non-boundary doc-arch form`;
};

export const documentConcern = function documentConcern(at: string, concern: string): string {
    return `${at}.concern '${concern}' is not a known doc-arch concern`;
};

export const documentMember = function documentMember(at: string, member: string, known: string): string {
    return `${at}.member '${member}' is not a declared workspace member. Known: ${known}.`;
};

export const sectionHeading = function sectionHeading(at: string, index: number): string {
    return `${at}.body[${index}].heading must be a non-empty string`;
};

export const sectionContent = function sectionContent(at: string, index: number): string {
    return `${at}.body[${index}].content must be renderable (string | string[] | record[])`;
};

export const documentBody = function documentBody(at: string): string {
    return `${at}.body must be a non-empty array of { heading, content }`;
};

export const documentObject = function documentObject(at: string): string {
    return `${at} must be an object`;
};

export const documentName = function documentName(at: string): string {
    return `${at}.name must be a kebab-case string`;
};

export const documentSummary = function documentSummary(at: string): string {
    return `${at}.summary must be a non-empty string`;
};

export const documentTitle = function documentTitle(at: string): string {
    return `${at}.title, when present, must be a non-empty string`;
};

export const documentLead = function documentLead(at: string): string {
    return `${at}.lead, when present, must be renderable (string | string[] | record[])`;
};

export const duplicateDocument = function duplicateDocument(index: number, name: string): string {
    return `documents[${index}].name '${name}' is declared twice in this manifest`;
};

export const domainObject = function domainObject(at: string): string {
    return `${at} must be an object { meta, sub }`;
};

export const unknownDomainMeta = function unknownDomainMeta(at: string, meta: string): string {
    return `${at}.meta '${meta}' is not a known software-domain meta`;
};

export const unknownDomainSub = function unknownDomainSub(at: string, sub: string, meta: string): string {
    return `${at}.sub '${sub}' is not a sub-domain of '${meta}'`;
};

export const duplicateDomain = function duplicateDomain(index: number, key: string): string {
    return `domains[${index}] '${key}' is declared twice`;
};

export const selfGovernedShape = function selfGovernedShape(key: string): string {
    return `'${key}' must be an object of { checker, paths, tests? }`;
};

export const selfGovernedField = function selfGovernedField(key: string, field: string): string {
    return `${key}.${field} must be a non-empty string`;
};

export const moduleError = function moduleError(label: string, error: string): string {
    return `${label}: ${error}`;
};

export const manifestErrorCount = function manifestErrorCount(count: number): string {
    return `✖ ${count} manifest error(s):`;
};

export const manifestsValid = function manifestsValid(count: number): string {
    return `✓ ${count} manifest(s) valid.`;
};

export const indentedError = function indentedError(error: string): string {
    return `   ${error}`;
};

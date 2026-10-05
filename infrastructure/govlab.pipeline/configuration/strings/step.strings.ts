export const STAGE_LABELS = {
    autoFix: "Auto-fix",
    build: "Build",
    format: "Format",
    linting: "Linting",
    prepare: "Prepare",
    testing: "Testing",
    unused: "Unused",
    validation: "Validation",
} as const;

export const STEP_LABELS = {
    bindCallableFields: "Bind callable fields",
    buildSite: "Build site",
    camelCaseConstNames: "Camel-case const names",
    codebaseTests: "Codebase tests",
    codemods: "Codemods",
    compoundIncrements: "Compound increments",
    crossFileQuality: "Cross-file quality",
    deadCss: "Dead CSS",
    deriveLeakSet: "Derive leak set",
    deriveLessonSeeds: "Derive lesson seeds",
    deriveRuleInventory: "Derive rule inventory",
    deriveToneBaseline: "Derive tone baseline",
    duplication: "Duplication",
    formatting: "Formatting",
    generateCodebaseCensus: "Generate codebase census",
    generateDocuments: "Generate documents",
    generateQualityCatalog: "Generate quality catalog",
    knip: "Knip",
    lintSurfaces: "Lint surfaces",
    lintWorkspaces: "Lint workspaces",
    locCap: "LOC cap",
    ownerFileWrites: "Owner file writes",
    oxlint: "oxlint type-aware",
    packageSpecifiers: "Package specifiers",
    preferCodePoint: "Prefer code point",
    pruneExtraneousPackages: "Prune extraneous packages",
    relativeSpecifiers: "Relative specifiers",
    syncClosureGraph: "Sync closure graph",
    taxonomy: "Taxonomy",
    testFloor: "Test floor",
    typecheck: "Typecheck",
    validateCanonVocabulary: "Validate canon vocabulary",
    validateClosedValues: "Validate closed values",
    validateConfig: "Validate config",
    validateContentGraph: "Validate content graph",
    validateContentLeaks: "Validate content leaks",
    validateCoordinationPackage: "Validate coordination package",
    validateCredentials: "Validate credential shapes",
    validateDiscovery: "Validate discovery",
    validateDocumentSpelling: "Validate document spelling",
    validateDocuments: "Validate documents",
    validateEsnextUsage: "Validate ESNext usage",
    validateFieldReach: "Validate field reach",
    validateInstallRegistry: "Validate install registry",
    validateInstallScripts: "Validate install scripts",
    validateLockfileIntegrity: "Validate Lockfile integrity",
    validateOntologyResolution: "Validate ontology resolution",
    validatePagDocuments: "Validate PAG documents",
    validatePathReferences: "Validate path references",
    validatePolyglotCoverage: "Validate polyglot coverage",
    validateReadingSignOffs: "Validate reading sign-offs",
    validateRuleDerivation: "Validate rule derivation",
    validateRuleManifests: "Validate rule manifests",
    validateServerConfiguration: "Validate server configuration",
    validateSocialCards: "Validate social cards",
    validateSpelling: "Validate spelling",
    validateSvg: "Validate SVG",
    validateTemplateReferences: "Validate template ontology references",
    validateTransport: "Validate transport",
    validateTypescriptUse: "Validate TypeScript use",
    validateWritingCanon: "Validate writing canon",
    validators: "Validators",
} as const;

export const typecheckLabel = function typecheckLabel(member: string): string {
    return `Typecheck ${member}`;
};

export const removeCommentsLabel = function removeCommentsLabel(member: string): string {
    return `Remove comments ${member}`;
};

export const lintLabel = function lintLabel(member: string): string {
    return `Lint ${member}`;
};

export const htmlhintLabel = function htmlhintLabel(member: string): string {
    return `HTMLHint ${member}`;
};

export const stylelintLabel = function stylelintLabel(member: string): string {
    return `Stylelint ${member}`;
};

export const delegatedLabel = function delegatedLabel(verb: string, member: string): string {
    return `${verb} ${member}`;
};

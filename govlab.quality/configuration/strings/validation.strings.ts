export const constantAlias = function constantAlias(name: string, target: string): string {
    return `Constant '${name}' is a bare alias of '${target}'. Reference '${target}' directly at the call sites instead of aliasing it.`;
};

export const constantAliasFix = function constantAliasFix(name: string, target: string): string {
    return `Remove '${name}' and use '${target}' directly.`;
};

export const constantDuplicate = function constantDuplicate(name: string, count: number): string {
    return `Constant '${name}' is defined with the same value in ${String(count)} files. Centralize it in one constants module and import it, because duplicated constants drift out of sync.`;
};

export const constantDuplicateFix = function constantDuplicateFix(name: string, count: number): string {
    return `Move '${name}' to a single constants module and import it in the ${String(count)} consumers.`;
};

export const duplicateComponent = function duplicateComponent(component: string, count: number): string {
    return `Base component '.${component}' is defined in ${String(count)} component files. Consolidate its base styles into one file, because split definitions drift apart.`;
};

export const duplicateComponentFix = function duplicateComponentFix(component: string): string {
    return `Define '.${component}' in a single component file; the others compose or scope it.`;
};

export const deadVar = function deadVar(name: string): string {
    return `Custom property '${name}' is defined but never referenced via var() anywhere in the project. Remove the dead token or use it.`;
};

export const deadVarFix = function deadVarFix(name: string): string {
    return `Delete '${name}', or reference it with var(${name}).`;
};

export const danglingVar = function danglingVar(name: string): string {
    return `var(${name}) references a custom property that is never defined anywhere in the project. Define the token or fix the reference.`;
};

export const danglingVarFix = function danglingVarFix(name: string): string {
    return `Define '${name}' in the tokens file, or correct the var() name.`;
};

export const strayVar = function strayVar(name: string): string {
    return `Custom property '${name}' is defined outside the token and config files. Define variables in the token files, because scattered tokens fragment the design system.`;
};

export const strayVarFix = function strayVarFix(name: string): string {
    return `Move '${name}' to a token file, or, for a theme override, define its base token there first.`;
};

export const mobileWithoutBase = function mobileWithoutBase(name: string, base: string): string {
    return `Mobile file '${name}' has no base file '${base}'.`;
};

export const mobileWithoutBaseFix = function mobileWithoutBaseFix(base: string): string {
    return `Add the base stylesheet '${base}', or remove the orphaned mobile file.`;
};

export const mobileNotImported = function mobileNotImported(name: string): string {
    return `Mobile file '${name}' is not @imported by any barrel.`;
};

export const mobileNotImportedFix = function mobileNotImportedFix(name: string, base: string): string {
    return `@import '${name}' in the barrel that imports '${base}', right after the base import.`;
};

export const fileNameSpace = function fileNameSpace(name: string): string {
    return `File name '${name}' contains a space.`;
};

export const folderNotKebab = function folderNotKebab(folder: string): string {
    return `Folder '${folder}' is not lowercase-kebab-case.`;
};

export const NAMING_FIX = "Rename to lowercase-kebab-case, with no spaces and no uppercase in folders.";

export const CLEAN_PANEL = "✓ Quality gate: CLEAN — 0 finding(s)";

export const blockedPanel = function blockedPanel(count: number): string {
    return `✖ Quality gate: BLOCKED — ${String(count)} finding(s)`;
};

export const findingHead = function findingHead(location: string, rule: string): string {
    return `  ✖ ${location}  ${rule}`;
};

export const findingMessage = function findingMessage(message: string): string {
    return `    ${message}`;
};

export const findingAction = function findingAction(suggestion: string): string {
    return `    → AIAction: ${suggestion}`;
};

export const MANIFESTS_CLEAN =
    "rule-manifests: clean. Every allowlist entry, exemption and taxonomy declaration resolves on disk.\n";

export const manifestsFailed = function manifestsFailed(count: number): string {
    return `rule-manifests: validation failed with ${String(count)} stale declarations. Each entry below is an exemption, an allowlist row or a taxonomy declaration that no longer resolves on disk. Repoint it or delete it.\n\n`;
};

export const RULE_DERIVATION_CLEAN =
    "rule-derivation: clean. Every rule in the rule host derives its structural facts, with no hardcoded tree path and no hardcoded concern tag.\n";

export const ruleDerivationFailed = function ruleDerivationFailed(count: number): string {
    return `rule-derivation: validation failed with ${String(count)} hardcoded structural facts in the rule host. Derive each fact instead: walk from PROJECT_ROOT, read the closure graph, or import the vocabulary from taxonomy.manifest.ts. A declarative judgment that cannot be derived belongs in a manifest data file, which this check does not read.\n\n`;
};

export const validationFailed = function validationFailed(validator: string): string {
    return `${validator}: validation failed. Each finding below names what to change.\n`;
};

export const duplicateValidator = function duplicateValidator(id: string): string {
    return `Two project validators register the id "${id}". Give each validator its own id.`;
};

export const nonActivityConcern = function nonActivityConcern(form: string, concern: string): string {
    return `${form} is directive but concern "${concern}" has no activity verb`;
};

export const missingConcernVerb = function missingConcernVerb(
    name: string,
    verbSegment: string,
    concern: string,
    verb: string,
): string {
    return `name "${name}" must be "${verbSegment}<subject>" (concern "${concern}" → verb "${verb}")`;
};

export const missingSubject = function missingSubject(name: string): string {
    return `name "${name}" has no subject`;
};

export const SPINE_DETAILS = {
    noFrontmatter: "document has no --- frontmatter header",
    noTitle: "body must open with an H1 title",
} as const;

export const missingFrontmatterField = function missingFrontmatterField(key: string): string {
    return `frontmatter is missing "${key}"`;
};

export const missingSection = function missingSection(concern: string): string {
    return `Missing required section "## ${concern}".`;
};

export const sectionOutOfOrder = function sectionOutOfOrder(concern: string): string {
    return `Section "${concern}" is out of order — expected in the schema's sequence.`;
};

export const missingRequiredField = function missingRequiredField(key: string): string {
    return `frontmatter is missing required "${key}"`;
};

export const invalidInteger = function invalidInteger(field: string, value: string): string {
    return `"${field}: ${value}" is invalid — expected an integer`;
};

export const invalidBoolean = function invalidBoolean(field: string, value: string): string {
    return `"${field}: ${value}" is invalid — expected one of: true, false`;
};

export const invalidKebab = function invalidKebab(field: string, value: string): string {
    return `"${field}: ${value}" is invalid — expected lowercase letters, digits, and hyphens only`;
};

export const invalidList = function invalidList(field: string, value: string, sample: string): string {
    return `"${field}: ${value}" is invalid — expected a bracketed list, e.g. [${sample}]`;
};

export const invalidListEntry = function invalidListEntry(field: string, entry: string, allowed: string): string {
    return `"${field}" lists "${entry}" — expected one of: ${allowed}`;
};

export const invalidEnum = function invalidEnum(field: string, value: string, allowed: string): string {
    return `"${field}: ${value}" is invalid — expected one of: ${allowed}`;
};

export const deadGovernsEdge = function deadGovernsEdge(relPath: string, target: string): string {
    return `✖ ${relPath}:1:1 [dead-edge] governs "${target}" — code path does not exist`;
};

export const deadNameEdge = function deadNameEdge(relPath: string, field: string, target: string): string {
    return `✖ ${relPath}:1:1 [dead-edge] ${field} "${target}" resolves to no doc name`;
};

export const dependsOnCycle = function dependsOnCycle(cycle: string): string {
    return `✖ doc-arch:1:1 [dead-edge] depends-on cycle: ${cycle}`;
};

export const duplicateDocName = function duplicateDocName(name: string): string {
    return `✖ doc-arch:1:1 [dead-edge] duplicate doc name "${name}"`;
};

export const docNameFinding = function docNameFinding(relDoc: string, detail: string, expected: string): string {
    return `✖ ${relDoc}:1:1 [doc-name] ${detail}${expected}`;
};

export const expectedSuffix = function expectedSuffix(expected: string): string {
    return ` → expected "${expected}"`;
};

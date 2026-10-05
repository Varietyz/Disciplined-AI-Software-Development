export const unknownVerb = function unknownVerb(verb: string, known: string): string {
    return `"${verb}:" is not a declared reference verb. Known: ${known}.`;
};

export const unknownClaim = function unknownClaim(claim: string, known: string): string {
    return `frontmatter claims validates: [${claim}] which is not a known claim. Known: ${known}.`;
};

export const unsatisfiedClaim = function unsatisfiedClaim(claim: string): string {
    return `frontmatter claims validates: [${claim}] but no construct in the body satisfies it. Add a construct whose verb satisfies "${claim}", or drop the claim.`;
};

export const unknownVerbResolved = function unknownVerbResolved(verb: string): string {
    return `unknown verb "${verb}:"`;
};

export const missingPath = function missingPath(path: string): string {
    return `path \`${path}\` does not exist`;
};

export const emptyDirectory = function emptyDirectory(path: string): string {
    return `directory \`${path}\` is empty`;
};

export const emptyFile = function emptyFile(path: string): string {
    return `file \`${path}\` is empty`;
};

export const notExported = function notExported(identifier: string, path: string): string {
    return `\`${identifier}\` is not exported from \`${path}\``;
};

export const notDeclared = function notDeclared(identifier: string, path: string): string {
    return `\`${identifier}\` is not declared in \`${path}\``;
};

export const notReferenced = function notReferenced(identifier: string, path: string): string {
    return `\`${identifier}\` is not referenced in \`${path}\``;
};

export const unresolvedOntologyRef = function unresolvedOntologyRef(ref: string): string {
    return `\`${ref}\` resolves to no ontology record`;
};

export const unboundSlot = function unboundSlot(slot: string): string {
    return `\`{${slot}}\` is neither bound nor declared unfilled in the adapter`;
};

export const missingTarget = function missingTarget(target: string): string {
    return `"${target}" does not exist`;
};

export const symbolDrift = function symbolDrift(detail: string): string {
    return `"${detail}" — referenced symbol is not an export of that file`;
};

export const hostCoupling = function hostCoupling(target: string): string {
    return `"${target}" — a portable module's docs must not name a host consumer's files`;
};

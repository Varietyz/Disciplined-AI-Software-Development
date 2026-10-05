export const duplicateConcern = function duplicateConcern(id: string): string {
    return `quality-relations: duplicate concern id "${id}"; the later record wins`;
};

export const EMPTY_CONCERN_ID = "quality-relations: skipped a concern with an empty id";

export const unknownResolvedConcern = function unknownResolvedConcern(id: string): string {
    return `quality-relations: resolve() got unknown concern id "${id}"`;
};

export const concernsShape = function concernsShape(kind: string): string {
    return `quality.concerns: expected an object of concept → value, got ${kind}`;
};

export const unknownSetting = function unknownSetting(id: string): string {
    return `No canonical setting is named "${id}".`;
};

export const channelMismatch = function channelMismatch(id: string, kind: string, channel: string): string {
    return `"${id}" is a ${kind} setting, and it was given in the ${channel} channel.`;
};

export const ownerContention = function ownerContention(surface: string, lang: string, tools: string): string {
    return `The tools ${tools} each claim "${surface}" in ${lang}, and no owner is declared for it.`;
};

export const fixedOwnerValue = function fixedOwnerValue(
    owner: string,
    imposed: string,
    lang: string,
    setting: string,
): string {
    return `${owner} is fixed to ${imposed} for ${lang}, so it cannot apply ${setting}.`;
};

export const FIXED_OWNER_FALLBACK = "the tool";

export const unknownSurface = function unknownSurface(surface: string): string {
    return `No ownership surface is named "${surface}".`;
};

export const fixedSurfaceOwner = function fixedSurfaceOwner(
    surface: string,
    lang: string,
    owner: string,
    tool: string,
): string {
    return `${surface} has the fixed owner ${owner} for ${lang}, so ${tool} cannot own it.`;
};

export const surfaceWithoutRow = function surfaceWithoutRow(tool: string, surface: string, lang: string): string {
    return `"${tool}" has no mapping row for the surface "${surface}" in ${lang}, so it cannot own that surface.`;
};

export const ownersInvalid = function ownersInvalid(detail: string): string {
    return `govlab.config: quality.owners names owners the catalog refuses. Correct each entry below.\n${detail}`;
};

export const configInvalid = function configInvalid(file: string, errors: string): string {
    return `${file} is not a valid govlab config. Correct each field named here: ${errors}.`;
};

export const unknownConcept = function unknownConcept(key: string, count: number): string {
    return `quality.concerns: unknown concept "${key}", which is not one of the ${String(count)} canonical concepts`;
};

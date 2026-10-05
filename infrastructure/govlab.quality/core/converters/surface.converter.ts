import type { OwnerOverride, OwnershipSurface } from "#types/canon.types";

const mergeSurface = function mergeSurface(
    surface: OwnershipSurface,
    langMap: Record<string, string>,
): OwnershipSurface {
    const merged: OwnershipSurface = { ...surface, ownerByLanguage: { ...surface.ownerByLanguage } };
    for (const [lang, tool] of Object.entries(langMap)) {
        if (!surface.fixedOwners.includes(lang)) {
            merged.ownerByLanguage[lang] = tool;
        }
    }
    return merged;
};

export const mergeOwnership = function mergeOwnership(
    surfaces: OwnershipSurface[],
    override?: OwnerOverride,
): OwnershipSurface[] {
    if (!override) {
        return surfaces;
    }
    return surfaces.map((surface) => {
        const langMap = override[surface.id];
        return langMap ? mergeSurface(surface, langMap) : surface;
    });
};

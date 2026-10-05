import type { CanonicalData, OwnerOverride, OwnershipOverrideConflict, OwnershipSurface } from "#types/canon.types";
import {
    FIXED_OWNER_FALLBACK,
    fixedSurfaceOwner,
    surfaceWithoutRow,
    unknownSurface,
} from "#configuration/strings/quality.strings";
import { matchesLang } from "#core/resolvers/surface.resolver";

interface OverrideLangCtx {
    data: CanonicalData;
    lang: string;
    surface: OwnershipSurface | undefined;
    surfaceId: string;
    tool: string;
}

const competes = function competes(ctx: OverrideLangCtx): boolean {
    const settingIds = new Set(
        ctx.data.settings.filter((setting) => setting.surface === ctx.surfaceId).map((setting) => setting.id),
    );
    return ctx.data.rows.some(
        (row) => row.tool === ctx.tool && settingIds.has(row.canonicalId) && matchesLang(row, ctx.lang),
    );
};

const overrideLangConflict = function overrideLangConflict(ctx: OverrideLangCtx): OwnershipOverrideConflict | null {
    if (!ctx.surface) {
        return {
            detail: unknownSurface(ctx.surfaceId),
            kind: "unknown-surface",
            lang: ctx.lang,
            surface: ctx.surfaceId,
        };
    }
    if (ctx.surface.fixedOwners.includes(ctx.lang)) {
        return {
            detail: fixedSurfaceOwner(
                ctx.surfaceId,
                ctx.lang,
                ctx.surface.ownerByLanguage[ctx.lang] ?? FIXED_OWNER_FALLBACK,
                ctx.tool,
            ),
            kind: "fixed-owner",
            lang: ctx.lang,
            surface: ctx.surfaceId,
        };
    }
    return competes(ctx)
        ? null
        : {
              detail: surfaceWithoutRow(ctx.tool, ctx.surfaceId, ctx.lang),
              kind: "tool-not-competitor",
              lang: ctx.lang,
              surface: ctx.surfaceId,
          };
};

export const validateOwnerOverride = function validateOwnerOverride(
    override: OwnerOverride | undefined,
    data: CanonicalData,
): OwnershipOverrideConflict[] {
    if (!override) {
        return [];
    }
    const surfaceById = new Map(data.ownership.map((surface): [string, OwnershipSurface] => [surface.id, surface]));
    return Object.entries(override).flatMap(([surfaceId, langMap]) =>
        Object.entries(langMap).flatMap(([lang, tool]) => {
            const conflict = overrideLangConflict({ data, lang, surface: surfaceById.get(surfaceId), surfaceId, tool });
            return conflict === null ? [] : [conflict];
        }),
    );
};

import { MANIFEST_ERRORS, unknownSurface } from "#configuration/strings/manifest.strings";
import { isNonEmptyStringArray, stringsOf } from "#core/selectors/record.selector";
import type { ManifestPlugin } from "#types/manifest.types";
import { createReason } from "@govlab/context";

const SECTION = "coversSurfaces";
const known: { ids?: ReadonlySet<string> } = {};

const surfaceIds = function surfaceIds(): ReadonlySet<string> {
    known.ids ??= new Set(
        createReason()
            .testSurfaces()
            .map((surface) => surface.id),
    );
    return known.ids;
};

export const coverageGap = function coverageGap(covered: unknown): string[] {
    const declared = new Set(stringsOf(covered));
    return [...surfaceIds()].filter((id) => !declared.has(id)).toSorted((left, right) => left.localeCompare(right));
};

const coversErrors = function coversErrors(covers: unknown): string[] {
    if (covers === undefined) {
        return [];
    }
    if (!isNonEmptyStringArray(covers)) {
        return [MANIFEST_ERRORS.coversShape];
    }
    const ids = surfaceIds();
    return ids.size === 0 ? [] : covers.filter((id) => !ids.has(id)).map(unknownSurface);
};

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        const covers = stringsOf(manifest[SECTION]);
        if (covers.length > 0) {
            entry[SECTION] = covers;
        }
    },
    name: "covers-surfaces",
    section: {
        keys: [SECTION],
        validate(manifest) {
            return coversErrors(manifest[SECTION]);
        },
    },
};

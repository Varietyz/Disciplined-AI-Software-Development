import { MANIFEST_ERRORS, unknownPrinciple, unknownSectionKey } from "#configuration/strings/manifest.strings";
import { isNonEmptyStringArray, recordField, stringsOf } from "#core/selectors/record.selector";
import type { ManifestPlugin } from "#types/manifest.types";
import { createArchRelations } from "@govlab/context";
import { isPlainRecord } from "#core/predicates/record.predicate";

const SECTION = "governance";
const PRINCIPLES_KEY = "principles";
const known: { ids?: ReadonlySet<string> } = {};

const ontologyIds = function ontologyIds(): ReadonlySet<string> {
    known.ids ??= new Set(createArchRelations().ids());
    return known.ids;
};

const principleErrors = function principleErrors(principles: unknown): string[] {
    if (principles === undefined) {
        return [];
    }
    if (!isNonEmptyStringArray(principles)) {
        return [MANIFEST_ERRORS.principlesShape];
    }
    const ids = ontologyIds();
    return ids.size === 0 ? [] : principles.filter((id) => !ids.has(id)).map(unknownPrinciple);
};

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        const principles = stringsOf(recordField(manifest, SECTION)?.[PRINCIPLES_KEY]);
        if (principles.length > 0) {
            entry[SECTION] = { principles };
        }
    },
    name: "arch-relations",
    section: {
        keys: [SECTION],
        validate(manifest) {
            const governance = manifest[SECTION];
            if (governance === undefined) {
                return [];
            }
            if (!isPlainRecord(governance)) {
                return [MANIFEST_ERRORS.governanceShape];
            }
            const unknownKeys = Object.keys(governance)
                .filter((key) => key !== PRINCIPLES_KEY)
                .map((key) => unknownSectionKey(SECTION, key));
            return [...unknownKeys, ...principleErrors(governance[PRINCIPLES_KEY])];
        },
    },
};

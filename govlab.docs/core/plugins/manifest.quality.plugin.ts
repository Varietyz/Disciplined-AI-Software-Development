import { MANIFEST_ERRORS, unknownConcept } from "#configuration/strings/manifest.strings";
import { isNonEmptyStringArray, stringsOf } from "#core/selectors/record.selector";
import { loadConceptIds, loadGovernanceDeriver } from "#core/loaders/quality.loader";
import type { ManifestPlugin } from "#types/manifest.types";
import { absolutePath } from "@ssot/paths";

const SECTION = "governedBy";
const deriveGovernedBy = loadGovernanceDeriver(absolutePath("govlab.quality.generated.rules"));
const known: { ids?: ReadonlySet<string> } = {};

const conceptIds = function conceptIds(): ReadonlySet<string> {
    known.ids ??= loadConceptIds(absolutePath("govlab.quality.generated.concepts"));
    return known.ids;
};

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        const declared = stringsOf(manifest[SECTION]);
        const governedBy = declared.length > 0 ? declared : deriveGovernedBy(entry.value);
        if (governedBy !== null) {
            entry[SECTION] = governedBy;
        }
    },
    name: "quality-governance",
    section: {
        keys: [SECTION],
        validate(manifest) {
            const governedBy = manifest[SECTION];
            if (governedBy === undefined) {
                return [];
            }
            if (!isNonEmptyStringArray(governedBy)) {
                return [MANIFEST_ERRORS.governedByShape];
            }
            const ids = conceptIds();
            return ids.size === 0 ? [] : governedBy.filter((id) => !ids.has(id)).map(unknownConcept);
        },
    },
};

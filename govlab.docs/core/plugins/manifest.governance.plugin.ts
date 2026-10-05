import { selfGovernedField, selfGovernedShape } from "#configuration/strings/manifest.strings";
import type { ManifestPlugin } from "#types/manifest.types";
import { SELF_GOVERNED_KEY } from "#configuration/constants/manifest.constants";
import { isNonEmptyString } from "#core/predicates/readme.predicate";
import { isPlainRecord } from "#core/predicates/record.predicate";

const REQUIRED_FIELDS: readonly string[] = ["checker", "paths"];
const OPTIONAL_FIELDS: readonly string[] = ["tests", "writes"];

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        if (isPlainRecord(manifest[SELF_GOVERNED_KEY])) {
            entry[SELF_GOVERNED_KEY] = true;
        }
    },
    name: "self-governance",
    section: {
        keys: [SELF_GOVERNED_KEY],
        validate(manifest) {
            const declared = manifest[SELF_GOVERNED_KEY];
            if (declared === undefined) {
                return [];
            }
            if (!isPlainRecord(declared)) {
                return [selfGovernedShape(SELF_GOVERNED_KEY)];
            }
            const optional = OPTIONAL_FIELDS.filter((field) => Object.hasOwn(declared, field));
            return [...REQUIRED_FIELDS, ...optional]
                .filter((field) => !isNonEmptyString(declared[field]))
                .map((field) => selfGovernedField(SELF_GOVERNED_KEY, field));
        },
    },
};

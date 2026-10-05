import {
    DOCS_FIELD_ERRORS,
    MANIFEST_ERRORS,
    customDocsField,
    missingDocsField,
} from "#configuration/strings/manifest.strings";
import { isNonEmptyString, isRenderable, isStringArray } from "#core/predicates/readme.predicate";
import type { Manifest } from "#types/readme.types";
import type { ManifestPlugin } from "#types/manifest.types";
import { isPlainRecord } from "#core/predicates/record.predicate";

type FieldCheck = (value: unknown) => boolean;

const SECTION = "docs";

const isApiNotes = function isApiNotes(value: unknown): boolean {
    return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((note) => isPlainRecord(note) && isNonEmptyString(note["name"]) && isNonEmptyString(note["note"]))
    );
};

const isInstall = function isInstall(value: unknown): boolean {
    return typeof value === "string" || isRenderable(value);
};

const CORE: ReadonlyMap<keyof typeof DOCS_FIELD_ERRORS, FieldCheck> = new Map<
    keyof typeof DOCS_FIELD_ERRORS,
    FieldCheck
>([
    ["aiContext", isRenderable],
    ["configuration", isRenderable],
    ["disposal", isStringArray],
    ["overview", isNonEmptyString],
    ["quickStart", isRenderable],
    ["whenNotToUse", isStringArray],
    ["whenToUse", isStringArray],
]);

const OPTIONAL: ReadonlyMap<keyof typeof DOCS_FIELD_ERRORS, FieldCheck> = new Map<
    keyof typeof DOCS_FIELD_ERRORS,
    FieldCheck
>([
    ["api", isRenderable],
    ["apiNotes", isApiNotes],
    ["install", isInstall],
]);

const isKnownField = function isKnownField(
    fields: ReadonlyMap<keyof typeof DOCS_FIELD_ERRORS, FieldCheck>,
    key: string,
): key is keyof typeof DOCS_FIELD_ERRORS {
    return [...fields.keys()].some((field) => field === key);
};

const coreErrors = function coreErrors(docs: Manifest): string[] {
    return [...CORE].flatMap(([key, check]) => {
        if (docs[key] === undefined) {
            return [missingDocsField(key)];
        }
        return check(docs[key]) ? [] : [DOCS_FIELD_ERRORS[key]];
    });
};

const extraError = function extraError(docs: Manifest, key: string): string[] {
    if (isKnownField(OPTIONAL, key)) {
        return (OPTIONAL.get(key) ?? isRenderable)(docs[key]) ? [] : [DOCS_FIELD_ERRORS[key]];
    }
    return isRenderable(docs[key]) ? [] : [customDocsField(key)];
};

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        if (isPlainRecord(manifest[SECTION])) {
            entry["documented"] = true;
        }
    },
    name: "docs",
    section: {
        keys: [SECTION],
        validate(manifest) {
            const docs = manifest[SECTION];
            if (docs === undefined) {
                return [];
            }
            if (!isPlainRecord(docs)) {
                return [MANIFEST_ERRORS.docsShape];
            }
            const extras = Object.keys(docs).filter((key) => !isKnownField(CORE, key));
            return [...coreErrors(docs), ...extras.flatMap((key) => extraError(docs, key))];
        },
    },
};

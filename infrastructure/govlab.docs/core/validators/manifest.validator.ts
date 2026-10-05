import {
    COMPUTED_KEYS,
    CORE_KEYS,
    MATURITY,
    RELATIONSHIP_KEYS,
    VISIBILITY_FLAGS,
} from "#configuration/constants/manifest.constants";
import {
    MANIFEST_ERRORS,
    computedField,
    nonEmptyField,
    relationshipShape,
    unknownKey,
    unknownVisibilityKey,
    visibilityFlag,
} from "#configuration/strings/manifest.strings";
import type { Manifest } from "#types/readme.types";
import type { ManifestPlugin } from "#types/manifest.types";
import { isNonEmptyString } from "#core/predicates/readme.predicate";
import { isPlainRecord } from "#core/predicates/record.predicate";

const REQUIRED_TEXT_FIELDS: readonly string[] = ["label", "summary"];
const OPTIONAL_FLAG_TYPES: ReadonlySet<string> = new Set(["boolean", "undefined"]);

const isRelationshipArray = function isRelationshipArray(value: unknown): boolean {
    return (
        Array.isArray(value) &&
        value.every(
            (entry) => isPlainRecord(entry) && isNonEmptyString(entry["package"]) && isNonEmptyString(entry["reason"]),
        )
    );
};

const allowedKeys = function allowedKeys(plugins: readonly ManifestPlugin[]): Set<string> {
    return new Set([...CORE_KEYS, ...plugins.flatMap((plugin) => plugin.section?.keys ?? [])]);
};

const visibilityErrors = function visibilityErrors(manifest: Manifest): string[] {
    const { visibility } = manifest;
    if (visibility === undefined) {
        return [MANIFEST_ERRORS.visibilityRequired];
    }
    if (!isPlainRecord(visibility)) {
        return [MANIFEST_ERRORS.visibilityShape];
    }
    const flagErrors = VISIBILITY_FLAGS.filter((flag) => !OPTIONAL_FLAG_TYPES.has(typeof visibility[flag])).map(
        visibilityFlag,
    );
    const keyErrors = Object.keys(visibility)
        .filter((key) => !VISIBILITY_FLAGS.includes(key))
        .map(unknownVisibilityKey);
    return [...flagErrors, ...keyErrors];
};

const capabilitiesErrors = function capabilitiesErrors(manifest: Manifest): string[] {
    const { capabilities } = manifest;
    if (capabilities === undefined) {
        return [];
    }
    return Array.isArray(capabilities) && capabilities.every(isNonEmptyString) ? [] : [MANIFEST_ERRORS.capabilities];
};

const maturityErrors = function maturityErrors(manifest: Manifest): string[] {
    const { maturity } = manifest;
    return typeof maturity === "string" && MATURITY.has(maturity) ? [] : [MANIFEST_ERRORS.maturity];
};

const ecosystemErrors = function ecosystemErrors(manifest: Manifest): string[] {
    const { ecosystem } = manifest;
    return ecosystem !== undefined && !isNonEmptyString(ecosystem) ? [MANIFEST_ERRORS.ecosystem] : [];
};

const relationshipErrors = function relationshipErrors(manifest: Manifest): string[] {
    return RELATIONSHIP_KEYS.filter(
        (field) => manifest[field] !== undefined && !isRelationshipArray(manifest[field]),
    ).map(relationshipShape);
};

const coreFieldErrors = function coreFieldErrors(manifest: Manifest): string[] {
    return [
        ...REQUIRED_TEXT_FIELDS.filter((field) => !isNonEmptyString(manifest[field])).map(nonEmptyField),
        ...maturityErrors(manifest),
        ...capabilitiesErrors(manifest),
        ...ecosystemErrors(manifest),
        ...relationshipErrors(manifest),
    ];
};

const keyErrors = function keyErrors(manifest: Manifest, plugins: readonly ManifestPlugin[]): string[] {
    const allowed = allowedKeys(plugins);
    return Object.keys(manifest).flatMap((key) => {
        if (COMPUTED_KEYS.has(key)) {
            return [computedField(key)];
        }
        return allowed.has(key) ? [] : [unknownKey(key)];
    });
};

export const validateManifest = function validateManifest(
    manifest: unknown,
    plugins: readonly ManifestPlugin[] = [],
): string[] {
    if (!isPlainRecord(manifest)) {
        return [MANIFEST_ERRORS.missingManifest];
    }
    return [
        ...coreFieldErrors(manifest),
        ...visibilityErrors(manifest),
        ...keyErrors(manifest, plugins),
        ...plugins.flatMap((plugin) => plugin.section?.validate?.(manifest) ?? []),
    ];
};

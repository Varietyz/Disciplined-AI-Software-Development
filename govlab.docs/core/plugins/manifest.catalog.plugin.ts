import type { CatalogEntry, ManifestPlugin, PluginContext, Relationship } from "#types/manifest.types";
import { DEFAULT_MATURITY, PACKAGE_SCOPE } from "#configuration/constants/manifest.constants";
import { arrayField, stringField } from "#core/selectors/record.selector";
import type { Manifest } from "#types/readme.types";
import { isPlainRecord } from "#core/predicates/record.predicate";

const shortName = function shortName(scoped: string): string {
    return scoped.startsWith(PACKAGE_SCOPE) ? scoped.slice(PACKAGE_SCOPE.length) : scoped;
};

const mapRelationship = function mapRelationship(list: unknown): Relationship[] {
    return (Array.isArray(list) ? list : []).flatMap((entry): Relationship[] => {
        if (!isPlainRecord(entry) || typeof entry["package"] !== "string" || typeof entry["reason"] !== "string") {
            return [];
        }
        return [{ package: shortName(entry["package"]), reason: entry["reason"] }];
    });
};

const assignCatalogFields = function assignCatalogFields(
    manifest: Manifest,
    entry: CatalogEntry,
    context: PluginContext,
): void {
    entry["label"] = stringField(manifest, "label") ?? context.module.slug;
    entry["summary"] = stringField(manifest, "summary") ?? "";
    entry["maturity"] = stringField(manifest, "maturity") ?? DEFAULT_MATURITY;
    entry["capabilities"] = arrayField(manifest, "capabilities");
    entry["requires"] = context.requires(context.module.slug);
    entry["overlaps"] = mapRelationship(manifest["overlaps"]);
    entry["incompatibleWith"] = mapRelationship(manifest["incompatibleWith"]);
    entry["supersedes"] = mapRelationship(manifest["supersedes"]);
    entry["ecosystem"] = stringField(manifest, "ecosystem") ?? context.module.ecosystemHint;
};

export const plugin: ManifestPlugin = {
    contribute(manifest, entry, context) {
        if (context) {
            assignCatalogFields(manifest, entry, context);
        }
    },
    name: "catalog",
};

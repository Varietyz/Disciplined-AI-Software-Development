import { PACKAGE_TEXT, entryUndeclared, entryUnresolved } from "#configuration/strings/package.strings";
import { declaredEntries, unresolvedEntryPatterns } from "#core/loaders/manifest.loader";
import { MANIFEST_FILE } from "#configuration/constants/document.constants";
import type { ManifestModule } from "#types/manifest.types";
import { resolveSourceBarrels } from "#core/resolvers/barrel.resolver";

export const analyzabilityMessages = function analyzabilityMessages(
    module: ManifestModule,
    isAggregate: boolean,
): string[] {
    const at = [module.label, MANIFEST_FILE].join("/");
    const unresolved = unresolvedEntryPatterns(module.dir).map((pattern) => entryUnresolved(at, pattern));
    if (isAggregate || module.manifest.docs === undefined) {
        return unresolved;
    }
    if (declaredEntries(module.dir) === null && resolveSourceBarrels(module.dir, module.pkg).length === 0) {
        return [...unresolved, entryUndeclared(at, PACKAGE_TEXT.undeclaredEntry)];
    }
    return unresolved;
};

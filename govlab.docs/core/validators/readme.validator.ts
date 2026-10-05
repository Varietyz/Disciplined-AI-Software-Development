import type { GovernanceEngine, ReadmeContext } from "#types/document.output.types";
import {
    conceptFinding,
    declaredDocFinding,
    docsFieldFinding,
    docsIncomplete,
    principleFinding,
} from "#configuration/strings/package.strings";
import type { DiscoveredModule } from "#types/readme.types";
import { MANIFEST_FILE } from "#configuration/constants/document.constants";
import type { ManifestModule } from "#types/manifest.types";

const manifestAt = function manifestAt(module: ManifestModule): string {
    return [module.label, MANIFEST_FILE].join("/");
};

const asDiscovered = function asDiscovered(module: ManifestModule): DiscoveredModule {
    return { axis: module.group, dir: module.dir, manifest: module.manifest, slug: module.slug };
};

const ontologyMessages = function ontologyMessages(engine: GovernanceEngine, module: ManifestModule): string[] {
    const at = manifestAt(module);
    return [
        ...engine
            .governPrinciples(module.manifest)
            .map((finding) => principleFinding(at, finding.axis, finding.detail)),
        ...engine.governConcepts(module.manifest).map((finding) => conceptFinding(at, finding.axis, finding.detail)),
        ...engine
            .governDeclaredDocs(asDiscovered(module))
            .map((finding) => declaredDocFinding(at, finding.doc, finding.heading, finding.axis, finding.detail)),
    ];
};

const docsMessages = function docsMessages(
    engine: GovernanceEngine,
    module: ManifestModule,
    context: ReadmeContext,
): string[] {
    if (module.manifest.docs !== undefined) {
        const at = manifestAt(module);
        return engine
            .governManifest(asDiscovered(module))
            .map((finding) => docsFieldFinding(at, finding.field, finding.axis, finding.detail));
    }
    return context.onDiskReadme.startsWith(context.generatedPrefix) ? [docsIncomplete(module.label)] : [];
};

export const governanceMessages = function governanceMessages(
    engine: GovernanceEngine,
    module: ManifestModule,
    context: ReadmeContext,
): string[] {
    return [...ontologyMessages(engine, module), ...docsMessages(engine, module, context)];
};

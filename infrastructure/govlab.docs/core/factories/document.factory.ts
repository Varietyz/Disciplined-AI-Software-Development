import type {
    ArchPort,
    ConceptRecord,
    ContextDeps,
    Manifest,
    ModuleDocs,
    ModuleDocsOptions,
    PrincipleRecord,
    RenderContext,
    RepoMetrics,
} from "#types/readme.types";
import type { DocRegistries, LocationOptions } from "#types/location.types";
import { basename, resolve } from "node:path";
import { governConcepts, governPrinciples, ontologyDuplicateFindings } from "#core/validators/governance.validator";
import { governDeclaredDocs, governManifest } from "#core/validators/manifest.prose.validator";
import { readManifest, readPackageJson } from "#core/loaders/manifest.loader";
import { DEFAULT_ROOT_PREFIX } from "#configuration/constants/document.constants";
import { DOC_FORMS } from "#configuration/constants/form.constants";
import { PACKAGE_SCOPE } from "#configuration/constants/manifest.constants";
import { VCS_DIRECTORY } from "#configuration/constants/vcs.constants";
import { declaredDocLocation } from "#core/resolvers/location.resolver";
import { existsSync } from "node:fs";
import { generateModuleDoc } from "#core/formatters/readme.formatter";
import { readPublicSurface } from "#core/analyzers/surface.analyzer";
import { renderDeclaredDoc } from "#core/formatters/document.formatter";

const REPO_METRICS_KEY = "repoMetrics";

const resolvePrinciples = function resolvePrinciples(manifest: Manifest, archRelations: ArchPort): PrincipleRecord[] {
    const ids = manifest.governance?.principles;
    return Array.isArray(ids) && ids.length > 0 ? archRelations.resolve(ids).principles : [];
};

const resolveConcepts = function resolveConcepts(manifest: Manifest, slug: string, deps: ContextDeps): ConceptRecord[] {
    const declared = Array.isArray(manifest.governedBy) && manifest.governedBy.length > 0 ? manifest.governedBy : null;
    const ids = declared ?? deps.deriveGovernedBy(slug) ?? [];
    return ids.flatMap((id) => {
        const concept = deps.conceptMap.get(id);
        return concept === undefined ? [] : [{ dimension: concept.dimension, id: concept.id }];
    });
};

const repoMetricsFor = function repoMetricsFor(
    manifest: Manifest,
    moduleDir: string,
    deps: ContextDeps,
): RepoMetrics | null {
    const derive = deps.deriveRepoMetrics;
    if (derive === undefined || manifest[REPO_METRICS_KEY] !== true || !existsSync(resolve(moduleDir, VCS_DIRECTORY))) {
        return null;
    }
    return derive(moduleDir);
};

const buildContext = function buildContext(moduleDir: string, hasCharts: boolean, deps: ContextDeps): RenderContext {
    const manifest = readManifest(moduleDir);
    const pkg = readPackageJson(moduleDir);
    const name = basename(moduleDir);
    return {
        concepts: resolveConcepts(manifest, name, deps),
        docs: manifest.docs ?? {},
        domains: Array.isArray(manifest.domains) ? manifest.domains : [],
        hasCharts,
        maturity: typeof manifest["maturity"] === "string" ? manifest["maturity"] : "",
        moduleDir,
        name,
        pkg,
        principles: resolvePrinciples(manifest, deps.archRelations),
        repo: repoMetricsFor(manifest, moduleDir, deps),
        scoped: pkg.name ?? manifest.label ?? `${PACKAGE_SCOPE}${name}`,
        summary: manifest.summary ?? "",
        surface: readPublicSurface(moduleDir, pkg).surface,
    };
};

export const createModuleDocs = function createModuleDocs(options: ModuleDocsOptions): ModuleDocs {
    const { archRelations, conceptMap, consumerRoot, hostTokens } = options;
    const registries: DocRegistries = {
        concerns: options.docConcerns,
        forms: options.docForms ?? DOC_FORMS,
        owners: options.docMembers,
    };
    const locationOptions: LocationOptions = { rootPrefix: DEFAULT_ROOT_PREFIX };
    const declaredContext = { consumerRoot, hostTokens, options: locationOptions, registries };
    const contextDeps: ContextDeps = {
        archRelations,
        conceptMap,
        deriveGovernedBy: options.deriveGovernedBy,
        deriveRepoMetrics: options.deriveRepoMetrics,
    };
    return {
        declaredDocLocation: (doc) => declaredDocLocation(doc, registries, locationOptions),
        generateReadme: (moduleDir, hasCharts = false) =>
            generateModuleDoc(buildContext(moduleDir, hasCharts, contextDeps)),
        governConcepts: (manifest) => governConcepts(manifest, conceptMap),
        governDeclaredDocs: (module) => governDeclaredDocs(module, declaredContext),
        governManifest: (module) => governManifest(module, consumerRoot, hostTokens),
        governPrinciples: (manifest) => governPrinciples(manifest, archRelations),
        ontologyDuplicates: () => ontologyDuplicateFindings(archRelations),
        renderDeclaredDoc,
    };
};

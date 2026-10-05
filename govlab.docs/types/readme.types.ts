import type { DocForm, DocRegistries, LocationOptions } from "#types/location.types";
import type { DocumentDecl } from "#types/document.types";

export type FlatRecord = Record<string, string>;
export type Renderable = FlatRecord[] | string[] | string;

export interface PublicMember {
    name: string;
    kind: string;
    signature: string;
    axis: string;
}

export interface SurfaceResult {
    surface: PublicMember[];
}

export interface ResolvedMember {
    kind: string;
    signature: string;
}

export interface PrincipleRecord {
    name: string;
    category: string;
    severity: string;
    reinforces?: string[];
    enables?: string[];
    tensions_with?: string[];
    conflicts_with?: string[];
}

export interface ConceptRecord {
    id: string;
    dimension: string;
}

export interface ApiNote {
    name: string;
    note: string;
}

export interface RepoMetrics {
    branch?: string;
    commits?: number;
    contributors?: number;
    created?: string;
    lastCommit?: string;
    latestTag?: string;
    files?: number;
    languages?: FlatRecord;
}

export interface DocsBlock {
    [field: string]: unknown;
    overview?: Renderable;
    whenToUse?: Renderable;
    whenNotToUse?: Renderable;
    quickStart?: Renderable;
    configuration?: Renderable;
    disposal?: Renderable;
    aiContext?: Renderable;
    apiNotes?: ApiNote[];
    api?: Renderable;
    install?: Renderable;
}

export interface Governance {
    principles?: string[];
}

export interface Domain {
    meta: string;
    sub: string;
}

export interface Manifest {
    [key: string]: unknown;
    label?: string;
    summary?: string;
    docs?: DocsBlock;
    documents?: DocumentDecl[];
    governance?: Governance;
    governedBy?: string[];
    domains?: Domain[];
}

export interface PackageJson {
    name?: string;
    exports?: unknown;
    types?: string;
    main?: string;
    dependencies?: Record<string, string>;
}

export interface RenderContext {
    name: string;
    scoped: string;
    summary: string;
    maturity: string;
    docs: DocsBlock;
    surface: PublicMember[];
    principles: PrincipleRecord[];
    concepts: ConceptRecord[];
    domains: Domain[];
    pkg: PackageJson;
    moduleDir: string;
    repo: RepoMetrics | null;
    hasCharts: boolean;
}

export interface ReadmeLayer {
    id: string;
    render: (context: RenderContext) => string | null;
}

export interface ManifestFinding {
    field: string;
    axis: string;
    detail: string;
}

export interface DeclaredDocFinding {
    doc: string;
    heading: string;
    axis: string;
    detail: string;
}

export interface ProseFinding {
    axis: string;
    detail: string;
}

export interface DeclaredGovernContext {
    consumerRoot: string;
    registries: DocRegistries;
    options: LocationOptions;
    hostTokens: readonly string[];
}

export interface OntologyFinding {
    axis: string;
    detail: string;
}

export interface DiscoveredModule {
    manifest: Manifest;
    dir: string;
    axis: string;
    slug: string;
}

export interface ArchEdges {
    conflictsWith: (string | { id: string })[];
}

export interface ArchResolveResult {
    principles: PrincipleRecord[];
    edges: ArchEdges;
}

export interface ArchPort {
    get: (id: string) => unknown;
    resolve: (ids: readonly string[]) => ArchResolveResult;
    validateOntology: () => { duplicateIds: string[] };
}

export interface ContextDeps {
    archRelations: ArchPort;
    conceptMap: ReadonlyMap<string, ConceptRecord>;
    deriveGovernedBy: (slug: string) => string[] | null;
    deriveRepoMetrics?: ((dir: string) => RepoMetrics | null) | undefined;
}

export interface ModuleDocsOptions {
    docConcerns: readonly string[];
    docForms?: Readonly<Record<string, DocForm>>;
    docMembers?: readonly string[];
    consumerRoot: string;
    hostTokens: readonly string[];
    archRelations: ArchPort;
    conceptMap: ReadonlyMap<string, ConceptRecord>;
    deriveGovernedBy: (slug: string) => string[] | null;
    deriveRepoMetrics?: (dir: string) => RepoMetrics | null;
}

export interface ModuleDocs {
    generateReadme: (moduleDir: string, hasCharts?: boolean) => string;
    renderDeclaredDoc: (doc: DocumentDecl) => string;
    declaredDocLocation: (doc: DocumentDecl) => string;
    governManifest: (module: DiscoveredModule) => ManifestFinding[];
    governDeclaredDocs: (module: DiscoveredModule) => DeclaredDocFinding[];
    governPrinciples: (manifest: Manifest) => OntologyFinding[];
    governConcepts: (manifest: Manifest) => OntologyFinding[];
    ontologyDuplicates: () => string[];
}

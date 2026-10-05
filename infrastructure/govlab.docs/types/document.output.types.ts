import type { Manifest, ModuleDocs } from "#types/readme.types";
import type { Charts } from "#types/figure.types";
import type { DocumentDecl } from "#types/document.types";
import type { ManifestModule } from "#types/manifest.types";

export interface Spec {
    driftCode: string;
    gate?: (content: string) => Promise<{ findings: { line: number; message: string }[] }>;
    gateCode?: string;
    harden?: boolean;
    label: string;
    mkdir?: boolean;
    normalize: (text: string) => string;
    path: string;
    produce: (onDisk: string) => Promise<string> | string;
}

export interface SharedOutputs {
    charts: Charts | null;
    hasCharts: boolean;
    isAggregate: boolean;
}

export interface OutputTarget {
    path: string;
    rel: string;
}

export interface WorkspaceMap extends OutputTarget {
    content: string;
}

export interface IndexTargets {
    json: OutputTarget;
    markdown: OutputTarget;
}

export interface DocModule {
    dir: string;
    label: string;
    manifest: Manifest;
    relPath: string;
}

export interface ModuleOutput {
    shared: SharedOutputs;
    specs: Spec[];
}

export interface ModuleSelection {
    only: ReadonlySet<string> | null;
    workspaceMapOnly: boolean;
}

export interface CheckOptions extends ModuleSelection {
    fix: boolean;
}

export interface DocChecksDeps {
    workspaceMapTarget: () => Promise<WorkspaceMap | null>;
    discoverAll: () => ManifestModule[];
    engine: ModuleDocs;
    generatedPrefix: string;
    moduleOutputs: (module: DocModule) => Promise<ModuleOutput>;
    writeSpec: (spec: Spec, content: string) => void;
}

export type SpecEngine = Pick<ModuleDocs, "declaredDocLocation" | "generateReadme" | "renderDeclaredDoc">;

export interface SpecOutputsDeps {
    discoverAll: () => ManifestModule[];
    engine: SpecEngine;
    formatMarkdown: (markdown: string) => Promise<string>;
    root: string;
}

export interface WorkspaceMapDeps {
    declaredDocLocation: (doc: DocumentDecl) => string;
    discoverAll: () => ManifestModule[];
    formatMarkdown: (markdown: string) => Promise<string>;
    renderDeclaredDoc: (doc: DocumentDecl) => string;
    root: string;
}

export type HealOutcome = "drift" | "healed" | "rewritten";

export interface HealState {
    prior: string;
    remaining: number;
}

export interface HealResult {
    content: string;
    outcome: HealOutcome;
}

export type GovernanceEngine = Pick<
    ModuleDocs,
    "governConcepts" | "governDeclaredDocs" | "governManifest" | "governPrinciples"
>;

export interface ReadmeContext {
    generatedPrefix: string;
    onDiskReadme: string;
}

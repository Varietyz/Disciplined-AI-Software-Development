import type { DocForm } from "#types/location.types";
import type { Renderable } from "#types/readme.types";

export interface DocNode {
    name: string;
    relPath: string;
    type: string;
    concern: string;
    summary: string;
    dependsOn: string[];
    links: string[];
    supersedes: string[];
    governs: string[];
    status?: string;
}

export interface DeadEdge {
    from: string;
    relPath: string;
    field: "depends-on" | "links" | "supersedes";
    target: string;
}

export interface DocGraph {
    nodes: DocNode[];
    byName: Record<string, DocNode>;
    duplicateNames: string[];
    deadEdges: DeadEdge[];
    cycles: string[][];
    superseded: string[];
}

export type NodeEdgeKey = "dependsOn" | "links" | "supersedes";

export interface NodeEdgeField {
    key: NodeEdgeKey;
    field: DeadEdge["field"];
}

export interface NodeEdges {
    dead: DeadEdge[];
    superseded: string[];
}

export interface MetaConcern {
    concern: string;
    aliases?: string[];
    required: boolean;
    order: number;
}

export interface DocTypeSchema {
    type: string;
    metaConcerns: MetaConcern[];
    ordered?: boolean;
}

export interface SchemaDefect {
    code: "off-schema";
    concern: string;
    remediation: string;
}

export type SpineDefectCode = "missing-field" | "no-frontmatter" | "no-title";

export interface SpineDefect {
    code: SpineDefectCode;
    detail: string;
    line: number;
}

export interface SpineOptions {
    requireFrontmatter?: boolean;
    requireTitle?: boolean;
}

export interface StemParts {
    member?: string;
    name: string;
}

export interface SpineProfile {
    keys: string[];
    requireFrontmatter: boolean;
    requireTitle: boolean;
}

export interface HarnessProfile extends SpineProfile {
    prefix: string;
}

export interface SpineContext {
    harnessRoot: string | null;
    harnessProfiles: readonly HarnessProfile[];
}

export type DocNameCode = "missing-concern-verb" | "missing-subject" | "non-activity-concern";

export interface DocNameDefect {
    code: DocNameCode;
    detail: string;
    expected?: string;
}

export interface DocNameInput {
    form: DocForm;
    concern: string;
    name: string;
    activityVerbs: Readonly<Record<string, string>>;
}

export interface DirectiveSubject {
    defects: DocNameDefect[];
    subject: string;
}

export interface DocumentSection {
    heading: string;
    content: Renderable;
}

export interface DocumentDecl {
    type: string;
    concern?: string;
    member?: string;
    generated?: boolean;
    name: string;
    summary: string;
    status?: string;
    title?: string;
    lead?: Renderable;
    body: DocumentSection[];
}

export interface DocMeta {
    delegated: boolean;
    doc: string;
    docFilename: string;
    fields: Record<string, string>;
    fmConcern: string;
    fmType: string | undefined;
    harnessOwned: boolean;
    hostBoundary: boolean;
    relDoc: string;
    source: string;
}

export interface TemplateSpec {
    concern: string;
    def: DocForm;
    form: string;
    name: string;
    summary: string;
    status: string;
}

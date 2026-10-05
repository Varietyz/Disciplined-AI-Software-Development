export interface CodeSymbol {
    role: string;
    name: string;
    line: number;
    enclosing: string;
    kind: string;
    file: string;
    member: boolean;
    exported: boolean;
    callable: boolean;
    hash: string;
    size: number;
}

export interface ImportBinding {
    importedNames: string[];
    source: string;
}

export interface IngestFile {
    records: Record<string, unknown>[];
    symbols: CodeSymbol[];
    imports: ImportBinding[];
}

export interface ModuleUnit {
    moduleDir: string;
    imports: readonly ImportBinding[];
}

export interface SymbolStat {
    name: string;
    role: string;
    inDegree: number;
    outDegree: number;
    flow: string;
    line: number;
    kind: string;
    file: string;
    exported: boolean;
    callable: boolean;
    local: boolean;
}

export interface TypeStat {
    type: string;
    count: number;
}

export interface CodeInsight {
    symbols: SymbolStat[];
    invariants: TypeStat[];
    variants: TypeStat[];
    definitions: number;
    edges: number;
}

export interface Distribution {
    invariants: TypeStat[];
    variants: TypeStat[];
}

export interface CallEdge {
    from: string;
    to: string;
    file: string;
    line: number;
}

export interface ExternalCall {
    caller: string;
    name: string;
    file: string;
    line: number;
}

export interface CodeGraph {
    edges: CallEdge[];
    external: ExternalCall[];
}

export interface CodeFinding {
    kind: string;
    severity: string;
    confidence: string;
    relevance: number;
    name: string;
    file: string;
    line: number;
    detail: string;
    remedy: string;
    members: string[];
}

export interface DiagnoseInput {
    graph: CodeGraph;
    records: readonly Record<string, unknown>[];
    testUses: ReadonlySet<string>;
}

export interface ModuleEdge {
    from: string;
    to: string;
}

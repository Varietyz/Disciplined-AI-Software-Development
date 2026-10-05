export type RefCheck =
    "ident-declared-in-path" | "ident-exported-from-path" | "ident-referenced-in-path" | "path-exists";

export interface DocVerb {
    checks: readonly RefCheck[];
    satisfies: readonly string[];
}

export type RefConstructCode = "unknown-claim" | "unknown-verb" | "unsatisfied-claim";

export interface RefConstruct {
    verb: string;
    identifier: string;
    path: string;
    line: number;
    col: number;
}

export interface RefConstructDefect {
    code: RefConstructCode;
    detail: string;
    line: number;
    col: number;
}

export interface RefScan {
    constructs: RefConstruct[];
    defects: RefConstructDefect[];
}

export interface RefScanOptions {
    verbs: Readonly<Record<string, DocVerb>>;
    claims: readonly string[];
}

export interface RefMatch {
    identifier: string;
    path: string;
    end: number;
}

export interface RefFinding {
    line: number;
    col: number;
    detail: string;
}

export interface RefResolveCtx {
    roots: readonly string[];
    verbs: Readonly<Record<string, DocVerb>>;
}

export interface PathRef {
    path: string;
    line: number;
    col: number;
}

export interface SpanDelims {
    open: string;
    close: string;
}

export interface OntologyRef {
    ref: string;
    line: number;
    col: number;
}

export interface SlotRef {
    slot: string;
    line: number;
    col: number;
}

export interface BracedSpan {
    inner: string;
    col: number;
}

export interface PathsCtx {
    codeExtensions: ReadonlySet<string>;
    fileIndex: ReadonlyMap<string, string[]>;
    root: string;
    runtimeRoots: readonly string[];
    topLevel: ReadonlySet<string>;
}

export interface BrokenRef {
    col: number;
    line: number;
    path: string;
}

export interface SymbolRef {
    file: string;
    symbol: string;
}

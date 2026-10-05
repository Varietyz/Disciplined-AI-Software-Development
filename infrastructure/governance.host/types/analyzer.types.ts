import type { Edit } from "./codemod.types.ts";
import type ts from "typescript";

export interface CodePointFinding {
    file: string;
    fileName: string;
    line: number;
    start: number;
    end: number;
    receiver: string;
    args: string;
    reason: string | null;
}

export interface IncrementFinding {
    file: string;
    fileName: string;
    line: number;
    start: number;
    end: number;
    operand: string;
    operator: string;
    reason: string | null;
}

export interface WriteFinding {
    file: string;
    fileName: string;
    line: number;
    start: number;
    end: number;
    replacement: string;
    importEdits: readonly Edit[];
    reason: string | null;
}

export interface WriteScope {
    readonly owners: ReadonlySet<string>;
    readonly declaresWriter: (fileName: string) => boolean;
}

export interface RenameLocation {
    fileName: string;
    start: number;
    end: number;
}

export interface IdentifierFinding {
    file: string;
    fileName: string;
    line: number;
    reason: string | null;
    from: string;
    to: string;
    locations: RenameLocation[];
}

export interface BindingFinding {
    file: string;
    fileName: string;
    line: number;
    start: number;
    end: number;
    iface: string;
    member: string;
    ifaceFile: string;
    ifaceLine: number;
    method: ts.MethodDeclaration;
    reason: string | null;
}

export interface BindingContext {
    checker: ts.TypeChecker;
    classNode: ts.ClassDeclaration;
    sourceFile: ts.SourceFile;
    overrides: ReadonlyMap<ts.Symbol, ReadonlySet<string>>;
}

export interface SpecifierFinding {
    file: string;
    from: string;
    line: number;
    reason: string | null;
    start: number;
    end: number;
    to: string;
}

export interface WorkspaceMember {
    exports: Record<string, unknown> | null;
    name: string;
    rel: string;
}

export interface LocationFinding {
    end: number;
    file: string;
    from: string;
    line: number;
    localName: string;
    needsImport: boolean;
    reason: string | null;
    start: number;
    to: string;
}

export interface LiteralSite {
    chain: ts.Node[];
    node: ts.StringLiteral;
}

export interface LiteralPair {
    from: string;
    to: string;
}

export interface LiteralFinding {
    end: number;
    file: string;
    fileName: string;
    from: string;
    line: number;
    reason: string | null;
    start: number;
    to: string;
}

export interface ReferenceFinding {
    construct: string;
    file: string;
    token: string;
    value: string;
}

export interface WordScope {
    readonly roots: readonly string[];
    readonly extensions: readonly string[];
    readonly skipped: (relPath: string) => boolean;
}

export interface VocabularyScope extends WordScope {
    readonly skippedPaths: readonly string[];
    readonly wholeIdRoots: readonly string[];
}

export interface RenameReach {
    readonly prose: boolean;
    readonly wholeId: boolean;
}

export interface PlainClosedValue {
    readonly file: string;
    readonly line: number;
    readonly target: string;
    readonly vocabulary: string;
}

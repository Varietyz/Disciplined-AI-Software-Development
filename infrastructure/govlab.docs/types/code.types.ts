import type {
    CodeEdge,
    CodeGraph,
    CodeNode,
    CodeSource,
    DetectedMessage,
    DetectedTransition,
} from "#types/graph.types";
import type { GraphStore } from "#core/stores/graph.store";
import type ts from "typescript";

export interface RecognizerResult {
    edges: CodeEdge[];
    nodes: CodeNode[];
}

export interface RecognizerContext {
    currentId: string;
    mkNodeId: (node: ts.Node) => string;
    sourceOf: (node: ts.Node) => CodeSource;
}

export interface Recognizer {
    classify: (node: ts.Node, context: RecognizerContext) => RecognizerResult | null;
    emits: { edges: string[]; nodes: string[] };
    name: string;
}

export interface AnalyzeRequest {
    logger?: (message: string) => void;
    moduleDir: string;
    pkg: Record<string, unknown>;
    recognizers: readonly Recognizer[];
}

export interface Analyzer {
    analyze: (request: AnalyzeRequest) => CodeGraph | null;
    canAnalyze: (moduleDir: string, pkg?: Record<string, unknown>) => boolean;
    ecosystem: string;
}

export interface EntrySeed {
    name: string;
    label: string;
    axis: string;
    barrel: string;
}

export interface BarrelExport {
    name: string;
    label: string;
}

export interface AxisBarrel {
    axis: string;
    barrel: string;
}

export interface PackageJsonLike {
    exports?: unknown;
    main?: unknown;
    module?: unknown;
    types?: unknown;
}

export interface ProgramAnalysis {
    checker: ts.TypeChecker;
    dirPosix: string;
    program: ts.Program;
}

export interface WalkerContext extends ProgramAnalysis {
    store: GraphStore;
    recognizers: readonly Recognizer[];
}

export interface CallContext {
    child: ts.CallExpression;
    currentId: string;
    decl: ts.Declaration | null;
    fn: ts.FunctionLikeDeclaration | null;
    sym: ts.Symbol | undefined;
}

export interface CollaboratorSpec {
    cid: string;
    currentId: string;
    edgeLabel?: string;
    label: string;
    source: CodeSource;
}

export interface CalleeParts {
    method: string;
    owner: string;
}

export interface ApiEntry {
    fn: ts.FunctionLikeDeclaration;
    name: string;
}

export interface PropTarget {
    name: string;
    target: ts.FunctionLikeDeclaration | null;
}

export interface StateCandidate {
    hinted: boolean;
    members: string[];
}

export interface KeyedTransition extends DetectedTransition {
    key: string;
}

export interface OrchestrationTarget {
    method: string;
    participant: string;
}

export interface OrchestrationFold {
    messages: DetectedMessage[];
    msgKey: Set<string>;
    seen: Set<string>;
}

export interface FunctionBody {
    body: ts.ConciseBody | undefined;
    name: string;
}

export type TypeDecl = ts.ClassDeclaration | ts.EnumDeclaration | ts.InterfaceDeclaration | ts.TypeAliasDeclaration;

export interface TypeEdgeContext {
    checker: ts.TypeChecker;
    fromId: string;
    ids: ReadonlyMap<TypeDecl, string>;
}

export interface ParsedFunc {
    bodyEnd: number;
    bodyStart: number;
    name: string;
    receiver: string | null;
    sigPos: number;
}

export interface GoFunc extends ParsedFunc {
    file: string;
    line: number;
}

export interface GoCall {
    name: string;
    qualifier: string | null;
}

export interface GoReceiver {
    next: number;
    receiver: string | null;
}

export interface GoCallScan {
    src: string;
    start: number;
    end: number;
}

export interface GoFuncHit {
    func: ParsedFunc;
    next: number;
}

export interface GoCallHit {
    call: GoCall | null;
    next: number;
}

export interface GoIndex {
    fileSrc: Map<string, string>;
    funcMap: Map<string, GoFunc>;
}

export interface GoGraphContext extends GoIndex {
    store: GraphStore;
    relPath: (file: string) => string;
}

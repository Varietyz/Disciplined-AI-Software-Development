import type { CodeFinding, CodeGraph, CodeInsight, SymbolStat } from "#types/code.types";
import type { Crumb, NestedChild, ReportPage } from "#types/report.types";
import type { WalkCell, WalkNode } from "#types/walk.types";
import type { FileEntry } from "#types/package.types";

export interface TreeLeaf {
    kind: "file";
    rel: string;
    name: string;
    count: number;
    entry: FileEntry;
}

export interface TreeGroup {
    kind: "dir";
    rel: string;
    name: string;
    count: number;
    children: TreeNode[];
}

export type TreeNode = TreeGroup | TreeLeaf;

export interface HexPage {
    page: string;
    rel: string;
    label: string;
    crumbs: Crumb[];
    inlined: FileEntry[];
    drilled: TreeNode[];
}

export interface RenderContext {
    fanIn: ReadonlyMap<string, number>;
    graph: CodeGraph;
    insight: CodeInsight;
    findings: readonly CodeFinding[];
    title: string;
}

export interface Nested {
    child: NestedChild;
    node: WalkNode;
    flagged: boolean;
    severity: string;
}

export interface PageParts {
    findings: CodeFinding[];
    label: string;
    nested: Nested[];
    nestedFlags: ReadonlyMap<string, string>;
    symbols: SymbolStat[];
}

export interface PageOutput {
    html: string;
    mainSvg: string;
    mainCells: WalkCell[];
    nestedSvg: string;
    nestedCells: WalkCell[];
    report: ReportPage;
}

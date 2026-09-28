export interface SourcePosition {
    line: number;
    column: number;
}

export interface SourceLoc {
    start: SourcePosition;
    end: SourcePosition;
}

export interface AstNode {
    [key: string]: unknown;
    type: string;
    loc: SourceLoc;
}

export type CopyOf = (node: AstNode | null) => AstNode | null;

export interface ExportedName {
    name: string;
    target: AstNode;
}

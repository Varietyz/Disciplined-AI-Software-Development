export interface CstNode {
    type: string;
    isNamed: boolean;
    childCount: number;
    child: (index: number) => CstNode | null;
    text?: string;
    startPosition?: { row: number; column: number };
    startIndex?: number;
    endIndex?: number;
    childForFieldName?: (field: string) => CstNode | null;
}

export interface RawNode {
    type: string;
    childCount: number;
    isNamed: boolean | (() => boolean);
    child: (index: number) => RawNode | null;
    text?: string;
    startPosition?: { row: number; column: number };
    startIndex: number;
    endIndex: number;
    fieldNameForChild?: (index: number) => string | null;
}

export interface ParseLogger {
    warn: (message: string, detail?: unknown) => void;
}

export interface CodeParseOptions {
    logger?: ParseLogger;
}

export interface ParseAttempt {
    readonly root: CstNode | null;
    readonly complete: boolean;
}

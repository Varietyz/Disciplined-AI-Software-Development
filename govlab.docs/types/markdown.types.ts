export interface Fence {
    open: boolean;
    char: string;
    len: number;
}

export interface FenceRun {
    char: string;
    len: number;
}

export interface MaskState {
    prevBlank: boolean;
    inIndentedCode: boolean;
    listContentIndent: number;
    fence: Fence;
}

export interface TextSpan {
    text: string;
    next: number;
}

export interface TokenSpan {
    start: number;
    next: number;
}

export interface PathSpan {
    span: [number, number] | null;
    next: number;
}

export type ConventionCode = "bare-path" | "unlabeled-code-fence" | "untagged-code-fence";

export interface ConventionHit {
    code: ConventionCode;
    line: number;
    col: number;
    token: string;
}

export interface BannedHit {
    term: string;
    line: number;
    col: number;
}

export interface ConcernLayer {
    id: string;
    body: string;
}

export type LayerDefectCode = "duplicate-marker" | "orphan-close" | "unclosed-marker";

export interface LayerDefect {
    code: LayerDefectCode;
    id: string;
}

export interface LayerSplit {
    layers: ConcernLayer[];
    defects: LayerDefect[];
}

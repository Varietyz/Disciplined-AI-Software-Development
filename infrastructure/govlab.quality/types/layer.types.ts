export interface LayerSegment {
    layer: string;
    needle: string;
}

export interface LayerOptions {
    segments?: LayerSegment[];
    tokensFile?: string;
}

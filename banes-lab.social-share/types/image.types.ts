export interface RenderedImage {
    readonly card: string;
    readonly profile: string;
    readonly scale: number;
    readonly hash: string;
    readonly still: Buffer;
    readonly animation: Buffer | null;
    readonly motion: Buffer | null;
    readonly video: Buffer | null;
}

export interface ImageSize {
    readonly width: number;
    readonly height: number;
}

export interface ShareEntry {
    readonly page: string;
    readonly source: string;
    readonly alt: string;
}

export type ShareLedger = ReadonlyMap<string, string>;

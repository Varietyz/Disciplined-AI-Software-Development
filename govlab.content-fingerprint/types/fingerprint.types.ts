export interface FingerprintIndex {
    flush: () => void;
    unchanged: (key: string, hash: string) => boolean;
    update: (key: string, hash: string) => void;
}

export interface FingerprintIndexOptions {
    file: string;
    force?: boolean;
}

export interface Compressibility {
    push: (...chunks: readonly string[]) => void;
    ratio: () => number;
}

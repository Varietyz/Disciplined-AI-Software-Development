export const pruneLine = function pruneLine(count: number, bytes: number): string {
    return `prune: removed ${String(count)} unreferenced file(s), ${String(bytes)} bytes\n`;
};

export const missingVector = function missingVector(path: string): string {
    return `A diagram on this route has no rendered vector at ${path}.`;
};

export const missingWalk = function missingWalk(path: string): string {
    return `A walk on this route has no asset at ${path}.`;
};

export const missingRecording = function missingRecording(path: string): string {
    return `A surface figure on this route has no recording at ${path}.`;
};

export const missingSource = function missingSource(path: string): string {
    return `A source on this route has no text at ${path}.`;
};

export const REFUSED_ARGUMENTS =
    "REFUSED — at least one --route, each starting with /, and an --out-dir are required; a shell that rewrites /route into a file path must be told not to\n";

export const NO_BROWSER = "capture: no browser binary found; pass --browser <path to chrome or edge>\n";

export const neverListened = function neverListened(port: number): string {
    return `capture: the dev server never listened on port ${String(port)}\n`;
};

export const listeningAfter = function listeningAfter(ms: number): string {
    return `capture: dev server listening after ${String(ms)} ms\n`;
};

export const portStillHeld = function portStillHeld(port: number): string {
    return `capture: port ${String(port)} is still held after stopping the server it started\n`;
};

export const portHeld = function portHeld(port: number, holders: readonly string[]): string {
    return `capture: REFUSED — port ${String(port)} is held by pid ${holders.join(", ")}; stop that server first, this tool stops only a server it started\n`;
};

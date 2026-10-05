export const DEV_SUMMARY =
    "Start the site and the social share dev servers side by side, each on its declared port, with every output line prefixed by the server that wrote it. A port still held by an earlier server is freed first, and when one server exits or the command is interrupted, both stop.";

export const commandFailed = function commandFailed(file: string): string {
    return `server adapter: ${file} failed. Its error is attached as the cause.`;
};

export const signalFailed = function signalFailed(pid: number): string {
    return `server adapter: signaling process ${String(pid)} failed. Its error is attached as the cause.`;
};

export const probeFailed = function probeFailed(pid: number): string {
    return `server adapter: probing process ${String(pid)} failed. Its error is attached as the cause.`;
};

export const SITE_SERVER_LABEL = "site";

export const SOCIAL_SERVER_LABEL = "social";

export const serverExitLine = function serverExitLine(label: string, code: number | null): string {
    return `[dev] the ${label} server exited with code ${String(code)}; stopping the others\n`;
};

export const portHeldLine = function portHeldLine(port: number, pids: string): string {
    return `[free-port] port ${String(port)} still held after terminating pid ${pids} — start will fail\n`;
};

export const portReleasedLine = function portReleasedLine(port: number, pids: string): string {
    return `[free-port] released port ${String(port)} from pid ${pids}\n`;
};

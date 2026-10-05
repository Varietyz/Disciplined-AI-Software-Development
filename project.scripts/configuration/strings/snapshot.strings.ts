export const REFUSED_ARGUMENTS = "REFUSED — --url is required, and one of --out or --log\n";

export const NO_BROWSER = "snapshot: no browser binary found; pass --browser <path to chrome or edge>\n";

export const NO_DEVTOOLS = "snapshot: devtools endpoint never came up\n";

export const EMPTY_FRAME = "snapshot: browser returned an empty frame\n";

export const clickedLine = function clickedLine(x: number, y: number): string {
    return `snapshot: clicked ${String(x)},${String(y)}\n`;
};

export const logWritten = function logWritten(path: string, records: number): string {
    return `snapshot: wrote ${path} (${String(records)} console records)\n`;
};

export const shotWritten = function shotWritten(path: string): string {
    return `snapshot: wrote ${path}\n`;
};

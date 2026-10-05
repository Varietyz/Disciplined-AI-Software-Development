import { BIN_SEGMENTS } from "#configuration/constants/shell.constants";
import path from "node:path";

export const withPathEntry = function withPathEntry(current: string | undefined, dir: string): string {
    const segments = typeof current === "string" && current.length > 0 ? current.split(path.delimiter) : [];
    return segments.includes(dir) ? segments.join(path.delimiter) : [dir, ...segments].join(path.delimiter);
};

export const withNodeOption = function withNodeOption(current: string | undefined, option: string): string {
    const base = typeof current === "string" ? current : "";
    return base.includes(option) ? base : `${base} ${option}`.trim();
};

export const stageBinDir = function stageBinDir(root: string): string {
    return path.join(root, ...BIN_SEGMENTS);
};

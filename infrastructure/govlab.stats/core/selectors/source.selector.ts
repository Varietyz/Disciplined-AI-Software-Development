import { EXTENSION_DOT, NO_EXTENSION } from "#configuration/constants/source.constants";
import path from "node:path";

export const extensionOf = function extensionOf(name: string): string {
    const lower = name.toLowerCase();
    const dot = lower.lastIndexOf(EXTENSION_DOT);
    return dot <= 0 ? NO_EXTENSION : lower.slice(dot);
};

export const posixOf = function posixOf(relative: string): string {
    return relative.split(path.sep).join("/");
};

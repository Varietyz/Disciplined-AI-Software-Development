import { PRECOMPRESSED_EXTENSIONS } from "#configuration/constants/asset.constants";
import { createHash } from "node:crypto";

const DIGEST_ALGORITHM = "sha256";
const DIGEST_ENCODING = "hex";
const SLASH = "/";
const BACKSLASH = "\\";
const DOT = ".";

export const digestOf = function digestOf(text: Uint8Array | string): string {
    return createHash(DIGEST_ALGORITHM).update(text).digest(DIGEST_ENCODING);
};

export const digestedFileName = function digestedFileName(prefix: string, text: string, suffix: string): string {
    return prefix + digestOf(text) + suffix;
};

export const toPosix = function toPosix(value: string): string {
    return value.split(BACKSLASH).join(SLASH);
};

export const extensionOf = function extensionOf(file: string): string {
    const dot = file.lastIndexOf(DOT);
    return dot === -1 ? "" : file.slice(dot);
};

export const stripCompression = function stripCompression(file: string): string {
    const extension = extensionOf(file);
    return PRECOMPRESSED_EXTENSIONS.has(extension) ? file.slice(0, -extension.length) : file;
};

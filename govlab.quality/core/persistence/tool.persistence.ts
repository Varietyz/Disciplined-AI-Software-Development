import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { writeCanonicalJson, writeVerbatim } from "@govlab/canonical-write";
import path from "node:path";
import { relativePath } from "@ssot/paths";

export const toolCacheDir = function toolCacheDir(root: string, ...segments: string[]): string {
    const dir = path.join(root, relativePath("toolCache"), ...segments);
    mkdirSync(dir, { recursive: true });
    return dir;
};

export const toolCacheRelative = function toolCacheRelative(...segments: string[]): string {
    return relativePath("toolCache", ...segments);
};

export const writeToolFile = function writeToolFile(root: string, name: string, content: string): string {
    const file = path.join(toolCacheDir(root), name);
    writeVerbatim(file, content);
    return file;
};

export const writeToolJson = async function writeToolJson(
    root: string,
    name: string,
    content: Record<string, unknown>,
): Promise<string> {
    const file = path.join(toolCacheDir(root), name);
    await writeCanonicalJson(file, content);
    return file;
};

export const freshToolFile = function freshToolFile(root: string, name: string): string {
    const file = path.join(toolCacheDir(root), name);
    rmSync(file, { force: true });
    return file;
};

export const readToolReport = function readToolReport(file: string): string {
    return existsSync(file) ? readFileSync(file, "utf8") : "";
};

import {
    INDEX_ENTRY_MARK,
    MARKDOWN_EXTENSION,
    MEMORY_FOLDER,
    MEMORY_INDEX,
    MEMORY_PROJECTS,
    SLUG_CHARS,
    SLUG_FILL,
    TYPE_KEY,
    UNSPECIFIED_TYPE,
} from "#configuration/constants/agent.constants";
import type { MemoryFile, MemoryStats } from "#types/agent.types";
import { readFileSync, statSync } from "node:fs";
import { LINE_BREAK } from "#configuration/constants/source.constants";
import { frontmatterValue } from "#core/selectors/document.selector";
import { homedir } from "node:os";
import path from "node:path";
import { readdirOrNull } from "#core/loaders/folder.loader";
import { relativePath } from "@ssot/paths";
import { tally } from "#core/selectors/metric.selector";

const projectSlug = function projectSlug(absPath: string): string {
    let slug = "";
    for (let at = 0; at < absPath.length; at += 1) {
        const ch = absPath.charAt(at);
        slug += SLUG_CHARS.has(ch) ? ch : SLUG_FILL;
    }
    return slug;
};

const countIndexEntries = function countIndexEntries(text: string): number {
    return text.split(LINE_BREAK).filter((line) => line.trim().startsWith(INDEX_ENTRY_MARK)).length;
};

const readMemoryFile = function readMemoryFile(dir: string, name: string): MemoryFile {
    const abs = path.join(dir, name);
    const text = readFileSync(abs, "utf8");
    if (name === MEMORY_INDEX) {
        return { bytes: 0, index: countIndexEntries(text), type: null };
    }
    return { bytes: statSync(abs).size, index: 0, type: frontmatterValue(text, TYPE_KEY) ?? UNSPECIFIED_TYPE };
};

export const memoryDirOf = function memoryDirOf(root: string): string {
    return path.join(homedir(), relativePath("claude.root"), MEMORY_PROJECTS, projectSlug(root), MEMORY_FOLDER);
};

export const collectMemory = function collectMemory(root: string): MemoryStats {
    const dir = memoryDirOf(root);
    const entries = readdirOrNull(dir);
    if (entries === null) {
        return { byType: new Map(), bytes: 0, dir, files: 0, indexEntries: 0, present: false };
    }
    const parsed = entries
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(MARKDOWN_EXTENSION))
        .map((entry) => readMemoryFile(dir, entry.name));
    const typed = parsed.filter((info) => info.type !== null);
    return {
        byType: tally(typed, (info) => info.type ?? UNSPECIFIED_TYPE),
        bytes: parsed.reduce((sum, info) => sum + info.bytes, 0),
        dir,
        files: typed.length,
        indexEntries: parsed.reduce((sum, info) => sum + info.index, 0),
        present: true,
    };
};

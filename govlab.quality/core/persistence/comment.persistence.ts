import type { FileComment } from "#types/comment.types";
import { promises as fs } from "node:fs";
import { govlabPrettierConfig } from "#core/adapters/tool.prettier.adapter";
import { isRecord } from "#core/selectors/record.selector";
import path from "node:path";
import { readFileSafe } from "#core/loaders/source.loader";
import { writeCanonicalJson } from "@govlab/canonical-write";

const isFileComment = function isFileComment(value: unknown): value is FileComment {
    return (
        isRecord(value) &&
        typeof value["file"] === "string" &&
        typeof value["line"] === "number" &&
        typeof value["text"] === "string"
    );
};

const readExisting = function readExisting(outPath: string): FileComment[] {
    const text = readFileSafe(outPath);
    if (text === "") {
        return [];
    }
    const parsed: unknown = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.filter(isFileComment) : [];
};

const keyOf = function keyOf(comment: FileComment): string {
    return `${comment.file}::${String(comment.line)}::${comment.text}`;
};

export const appendExtracted = async function appendExtracted(
    outPath: string,
    collected: readonly FileComment[],
): Promise<number> {
    const existing = readExisting(outPath);
    const seen = new Set(existing.map(keyOf));
    const fresh = collected.filter((comment) => {
        const isNew = !seen.has(keyOf(comment));
        seen.add(keyOf(comment));
        return isNew;
    });
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await writeCanonicalJson(outPath, [...existing, ...fresh], await govlabPrettierConfig(process.cwd()));
    return fresh.length;
};

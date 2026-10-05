import type { AccessHit } from "#types/access.types";
import path from "node:path";

const INDEX_ACCESS_TAG = "error TS4111";
const RADIX = 10;

const normalize = function normalize(filePath: string): string {
    return path.resolve(filePath).split("\\").join("/");
};

const hitOf = function hitOf(raw: string): { file: string; hit: AccessHit } | null {
    const paren = raw.indexOf("(");
    const comma = raw.indexOf(",", paren);
    const close = raw.indexOf(")", comma);
    if (paren === -1 || comma === -1 || close === -1) {
        return null;
    }
    const line = Number.parseInt(raw.slice(paren + 1, comma), RADIX);
    const column = Number.parseInt(raw.slice(comma + 1, close), RADIX);
    if (!Number.isInteger(line) || !Number.isInteger(column)) {
        return null;
    }
    return { file: normalize(raw.slice(0, paren)), hit: { column, line } };
};

export const hitsByFile = function hitsByFile(output: string): Map<string, AccessHit[]> {
    const byFile = new Map<string, AccessHit[]>();
    for (const raw of output.split("\n")) {
        const parsed = raw.includes(INDEX_ACCESS_TAG) ? hitOf(raw) : null;
        if (parsed !== null) {
            byFile.set(parsed.file, [...(byFile.get(parsed.file) ?? []), parsed.hit]);
        }
    }
    return byFile;
};

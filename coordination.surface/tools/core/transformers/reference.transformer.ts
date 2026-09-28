import { AXIS_DOCUMENTS, NODE_MODULES, SURFACE_ROOT } from "../constants/path.constants.ts";
import {
    applyEdits,
    editsFromFieldPrefixes,
    editsFromFieldValues,
    editsFromInlinePrefixes,
    editsFromInlines,
} from "./segment.transformer.ts";
import { readSource, toPosix, walk } from "../iterators/file.iterator.ts";
import type { Move } from "../types/reference.types.ts";

import { REFERENCE_FIELDS } from "../matchers/reference.matcher.ts";
import type { RenameMap } from "../types/segment.types.ts";
import { isFilesystemRefusal } from "../predicates/file.predicate.ts";
import { readDocument } from "../readers/document.reader.ts";
import { resolve } from "node:path";
import { writeFileSync } from "node:fs";

const SCAN_ROOTS = [SURFACE_ROOT];

const ROOT_DOCUMENTS = AXIS_DOCUMENTS;

export const renameMapOf = function renameMapOf(moves: readonly Move[]): Record<string, string> {
    const map: Record<string, string> = {};
    for (const move of moves) {
        map[move.from] = move.to;
        map[`local:${move.from}`] = `local:${move.to}`;
    }
    return map;
};

const sourceOf = function sourceOf(file: string): string | null {
    try {
        return readSource(file);
    } catch (error) {
        if (isFilesystemRefusal(error)) {
            return null;
        }
        throw error;
    }
};

const rewriteFile = function rewriteFile(repoRoot: string, file: string, map: RenameMap): number {
    const source = sourceOf(file);
    if (source === null) {
        return 0;
    }

    const document = readDocument(toPosix(repoRoot, file), source);
    const edits = [
        ...editsFromInlines(document, map, ["link-target", "inline-code", "import-path"]),
        ...editsFromFieldPrefixes(document, REFERENCE_FIELDS, map),
        ...editsFromInlinePrefixes(document, map, ["link-target", "inline-code"]),
        ...REFERENCE_FIELDS.flatMap((key) => editsFromFieldValues(document, key, map)),
    ];
    const result = edits.length === 0 ? null : applyEdits(source, edits);
    if (result === null || result.rejected.length > 0) {
        return 0;
    }

    writeFileSync(file, result.text, "utf8");
    return result.applied.length;
};

export const rewriteReferences = function rewriteReferences(repoRoot: string, map: RenameMap): number {
    const files = [
        ...SCAN_ROOTS.flatMap((root) =>
            walk({ extensions: [".md", ".ts"], ignored: [NODE_MODULES], root: resolve(repoRoot, root) }),
        ),
        ...ROOT_DOCUMENTS.map((name) => resolve(repoRoot, name)),
    ];

    return files.reduce((count, file) => count + rewriteFile(repoRoot, file, map), 0);
};

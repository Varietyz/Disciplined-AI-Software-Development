import { existsSync, readFileSync } from "node:fs";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { GRAPH_PATH } from "../resolvers/anchor.resolver.ts";
import { malformedClosureGraph } from "../strings/graph.strings.ts";

export const normalizeImport = function normalizeImport(fromFile: string, importPath: string): string | null {
    if (!importPath.startsWith(".")) {
        return null;
    }
    const parts = fromFile.split("/").slice(0, -1);
    for (const seg of importPath.split("/")) {
        if (seg === "..") {
            parts.pop();
            continue;
        }
        if (seg !== ".") {
            parts.push(seg);
        }
    }
    const resolved = parts.join("/");
    return resolved.endsWith(".ts") ? resolved : null;
};

const LIST_FIELDS = [
    "registers",
    "consumers",
    "emits",
    "subscribes",
    "eventActivity",
    "exports",
    "imports",
    "externalConsumers",
    "sideEffectImports",
    "interfaces",
    "idsExports",
    "stringsExports",
    "iconsExports",
] as const;

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const isClosureGraph = function isClosureGraph(value: unknown): value is ClosureGraph {
    return isRecord(value) && LIST_FIELDS.every((field) => Array.isArray(value[field]));
};

export const loadClosureGraph = function loadClosureGraph(): ClosureGraph | null {
    if (!existsSync(GRAPH_PATH)) {
        return null;
    }
    const parsed: unknown = JSON.parse(readFileSync(GRAPH_PATH, "utf8"));
    if (!isClosureGraph(parsed)) {
        throw new TypeError(malformedClosureGraph(GRAPH_PATH, LIST_FIELDS));
    }
    return parsed;
};

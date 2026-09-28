import type { LoadedSource } from "../types/source.types.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { pathToFileURL } from "node:url";

export const importSource = async function importSource(file: string): Promise<LoadedSource> {
    try {
        const loaded: unknown = await import(pathToFileURL(file).href);
        return { error: null, exports: isObject(loaded) ? loaded : {}, file };
    } catch (error) {
        return { error: String(error), exports: null, file };
    }
};

export const importSources = async function importSources(files: readonly string[]): Promise<LoadedSource[]> {
    return Promise.all(files.map(importSource));
};

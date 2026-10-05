import type { DiskFile } from "#types/structure.types";
import type { ImportEdge } from "@banes-lab/web/types/anatomy.types.js";
import type { SpecifierResolver } from "#types/anatomy.types";
import { ingestImports } from "@govlab/patterns";

const KEY_SEPARATOR = "::";
const PATH_SEPARATOR = "/";

const containerOfPath = function containerOfPath(path: string): string {
    const cut = path.indexOf(PATH_SEPARATOR);
    return cut === -1 ? "" : path.slice(0, cut);
};

const fileEdges = async function fileEdges(file: DiskFile, resolve: SpecifierResolver): Promise<string[]> {
    const from = containerOfPath(file.path);
    const bindings = await ingestImports(file.text, file.path);
    return bindings.flatMap((binding) => {
        const target = resolve(binding.source, file.path);
        const to = target === null ? "" : containerOfPath(target);
        return from !== "" && to !== "" && to !== from ? [from + KEY_SEPARATOR + to] : [];
    });
};

const edgeOf = function edgeOf(key: string, count: number): ImportEdge {
    const cut = key.indexOf(KEY_SEPARATOR);
    return { count, from: key.slice(0, cut), to: key.slice(cut + KEY_SEPARATOR.length) };
};

export const importEdgesOf = async function importEdgesOf(
    files: readonly DiskFile[],
    resolverOf: (files: ReadonlySet<string>) => SpecifierResolver,
): Promise<ImportEdge[]> {
    const resolve = resolverOf(new Set(files.map((file) => file.path)));
    const counts = new Map<string, number>();
    const keys = await Promise.all(files.map(async (file) => fileEdges(file, resolve)));
    for (const key of keys.flat()) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
        .map(([key, count]) => edgeOf(key, count))
        .sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
};

import { filesystemImports } from "../predicates/source.predicate.ts";
import { localImports } from "../analyzers/graph.analyzer.ts";

const WRITE_MEMBERS = [`writeFileSync`, `rmSync`, `mkdirSync`];

interface WriteBreach {
    readonly path: string;
    readonly member: string;
}

export const importsWriter = function importsWriter(source: string): string | null {
    return (
        filesystemImports(source)
            .map((line) => WRITE_MEMBERS.find((member) => line.includes(member)))
            .find((member) => member !== undefined) ?? null
    );
};

export const reachableFrom = function reachableFrom(
    entries: readonly string[],
    known: ReadonlySet<string>,
    read: (path: string) => string,
): string[] {
    const seen = new Set<string>();
    const queue = [...entries];

    while (queue.length > 0) {
        const path = queue.shift() ?? "";
        if (path.length > 0 && !seen.has(path)) {
            seen.add(path);
            queue.push(...localImports(path, read(path), known));
        }
    }

    return [...seen].toSorted((left, right) => left.localeCompare(right, "en"));
};

export const unsanctionedWriters = function unsanctionedWriters(
    entries: readonly string[],
    known: ReadonlySet<string>,
    read: (path: string) => string,
    sanctioned: readonly string[],
): WriteBreach[] {
    return reachableFrom(entries, known, read)
        .filter((path) => !sanctioned.includes(path))
        .flatMap((path) => {
            const member = importsWriter(read(path));
            return member === null ? [] : [{ member, path }];
        });
};

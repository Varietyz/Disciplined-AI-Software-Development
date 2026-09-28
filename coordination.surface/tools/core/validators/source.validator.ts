import { filesystemImports } from "../predicates/source.predicate.ts";

const TREE_DECLARATION = "readsTree:";

const SCOPE_FIELD = `context.paths`;

const FILESYSTEM_READERS = ["readFileSync", "readdirSync", "existsSync", "statSync"];

interface SourceBreach {
    readonly locus: string;
    readonly actual: string;
    readonly decide: string;
    readonly resolved: string;
}

export const unscopedRead = function unscopedRead(source: string): SourceBreach | null {
    if (source.includes(TREE_DECLARATION)) {
        return null;
    }

    const imports = filesystemImports(source).some((line) =>
        FILESYSTEM_READERS.some((reader) => line.includes(reader)),
    );

    if (!source.includes(SCOPE_FIELD)) {
        return {
            actual: "the rule never reads the path set the run declares",
            decide:
                "a rule that builds its own file set cannot be narrowed, so `--scope` is inert for it while " +
                "the report states the run was narrowed; take the path set from the context and declare any " +
                "extra input in `reads`, so what the rule examined is what the run said it would examine",
            locus: "declared scope",
            resolved: "ignores scope",
        };
    }

    if (!imports) {
        return null;
    }

    return {
        actual: "the rule reads the filesystem directly",
        decide:
            "declare the extra inputs in `reads` and take them through the context — a rule reaching past " +
            "the context is outside the scope the run declares, so a narrowed run scans it wholly while the " +
            "report states it was narrowed, and no synthetic input can reach it, which is why it cannot be " +
            "proven to fire. Where the question is genuinely about the tree rather than about file contents, " +
            "declare `readsTree` with the reason instead",
        locus: "filesystem import",
        resolved: "unscoped read",
    };
};

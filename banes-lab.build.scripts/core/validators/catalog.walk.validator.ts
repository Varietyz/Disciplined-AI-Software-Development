import { fileOfAddress, queryIndex } from "#core/resolvers/catalog.resolver";
import type { Finding } from "#types/validation.types";
import { isRecord } from "#core/selectors/base.selector";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { undeclaredRelation } from "#configuration/strings/catalog.strings";

const RELATIONS_KEY = "relations";
const RELATION_KEY = "relation";

const jsonAt = function jsonAt(outDir: string, file: string): unknown {
    return JSON.parse(readFileSync(join(outDir, file), "utf8"));
};

const relationNamesIn = function relationNamesIn(value: unknown): readonly string[] {
    const groups = isRecord(value) ? value[RELATIONS_KEY] : undefined;
    if (!Array.isArray(groups)) {
        return [];
    }
    return groups.flatMap((group: unknown) => {
        const name = isRecord(group) ? group[RELATION_KEY] : undefined;
        return typeof name === "string" ? [name] : [];
    });
};

const declaredRelations = function declaredRelations(
    outDir: string,
    present: ReadonlySet<string>,
): ReadonlySet<string> {
    const queryFile = fileOfAddress(queryIndex().json);
    const contract: unknown = present.has(queryFile) ? jsonAt(outDir, queryFile) : null;
    const listed = isRecord(contract) ? contract[RELATIONS_KEY] : undefined;
    return new Set(Array.isArray(listed) ? listed.filter((name) => typeof name === "string") : []);
};

export const walkFindings = function walkFindings(
    outDir: string,
    files: readonly string[],
    present: ReadonlySet<string>,
): Finding[] {
    const declared = declaredRelations(outDir, present);
    return files.flatMap((file) =>
        [...new Set(relationNamesIn(jsonAt(outDir, file)))]
            .filter((name) => !declared.has(name))
            .map((name) => ({ file, message: undeclaredRelation(name) })),
    );
};

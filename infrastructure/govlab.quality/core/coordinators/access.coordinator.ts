import { UNKNOWN_SIGNAL, signalDeathMessage } from "#configuration/strings/tool.strings";
import { bracketAccess } from "#core/converters/access.converter";
import { hitsByFile } from "#core/parsers/access.parser";
import { readFileSync } from "node:fs";
import { signalKilled } from "#core/predicates/failure.predicate";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { writeVerbatim } from "@govlab/canonical-write";

const COMPILER = "tsc";

const diagnose = function diagnose(projectPath: string): string {
    const result = spawnTool("npx", [COMPILER, "--noEmit", "-p", projectPath], { encoding: "utf8" });
    if (signalKilled(result.status)) {
        throw new Error(signalDeathMessage(COMPILER, result.signal ?? UNKNOWN_SIGNAL));
    }
    return `${result.stdout}${result.stderr}`;
};

export const fixIndexAccess = function fixIndexAccess(projectPath: string): number {
    let total = 0;
    for (const [file, hits] of hitsByFile(diagnose(projectPath))) {
        const original = readFileSync(file, "utf8");
        const updated = bracketAccess(original, hits);
        if (updated !== original) {
            writeVerbatim(file, updated);
            total += hits.length;
        }
    }
    return total;
};

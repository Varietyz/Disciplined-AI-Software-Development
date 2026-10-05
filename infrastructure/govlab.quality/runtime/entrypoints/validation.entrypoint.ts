import { loadValidators, runValidators } from "#core/coordinators/validation.coordinator";
import { FAILURE_EXIT } from "#configuration/constants/invocation.constants";
import { GATE_SOURCE_EXTENSIONS } from "#configuration/constants/validation.constants";
import type { PathExclusion } from "#types/exclusions.types";
import { VALIDATION_ARGV } from "#configuration/configs/invocation.config";
import { dependentWorkspaces } from "#core/loaders/package.loader";
import { excludeMatcher } from "#core/factories/exclusions.factory";
import path from "node:path";
import process from "node:process";
import { readFileSync } from "node:fs";
import { resolveArgv } from "@govlab/argv";
import { safeReaddir } from "#core/loaders/source.loader";

const isSourceFile = function isSourceFile(name: string): boolean {
    return GATE_SOURCE_EXTENSIONS.has(path.extname(name));
};

const collectFiles = function collectFiles(root: string, isExcluded: PathExclusion): string[] {
    const out: string[] = [];
    const stack = [root];
    while (stack.length > 0) {
        const dir = stack.pop() ?? root;
        for (const entry of safeReaddir(dir)) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory() && !isExcluded(full)) {
                stack.push(full);
            }
            if (!entry.isDirectory() && isSourceFile(entry.name)) {
                out.push(full);
            }
        }
    }
    return out;
};

const [root = ""] = resolveArgv(VALIDATION_ARGV).positionals;
const isExcluded = await excludeMatcher(process.cwd());
const result = runValidators({
    consumers: dependentWorkspaces(process.cwd(), root).flatMap((dir) => collectFiles(dir, isExcluded)),
    files: collectFiles(root, isExcluded),
    readFile: (file) => readFileSync(file, "utf8"),
    validators: await loadValidators(),
});
process.stdout.write(`${result.panel}\n`);
process.exitCode = result.clean ? 0 : FAILURE_EXIT;

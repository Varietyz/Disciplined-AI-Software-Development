import { FAILURE_EXIT, FLAG_NAMES } from "#configuration/constants/invocation.constants";
import { absolutePath, relativePath } from "@ssot/paths";
import { hasFlag, resolveArgv } from "@govlab/argv";
import { INDEX_ARGV } from "#configuration/configs/invocation.config";
import type { OutputTarget } from "#types/document.output.types";
import { printErr } from "#core/reporters/base.reporter";
import process from "node:process";
import { runIndex } from "#core/coordinators/index.coordinator";

const targetOf = function targetOf(key: string): OutputTarget {
    return { path: absolutePath(key), rel: relativePath(key) };
};

const argv = resolveArgv(INDEX_ARGV);

try {
    await runIndex(hasFlag(argv, FLAG_NAMES.check), {
        json: targetOf("projectInfo.index.json"),
        markdown: targetOf("projectInfo.index.markdown"),
    });
} catch (error) {
    printErr(error instanceof Error ? error.message : String(error));
    process.exitCode = FAILURE_EXIT;
}

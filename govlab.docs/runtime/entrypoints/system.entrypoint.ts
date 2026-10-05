import { FAILURE_EXIT, FLAG_NAMES } from "#configuration/constants/invocation.constants";
import { absolutePath, relativePath } from "@ssot/paths";
import { hasFlag, resolveArgv } from "@govlab/argv";
import { SYSTEM_ARGV } from "#configuration/configs/invocation.config";
import { printErr } from "#core/reporters/base.reporter";
import process from "node:process";
import { runSystem } from "#core/coordinators/system.coordinator";

const argv = resolveArgv(SYSTEM_ARGV);

try {
    runSystem(hasFlag(argv, FLAG_NAMES.check), {
        path: absolutePath("docArch.system"),
        rel: relativePath("docArch.system"),
    });
} catch (error) {
    printErr(error instanceof Error ? error.message : String(error));
    process.exitCode = FAILURE_EXIT;
}

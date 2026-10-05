import { indentedError, manifestErrorCount, manifestsValid } from "#configuration/strings/manifest.strings";
import { print, printErr } from "#core/reporters/base.reporter";
import { FAILURE_EXIT } from "#configuration/constants/invocation.constants";
import { MANIFEST_ARGV } from "#configuration/configs/invocation.config";
import { ManifestRegistry } from "#core/registries/manifest.registry";
import process from "node:process";
import { resolveArgv } from "@govlab/argv";

resolveArgv(MANIFEST_ARGV);

const registry = await ManifestRegistry.create();
const errors = registry.validateAll();

if (errors.length > 0) {
    printErr(manifestErrorCount(errors.length));
    for (const error of errors) {
        printErr(indentedError(error));
    }
    process.exitCode = FAILURE_EXIT;
} else {
    print(manifestsValid(registry.modules.length));
}

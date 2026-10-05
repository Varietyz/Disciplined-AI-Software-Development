import { BUILD_COMMAND, BUILD_SUMMARY, buildFailed } from "#configuration/strings/grammar.strings";
import { GRAMMAR_SOURCES } from "#configuration/configs/grammar.config";
import { buildGrammars } from "#core/coordinators/grammar.coordinator";
import process from "node:process";
import { resolveArgv } from "@govlab/argv";
import { writeExtensionMap } from "#core/persistence/source.persistence";

const EXIT_FAILED = 1;

resolveArgv({ command: BUILD_COMMAND, flags: [], summary: BUILD_SUMMARY });

try {
    if (!(await buildGrammars(GRAMMAR_SOURCES, writeExtensionMap))) {
        process.exitCode = EXIT_FAILED;
    }
} catch (error) {
    process.stderr.write(buildFailed(error instanceof Error ? error.message : String(error)));
    process.exitCode = EXIT_FAILED;
}

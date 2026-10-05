import {
    DEBUG_FLAG,
    LIST_FLAG,
    PAG_SUMMARY,
    RESOLUTION_SUMMARY,
    STRICT_FLAG,
    SYMBOLS_SUMMARY,
    commandOf,
} from "#configuration/strings/ontology.report.strings";
import { ENTRYPOINT_FILES, FLAGS } from "#configuration/constants/invocation.constants";
import type { ArgvSpec } from "@govlab/argv";
import { relativePath } from "@ssot/paths";

const entrypointOf = function entrypointOf(file: string): string {
    return `${relativePath("govlab.context.entrypoints")}/${file}`;
};

const STRICT = { describe: STRICT_FLAG, name: FLAGS.strict, takesValue: false } as const;

export const RESOLUTION_ARGV: ArgvSpec = {
    command: commandOf(entrypointOf(ENTRYPOINT_FILES.ontology)),
    flags: [
        { describe: DEBUG_FLAG, name: FLAGS.debug, takesValue: false },
        { describe: LIST_FLAG, name: FLAGS.list, takesValue: false },
        STRICT,
    ],
    summary: RESOLUTION_SUMMARY,
};

export const PAG_ARGV: ArgvSpec = {
    command: commandOf(entrypointOf(ENTRYPOINT_FILES.grammar)),
    flags: [STRICT],
    summary: PAG_SUMMARY,
};

export const SYMBOLS_ARGV: ArgvSpec = {
    command: commandOf(entrypointOf(ENTRYPOINT_FILES.algorithm)),
    flags: [],
    summary: SYMBOLS_SUMMARY,
};

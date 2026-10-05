import {
    ACCESS_SUMMARY,
    CANON_SUMMARY,
    CATALOG_SUMMARY,
    COMMENT_SUMMARY,
    FIX_FLAG,
    IGNORE_FLAG,
    KNOBS_FLAG,
    MODE_FLAG,
    OUT_FLAG,
    PROJECTS_POSITIONAL,
    ROOT_POSITIONAL,
    RULES_FLAG,
    STRICT_FLAG,
    TARGET_SUMMARY,
    VALIDATION_ROOT,
    VALIDATION_SUMMARY,
    commandOf,
} from "#configuration/strings/invocation.strings";
import { ENTRYPOINT_FILES, FLAGS } from "#configuration/constants/invocation.constants";
import type { ArgvSpec } from "@govlab/argv";
import { relativePath } from "@ssot/paths";

const entrypointOf = function entrypointOf(file: string): string {
    return commandOf(`${relativePath("govlab.quality.entrypoints")}/${file}`);
};

const ROOT = { describe: ROOT_POSITIONAL, name: "root", optional: true } as const;

export const CATALOG_ARGV: ArgvSpec = {
    command: entrypointOf(ENTRYPOINT_FILES.catalog),
    flags: [
        { describe: RULES_FLAG, name: FLAGS.rules, takesValue: true },
        { describe: KNOBS_FLAG, name: FLAGS.knobs, takesValue: true },
    ],
    summary: CATALOG_SUMMARY,
};

export const COMMENT_ARGV: ArgvSpec = {
    command: entrypointOf(ENTRYPOINT_FILES.comment),
    flags: [
        { describe: MODE_FLAG, name: FLAGS.mode, takesValue: true },
        { describe: OUT_FLAG, name: FLAGS.out, takesValue: true },
        { describe: IGNORE_FLAG, name: FLAGS.ignore, takesValue: true },
    ],
    positionals: [ROOT],
    summary: COMMENT_SUMMARY,
};

export const TARGET_ARGV: ArgvSpec = {
    command: entrypointOf(ENTRYPOINT_FILES.target),
    flags: [{ describe: FIX_FLAG, name: FLAGS.fix, takesValue: false }],
    positionals: [ROOT],
    summary: TARGET_SUMMARY,
};

export const ACCESS_ARGV: ArgvSpec = {
    command: entrypointOf(ENTRYPOINT_FILES.access),
    flags: [],
    rest: { describe: PROJECTS_POSITIONAL, name: "projects", optional: true, variadic: true },
    summary: ACCESS_SUMMARY,
};

export const VALIDATION_ARGV: ArgvSpec = {
    command: entrypointOf(ENTRYPOINT_FILES.validation),
    flags: [],
    positionals: [{ describe: VALIDATION_ROOT, name: "root" }],
    summary: VALIDATION_SUMMARY,
};

export const CANON_ARGV: ArgvSpec = {
    command: entrypointOf(ENTRYPOINT_FILES.canon),
    flags: [{ describe: STRICT_FLAG, name: FLAGS.strict, takesValue: false }],
    summary: CANON_SUMMARY,
};

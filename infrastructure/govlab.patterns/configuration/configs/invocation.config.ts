import {
    COMMAND_POSITIONAL,
    PATTERN_ARGV_SUMMARY,
    PATTERN_FLAGS,
    SOURCE_POSITIONAL,
} from "#configuration/strings/pattern.strings";
import { ENTRYPOINT_FILES, PATTERN_FLAG_NAMES, REPORT_FLAG_NAMES } from "#configuration/constants/invocation.constants";
import { MODULE_POSITIONAL, REPORT_ARGV_SUMMARY, REPORT_FLAGS } from "#configuration/strings/report.strings";
import { AXIS_ARGV_SUMMARY } from "#configuration/strings/axis.strings";
import type { ArgvSpec } from "@govlab/argv";
import { relativePath } from "@ssot/paths";

const commandOf = function commandOf(file: string): string {
    return `node ${relativePath("govlab.patterns.entrypoints")}/${file}`;
};

export const PATTERN_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.pattern),
    flags: [
        { describe: PATTERN_FLAGS.output, name: PATTERN_FLAG_NAMES.output, takesValue: true },
        { describe: PATTERN_FLAGS.mapping, name: PATTERN_FLAG_NAMES.mapping, takesValue: true },
        { describe: PATTERN_FLAGS.schema, name: PATTERN_FLAG_NAMES.schema, takesValue: true },
        { describe: PATTERN_FLAGS.window, name: PATTERN_FLAG_NAMES.window, takesValue: true },
        { describe: PATTERN_FLAGS.count, name: PATTERN_FLAG_NAMES.count, takesValue: true },
        { describe: PATTERN_FLAGS.seed, name: PATTERN_FLAG_NAMES.seed, takesValue: true },
    ],
    positionals: [
        { describe: COMMAND_POSITIONAL, name: "operation" },
        { describe: SOURCE_POSITIONAL, name: "source" },
    ],
    summary: PATTERN_ARGV_SUMMARY,
};

export const REPORT_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.report),
    flags: [
        { describe: REPORT_FLAGS.all, name: REPORT_FLAG_NAMES.all, takesValue: false },
        { describe: REPORT_FLAGS.check, name: REPORT_FLAG_NAMES.check, takesValue: false },
        { describe: REPORT_FLAGS.fast, name: REPORT_FLAG_NAMES.fast, takesValue: false },
        { describe: REPORT_FLAGS.ignore, name: REPORT_FLAG_NAMES.ignore, takesValue: true },
    ],
    positionals: [{ describe: MODULE_POSITIONAL, name: "module", optional: true }],
    summary: REPORT_ARGV_SUMMARY,
};

export const AXIS_ARGV: ArgvSpec = { command: commandOf(ENTRYPOINT_FILES.axis), flags: [], summary: AXIS_ARGV_SUMMARY };

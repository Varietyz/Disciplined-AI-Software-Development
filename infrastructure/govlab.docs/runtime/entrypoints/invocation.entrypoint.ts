import {
    ENTRYPOINT_FILES,
    FAILURE_EXIT,
    FLAG_NAMES,
    TEMPLATE_FLAG_KEYS,
} from "#configuration/constants/invocation.constants";
import { INVOCATION_USAGE, VERB_LABELS, modeBanner } from "#configuration/strings/invocation.strings";
import { flagValue, hasFlag, resolveArgv } from "@govlab/argv";
import { INVOCATION_ARGV } from "#configuration/configs/invocation.config";
import type { ParsedArgv } from "@govlab/argv";
import { absolutePath } from "@ssot/paths";
import { defineCheck } from "@govlab/context/check";
import { join } from "node:path";
import process from "node:process";
import { runInherited } from "#core/adapters/shell.adapter";

defineCheck({ detects: [], enforces: ["architecture:traceability", "architecture:self-describing-architecture"] });

interface Task {
    args: readonly string[];
    label: string;
    script: keyof typeof ENTRYPOINT_FILES;
}

type Mode = "fix" | "generate" | "new" | "validate";

const MODES: readonly Mode[] = ["validate", "fix", "new", "generate"];

const forwardedTemplate = function forwardedTemplate(argv: ParsedArgv): string[] {
    return TEMPLATE_FLAG_KEYS.flatMap((key) => {
        const value = flagValue(argv, FLAG_NAMES[key]);
        return value === undefined ? [] : [FLAG_NAMES[key], value];
    });
};

const tasksFor = function tasksFor(mode: Mode, argv: ParsedArgv): readonly Task[] {
    if (mode === "fix") {
        return [{ args: [FLAG_NAMES.fix], label: VERB_LABELS.authored, script: "document" }];
    }
    if (mode === "new") {
        return [
            { args: [FLAG_NAMES.new, ...forwardedTemplate(argv)], label: VERB_LABELS.scaffold, script: "document" },
        ];
    }
    if (mode === "generate") {
        return [
            { args: [FLAG_NAMES.all], label: VERB_LABELS.readmes, script: "readme" },
            { args: [], label: VERB_LABELS.system, script: "system" },
            { args: [], label: VERB_LABELS.workspace, script: "index" },
            { args: [FLAG_NAMES.catalog], label: VERB_LABELS.catalog, script: "document" },
        ];
    }
    return [
        { args: [FLAG_NAMES.validate, FLAG_NAMES.strict], label: VERB_LABELS.authored, script: "document" },
        { args: [], label: VERB_LABELS.manifests, script: "manifest" },
        { args: [FLAG_NAMES.check], label: VERB_LABELS.readmes, script: "readme" },
        { args: [FLAG_NAMES.check], label: VERB_LABELS.system, script: "system" },
        { args: [FLAG_NAMES.check], label: VERB_LABELS.workspace, script: "index" },
    ];
};

const argv = resolveArgv(INVOCATION_ARGV);
const mode = MODES.find((candidate) => hasFlag(argv, FLAG_NAMES[candidate]));

if (mode === undefined) {
    process.stderr.write(INVOCATION_USAGE);
    process.exitCode = FAILURE_EXIT;
} else {
    const entrypoints = absolutePath("govlab.docs.entrypoints");
    const failed = tasksFor(mode, argv).filter((task) => {
        process.stdout.write(modeBanner(mode, task.label));
        return runInherited(join(entrypoints, ENTRYPOINT_FILES[task.script]), task.args) !== 0;
    });
    process.exitCode = failed.length > 0 ? FAILURE_EXIT : 0;
}

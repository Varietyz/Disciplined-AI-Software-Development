import { ENTRYPOINT_FILES, FLAG_NAMES, TEMPLATE_FLAG_KEYS } from "#configuration/constants/invocation.constants";
import type { ArgvSpec, FlagSpec } from "@govlab/argv";
import { INVOCATION_FLAGS, INVOCATION_SUMMARIES, MODULE_POSITIONAL } from "#configuration/strings/invocation.strings";
import { relativePath } from "@ssot/paths";

const commandOf = function commandOf(file: string): string {
    return `node ${relativePath("govlab.docs.entrypoints")}/${file}`;
};

const toggle = function toggle(name: keyof typeof FLAG_NAMES): FlagSpec {
    return { describe: INVOCATION_FLAGS[name], name: FLAG_NAMES[name], takesValue: false };
};

const valued = function valued(name: keyof typeof FLAG_NAMES): FlagSpec {
    return { describe: INVOCATION_FLAGS[name], name: FLAG_NAMES[name], takesValue: true };
};

const TEMPLATE_FLAGS: readonly FlagSpec[] = TEMPLATE_FLAG_KEYS.map((key) => valued(key));

export const INVOCATION_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.invocation),
    flags: [toggle("validate"), toggle("fix"), toggle("new"), toggle("generate"), ...TEMPLATE_FLAGS],
    summary: INVOCATION_SUMMARIES.invocation,
};

export const DOCUMENT_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.document),
    flags: [toggle("validate"), toggle("strict"), toggle("fix"), toggle("catalog"), toggle("new"), ...TEMPLATE_FLAGS],
    summary: INVOCATION_SUMMARIES.document,
};

export const README_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.readme),
    flags: [toggle("all"), toggle("check"), toggle("fix")],
    summary: INVOCATION_SUMMARIES.readme,
};

export const PACKAGE_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.package),
    flags: [
        toggle("list"),
        toggle("fix"),
        toggle("check"),
        toggle("all"),
        toggle("write"),
        toggle("workspaceMapOnly"),
        valued("only"),
    ],
    positionals: [{ describe: MODULE_POSITIONAL, name: "module", optional: true }],
    summary: INVOCATION_SUMMARIES.package,
};

export const SYSTEM_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.system),
    flags: [toggle("check")],
    summary: INVOCATION_SUMMARIES.system,
};

export const INDEX_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.index),
    flags: [toggle("check")],
    summary: INVOCATION_SUMMARIES.index,
};

export const MANIFEST_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.manifest),
    flags: [],
    summary: INVOCATION_SUMMARIES.manifest,
};

export const COVERAGE_ARGV: ArgvSpec = {
    command: commandOf(ENTRYPOINT_FILES.coverage),
    flags: [toggle("strict")],
    summary: INVOCATION_SUMMARIES.coverage,
};

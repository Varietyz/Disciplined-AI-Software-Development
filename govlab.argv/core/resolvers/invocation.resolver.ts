import { ARGV_OFFSET, EXIT_CLEAN, EXIT_REFUSED } from "#configuration/constants/invocation.constants";
import type { ArgvSpec, ParsedArgv } from "#types/invocation.types";
import { HELP_UNANSWERED, refusedLine } from "#configuration/strings/invocation.strings";
import { parseArgv } from "#core/converters/invocation.converter";
import process from "node:process";

export class ArgvRefusedError extends Error {
    public constructor(reason: string) {
        super(reason);
        this.name = "ArgvRefusedError";
    }
}

export const argvOf = function argvOf(spec: ArgvSpec, words: readonly string[]): ParsedArgv {
    const outcome = parseArgv(spec, words);
    if (outcome.kind === "help") {
        throw new ArgvRefusedError(HELP_UNANSWERED);
    }
    if (outcome.kind === "refused") {
        throw new ArgvRefusedError(outcome.reason);
    }
    return outcome.argv;
};

export const resolveArgv = function resolveArgv(spec: ArgvSpec, argv?: readonly string[]): ParsedArgv {
    const outcome = parseArgv(spec, argv ?? process.argv.slice(ARGV_OFFSET));
    if (outcome.kind === "help") {
        process.stdout.write(outcome.usage);
        process.exit(EXIT_CLEAN);
    }
    if (outcome.kind === "refused") {
        process.stderr.write(refusedLine(outcome.reason, outcome.usage));
        process.exit(EXIT_REFUSED);
    }
    return outcome.argv;
};

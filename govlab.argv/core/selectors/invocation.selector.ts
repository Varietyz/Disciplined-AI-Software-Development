import { DECIMAL } from "#configuration/constants/invocation.constants";
import type { ParsedArgv } from "#types/invocation.types";

export const hasFlag = function hasFlag(argv: ParsedArgv, name: string): boolean {
    return argv.flags.has(name);
};

export const flagValues = function flagValues(argv: ParsedArgv, name: string): readonly string[] {
    return argv.flags.get(name) ?? [];
};

export const flagValue = function flagValue(argv: ParsedArgv, name: string): string | undefined {
    return argv.flags.get(name)?.at(0);
};

export const numberFlag = function numberFlag(argv: ParsedArgv, name: string, fallback: number): number {
    const parsed = Number.parseInt(flagValue(argv, name) ?? "", DECIMAL);
    return Number.isNaN(parsed) ? fallback : parsed;
};

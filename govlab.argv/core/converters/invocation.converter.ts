import type { ArgvOutcome, ArgvSpec } from "#types/invocation.types";
import { FLAG_PREFIX, HELP_FLAGS } from "#configuration/constants/invocation.constants";
import {
    missingValue,
    repeatedFlag,
    tooFewPositionals,
    tooManyPositionals,
    undeclaredFlag,
} from "#configuration/strings/invocation.strings";
import { usageOf } from "#core/formatters/invocation.formatter";

interface Scan {
    readonly flags: ReadonlyMap<string, readonly string[]>;
    readonly positionals: readonly string[];
    readonly rest: readonly string[];
    readonly refused: string | null;
    readonly help: boolean;
    readonly consumed: number;
}

const refused = function refused(scan: Scan, reason: string): Scan {
    return { ...scan, consumed: 1, refused: scan.refused ?? reason };
};

const withFlag = function withFlag(scan: Scan, word: string, value: string, consumed: number): Scan {
    const seen = scan.flags.get(word) ?? [];
    return { ...scan, consumed, flags: new Map([...scan.flags, [word, [...seen, value]]]) };
};

const takeFlag = function takeFlag(scan: Scan, spec: ArgvSpec, word: string, next: string | undefined): Scan {
    const flag = spec.flags.find((held) => held.name === word);
    if (flag === undefined) {
        return refused(scan, undeclaredFlag(word, spec.command));
    }
    if ((scan.flags.get(word) ?? []).length > 0 && flag.repeatable !== true) {
        return refused(scan, repeatedFlag(word));
    }
    if (!flag.takesValue) {
        return withFlag(scan, word, "", 1);
    }
    if (next === undefined || next.startsWith(FLAG_PREFIX)) {
        return refused(scan, missingValue(word));
    }
    return withFlag(scan, word, next, 2);
};

const restBegins = function restBegins(scan: Scan, spec: ArgvSpec): boolean {
    const declared = spec.positionals ?? [];
    return spec.rest !== undefined && declared.at(-1)?.variadic !== true && scan.positionals.length === declared.length;
};

const takeWord = function takeWord(scan: Scan, spec: ArgvSpec, word: string, next: string | undefined): Scan {
    if (restBegins(scan, spec)) {
        return { ...scan, consumed: 1, rest: [...scan.rest, word] };
    }
    if (HELP_FLAGS.has(word)) {
        return { ...scan, consumed: 1, help: true };
    }
    if (!word.startsWith(FLAG_PREFIX)) {
        return { ...scan, consumed: 1, positionals: [...scan.positionals, word] };
    }
    return takeFlag(scan, spec, word, next);
};

const arityRefusal = function arityRefusal(scan: Scan, spec: ArgvSpec): string | null {
    const declared = spec.positionals ?? [];
    const variadic = declared.at(-1)?.variadic === true;
    const given = scan.positionals.length;
    if (!variadic && given > declared.length) {
        return tooManyPositionals(given, declared.length, scan.positionals);
    }
    const required = declared.filter((held) => held.optional !== true).length;
    return given < required ? tooFewPositionals(given, required) : null;
};

export const parseArgv = function parseArgv(spec: ArgvSpec, argv: readonly string[]): ArgvOutcome {
    let scan: Scan = { consumed: 0, flags: new Map(), help: false, positionals: [], refused: null, rest: [] };
    let at = 0;
    while (at < argv.length && !scan.help) {
        scan = takeWord(scan, spec, argv[at] ?? "", argv[at + 1]);
        at += scan.consumed;
    }
    if (scan.help) {
        return { kind: "help", usage: usageOf(spec) };
    }
    const reason = scan.refused ?? arityRefusal(scan, spec);
    if (reason !== null) {
        return { kind: "refused", reason, usage: usageOf(spec) };
    }
    return { argv: { flags: scan.flags, positionals: scan.positionals, rest: scan.rest }, kind: "parsed" };
};

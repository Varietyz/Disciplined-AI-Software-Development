import type { Mutation, RequestedOperation } from "../types/entrypoint.types.ts";
import { codeMask, matchesAt, spacesFrom, wordFrom } from "../analyzers/source.analyzer.ts";

const FLAG_LEAD = "--";

const READ = "readFileSync";

const WRITE = "writeFileSync";

const COMPARISONS = ["!==", "===", "!=", "=="];

interface Event {
    readonly kind: "read" | "write";
    readonly target: string;
    readonly index: number;
    readonly line: number;
}

export const unsuppliedOperands = function unsuppliedOperands(requested: readonly RequestedOperation[]): string[] {
    return requested.filter((entry) => entry.requested && !entry.supplied).map((entry) => entry.refusal);
};

export const writesNothing = function writesNothing(
    argv: readonly string[],
    flag: string,
    selfRehearsing: readonly string[],
): boolean {
    return argv.includes(flag) && !selfRehearsing.some((form) => argv.includes(form));
};

const flagOf = function flagOf(token: string): string {
    const equals = token.indexOf("=");
    return equals === -1 ? token : token.slice(0, equals);
};

export const unknownArguments = function unknownArguments(argv: readonly string[], known: readonly string[]): string[] {
    const flags = argv
        .filter((token) => token.startsWith(FLAG_LEAD) && token.length > FLAG_LEAD.length)
        .map(flagOf)
        .filter((flag) => !known.includes(flag));
    return [...new Set(flags)];
};

export const unshareableOperations = function unshareableOperations(
    requested: readonly string[],
    exclusive: readonly string[],
): string[] {
    const held = requested.filter((flag) => exclusive.includes(flag));
    return held.length > 0 && requested.length > 1 ? held : [];
};

const argumentAt = function argumentAt(source: string, after: number): string | null {
    const open = spacesFrom(source, after);
    if (source.charAt(open) !== "(") {
        return null;
    }
    const argument = wordFrom(source, spacesFrom(source, open + 1));
    return argument.length === 0 ? null : argument;
};

const eventAt = function eventAt(source: string, index: number, line: number): Event | null {
    const read = matchesAt(source, index, READ);
    if (!read && !matchesAt(source, index, WRITE)) {
        return null;
    }
    const target = argumentAt(source, index + (read ? READ : WRITE).length);
    return target === null ? null : { index, kind: read ? "read" : "write", line, target };
};

const events = function events(source: string): Event[] {
    const mask = codeMask(source);
    const out: Event[] = [];
    let line = 1;

    for (let index = 0; index < source.length; index += 1) {
        const event = mask[index] === true ? eventAt(source, index, line) : null;
        if (event !== null) {
            out.push(event);
        }
        line += source.charAt(index) === "\n" ? 1 : 0;
    }

    return out;
};

const comparedBetween = function comparedBetween(source: string, from: number, to: number): boolean {
    return COMPARISONS.some((operator) => {
        const at = source.indexOf(operator, from);
        return at !== -1 && at + operator.length <= to;
    });
};

const witnessedWrite = function witnessedWrite(source: string, priors: readonly Event[], write: Event): boolean {
    const last = priors.at(-1);
    return priors.length >= 2 && last !== undefined && comparedBetween(source, last.index, write.index);
};

export const unwitnessedWrites = function unwitnessedWrites(source: string): Mutation[] {
    const ordered = events(source);

    return ordered
        .filter((event) => event.kind === "write")
        .flatMap((write) => {
            const priors = ordered.filter(
                (candidate) =>
                    candidate.kind === "read" && candidate.target === write.target && candidate.index < write.index,
            );
            const witnessed = witnessedWrite(source, priors, write);
            return priors.length === 0 || witnessed
                ? []
                : [{ line: write.line, reads: priors.length, target: write.target, witnessed }];
        });
};

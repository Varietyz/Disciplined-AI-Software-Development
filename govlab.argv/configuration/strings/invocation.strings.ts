export const REST_NOTE = " (passed through unread once every positional is given)";

export const REPEATABLE_NOTE = " (repeatable)";

export const FLAGS_SLOT = "[flags]";

export const VALUE_SLOT = "<value>";

export const HELP_ROW = "print this contract and exit before any effect";

export const CLOSING =
    "An undeclared flag is refused rather than ignored, because a word the script does not read still runs the script.";

export const HELP_UNANSWERED = "help was requested, which a programmatic caller cannot answer";

export const refusedLine = function refusedLine(reason: string, usage: string): string {
    return `REFUSED — ${reason}\n\n${usage}`;
};

export const undeclaredFlag = function undeclaredFlag(word: string, command: string): string {
    return `${word} is not a flag ${command} declares`;
};

export const repeatedFlag = function repeatedFlag(word: string): string {
    return `${word} was given more than once and is not repeatable`;
};

export const missingValue = function missingValue(word: string): string {
    return `${word} takes a value and none followed it`;
};

export const tooManyPositionals = function tooManyPositionals(
    given: number,
    declared: number,
    words: readonly string[],
): string {
    return `${String(given)} positional argument(s) given, ${String(declared)} declared: ${words.join(" ")}`;
};

export const tooFewPositionals = function tooFewPositionals(given: number, required: number): string {
    return `${String(given)} positional argument(s) given, ${String(required)} required`;
};

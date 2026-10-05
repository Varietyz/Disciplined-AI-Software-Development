import {
    CONCERNS,
    CONFIG_FLAG,
    FLAG_AND_VALUE,
    FLAG_PREFIX,
    INSTALL_CONCERN,
    REPORTERS,
    VALUE_FLAGS,
} from "#configuration/constants/concern.constants";
import type { CliArgs, Concern, Reporter } from "#types/quality.types";
import { missingFlagValue, unknownConcern, unknownFlag, unknownReporter } from "#configuration/strings/tool.strings";

const CONCERN_SET: ReadonlySet<string> = new Set(Object.keys(CONCERNS));
const LIST_SEPARATOR = ", ";

const BOOLEAN_FLAGS: ReadonlyMap<string, (args: CliArgs) => void> = new Map([
    [
        "--auto",
        (args: CliArgs): void => {
            args.auto = true;
        },
    ],
    [
        "--backup",
        (args: CliArgs): void => {
            args.backup = true;
        },
    ],
    [
        "--dry-run",
        (args: CliArgs): void => {
            args.dryRun = true;
        },
    ],
    [
        "--no-fix",
        (args: CliArgs): void => {
            args.fix = false;
        },
    ],
]);

const isConcern = function isConcern(value: string): value is Concern {
    return CONCERN_SET.has(value);
};

const isReporter = function isReporter(value: string): value is Reporter {
    return [...REPORTERS].some((reporter) => reporter === value);
};

const applyValueFlag = function applyValueFlag(args: CliArgs, flag: string, value: string | undefined): void {
    if (value === undefined || value.length === 0 || value.startsWith(FLAG_PREFIX)) {
        throw new Error(missingFlagValue(flag));
    }
    if (flag === CONFIG_FLAG) {
        args.config = value;
        return;
    }
    if (!isReporter(value)) {
        throw new Error(unknownReporter(value, [...REPORTERS].join(LIST_SEPARATOR)));
    }
    args.reporter = value;
};

const defaultArgs = function defaultArgs(concern: Concern): CliArgs {
    return {
        auto: false,
        backup: false,
        concern,
        config: null,
        dryRun: false,
        ecosystems: [],
        fix: true,
        paths: [],
        reporter: "human",
    };
};

const consumeToken = function consumeToken(
    args: CliArgs,
    rest: readonly string[],
    cursor: number,
): { next: number; positional: string | null } {
    const arg = rest[cursor] ?? "";
    if (VALUE_FLAGS.has(arg)) {
        applyValueFlag(args, arg, rest[cursor + 1]);
        return { next: cursor + FLAG_AND_VALUE, positional: null };
    }
    const setter = BOOLEAN_FLAGS.get(arg);
    if (setter) {
        setter(args);
        return { next: cursor + 1, positional: null };
    }
    if (arg.startsWith(FLAG_PREFIX)) {
        throw new Error(unknownFlag(arg));
    }
    return { next: cursor + 1, positional: arg };
};

export const parseCliArgs = function parseCliArgs(argv: readonly string[]): CliArgs {
    const [concern] = argv;
    if (typeof concern !== "string" || !isConcern(concern)) {
        throw new Error(unknownConcern(String(concern), [...CONCERN_SET].join(LIST_SEPARATOR)));
    }
    const args = defaultArgs(concern);
    const rest = argv.slice(1);
    const positional: string[] = [];
    for (let cursor = 0; cursor < rest.length;) {
        const step = consumeToken(args, rest, cursor);
        if (step.positional !== null) {
            positional.push(step.positional);
        }
        cursor = step.next;
    }
    if (concern === INSTALL_CONCERN) {
        args.ecosystems = positional;
    } else {
        args.paths = positional;
    }
    return args;
};

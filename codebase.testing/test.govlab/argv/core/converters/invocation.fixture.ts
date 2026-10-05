import type { ArgvSpec } from "@govlab/argv";

export const SPEC: ArgvSpec = {
    command: "npm run thing --",
    flags: [
        { describe: "a value", name: "--name", takesValue: true },
        { describe: "a switch", name: "--loud", takesValue: false },
        { describe: "many", name: "--tag", repeatable: true, takesValue: true },
    ],
    positionals: [{ describe: "the input", name: "input" }],
    summary: "Does a thing.",
};

export const FULL_WORDS: readonly string[] = ["in", "--name", "x", "--loud", "--tag", "a", "--tag", "b"];

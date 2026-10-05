export const VAULT_BINARY = "cerberus";

export const VAULT_FOLDER = "banes-lab.com";

export const VAULT_PATH_SEPARATOR = "/";

export const REVEAL_WORDS = ["field", "reveal"] as const;

export const SHOW_WORDS = ["entry", "show"] as const;

export const JSON_SWITCH = "--json";

export const VALUE_ANSWER = "value";

export const ENTRY_ANSWER = "entry";

export const DIGITS: ReadonlySet<string> = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

export const BLANKS: ReadonlySet<string> = new Set([" ", "\t", "\r", "\n"]);

export const SIXTEEN_BIT_CEILING = 0xFF_FF;

export const ENVIRONMENT_KIND_RULES = [
    { blankAllowed: false, kind: "port", locator: false, numeric: true },
    { blankAllowed: false, kind: "host", locator: false, numeric: false },
    { blankAllowed: false, kind: "url", locator: true, numeric: false },
    { blankAllowed: true, kind: "secret", locator: false, numeric: false },
    { blankAllowed: false, kind: "user", locator: false, numeric: false },
    { blankAllowed: false, kind: "path", locator: false, numeric: false },
] as const;

export const ENVIRONMENT_SCOPES = ["Runtime", "Tests"] as const;

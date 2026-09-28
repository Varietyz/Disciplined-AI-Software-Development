export const SENTENCE_CAP = 54;

export const JOIN_CAP = 1;

export const SENTENCE_TERMINALS: ReadonlySet<string> = new Set([".", "!", "?"]);

export const SENTENCE_WORD_STOPS: ReadonlySet<string> = new Set([
    " ",
    "\n",
    "\t",
    ",",
    ".",
    ";",
    ":",
    "!",
    "?",
    "(",
    ")",
    '"',
    "'",
    "—",
    "*",
    "`",
]);

export const COORDINATORS: ReadonlySet<string> = new Set(["and", "then", "or", "but"]);

export const PASSIVE_AUXILIARIES: ReadonlySet<string> = new Set(["is", "are", "was", "were", "be", "been", "being"]);

export const PASSIVE_ADVERB_SUFFIX = "ly";

export const PASSIVE_ADVERBS: ReadonlySet<string> = new Set(["not", "never", "also", "always", "already", "still"]);

export const PARTICIPLE_SUFFIX = "ed";

export const PARTICIPLE_MIN_LENGTH = 4;

export const NOT_PARTICIPLES: ReadonlySet<string> = new Set(["hundred", "indeed", "naked", "sacred", "wicked"]);

export const IRREGULAR_PARTICIPLES: ReadonlySet<string> = new Set([
    "begun",
    "bound",
    "broken",
    "brought",
    "built",
    "caught",
    "chosen",
    "done",
    "drawn",
    "driven",
    "found",
    "given",
    "held",
    "hidden",
    "kept",
    "known",
    "left",
    "lost",
    "made",
    "meant",
    "met",
    "paid",
    "read",
    "run",
    "said",
    "seen",
    "sent",
    "set",
    "shown",
    "split",
    "spoken",
    "spread",
    "taken",
    "taught",
    "thought",
    "thrown",
    "told",
    "torn",
    "understood",
    "written",
]);

export const AGENT_MARKER = "by";

export const NON_IMPERATIVE_OPENERS: ReadonlySet<string> = new Set([
    "a",
    "an",
    "the",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "there",
    "i",
    "we",
    "you",
    "he",
    "she",
    "they",
    "when",
    "if",
    "because",
    "while",
    "since",
]);

export const IMPERATIVE_OPENERS: ReadonlySet<string> = new Set([
    "add",
    "ask",
    "avoid",
    "check",
    "delete",
    "do",
    "fix",
    "give",
    "hold",
    "keep",
    "let",
    "make",
    "measure",
    "move",
    "name",
    "never",
    "prefer",
    "put",
    "read",
    "report",
    "run",
    "set",
    "split",
    "state",
    "treat",
    "use",
    "verify",
    "write",
]);

export const DETECTOR_KINDS = ["address", "bearer", "credential", "database", "jwt", "key", "ssh", "token"] as const;

export const EXCLUSION_REASONS = ["third-party-rule-text", "binary", "rendered-media", "backup"] as const;

export const DETECTOR_SUFFIX = ".predicate.ts";

export const TOKEN_SHAPES = [
    { alphabet: "alnum", minRest: 20, prefixes: ["sk-"] },
    { alphabet: "alnum", minRest: 36, prefixes: ["ghp_", "gho_", "ghs_", "ghu_", "ghr_"] },
    { alphabet: "alnumDash", minRest: 20, prefixes: ["glpat-"] },
    { alphabet: "alnumDash", minRest: 10, prefixes: ["xoxb-", "xoxp-", "xoxa-", "xoxs-"] },
    { alphabet: "upperDigit", minRest: 16, prefixes: ["AKIA", "ASIA"] },
] as const;

export const PEM_OPENING = "-----BEGIN";

export const PRIVATE_KEY_MARK = "PRIVATE KEY";

export const SSH_PREFIXES: readonly string[] = ["ssh-rsa ", "ssh-ed25519 ", "ssh-dss ", "ecdsa-sha2-nistp256 "];

export const SSH_MIN_BODY = 16;

export const DATABASE_SCHEMES: readonly string[] = [
    "mongodb://",
    "mongodb+srv://",
    "postgres://",
    "postgresql://",
    "mysql://",
    "redis://",
    "amqp://",
];

export const BEARER_PREFIX = "Bearer ";

export const BEARER_MIN_LENGTH = 20;

export const JWT_OPENING = "eyJ";

export const JWT_SEGMENTS = 3;

export const JWT_MIN_SEGMENT = 8;

export const JWT_SEPARATOR = ".";

export const SCHEME_MARK = "://";

export const AUTHORITY_ENDS: ReadonlySet<string> = new Set(["/", "?", "#"]);

export const CREDENTIAL_AT = "@";

export const CREDENTIAL_COLON = ":";

export const BASE64_URL_MARKS: ReadonlySet<string> = new Set(["-", "_"]);

export const DASH = "-";

export const LOCAL_ADDRESSES: ReadonlySet<string> = new Set(["::", "0.0.0.0", "::1"]);

export const LOOPBACK_V4_PREFIX = "127.";

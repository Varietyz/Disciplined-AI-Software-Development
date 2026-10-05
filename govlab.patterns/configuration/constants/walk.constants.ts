import type { StateRule } from "#types/walk.types";

export const HALF = 0.5;

export const HEX_CLASS = "hex";
export const HEX_STATE_PREFIX = "hex-";
export const HEX_FLAG_PREFIX = "hex-flagged-";
export const HEX_PATH_CLASS = "hex-path";
export const HEX_ARROW_CLASS = "hex-arrow";
export const HEX_WARN_CLASS = "hex-warn";
export const HEX_WARN_PREFIX = "hex-warn-";
export const HEX_WARN_TEXT_CLASS = "hex-warn-text";
export const HEX_EMPTY_CLASS = "hex-empty";
export const HEX_REF_ATTRIBUTE = "data-ref";

export const REF_RADIX = 36;

export const CELL_COLUMNS: readonly string[] = ["state", "depth", "label", "file", "line", "name", "text", "severity"];

export const STATE_READ = "read";
export const STATE_CALL = "call";
export const STATE_WRITE = "write";
export const STATE_DECLARE = "declare";
export const STATE_CONTROL = "control";
export const STATE_STRUCT = "structure";

export const STATE_RULES: readonly StateRule[] = [
    { state: STATE_CALL, tokens: ["call", "invocation", "new_expression"] },
    { state: STATE_WRITE, tokens: ["assignment", "augmented", "update_expression"] },
    { state: STATE_DECLARE, tokens: ["declaration", "definition", "declarator", "parameter"] },
    {
        state: STATE_CONTROL,
        tokens: ["if", "for", "while", "switch", "return", "try", "catch", "ternary", "conditional"],
    },
    { state: STATE_READ, tokens: ["identifier", "member", "property", "subscript", "attribute", "this"] },
];

export const MEANINGFUL_STATES: ReadonlySet<string> = new Set([STATE_DECLARE, STATE_CALL, STATE_WRITE, STATE_CONTROL]);

export const HARDEN_TOKENS: readonly string[] = ["href=", "xlink:", "url(", "onload=", "onclick=", "onerror="];

export const FORBIDDEN_MARKUP: readonly string[] = ["<script", "<iframe", "<foreignobject", ...HARDEN_TOKENS];

import { INLINE_KINDS, type Segment } from "../types/segment.types.ts";
import type { Reference } from "../types/reference.types.ts";

export const REFERENCE_FIELDS = ["see", "source", "detect"] as const;

const REFERENCE_INLINE_KINDS: ReadonlySet<string> = new Set(INLINE_KINDS);

const EXTERNAL_PREFIXES = ["http://", "https://", "mailto:", "#"];

const LOCAL_SCHEME = "local:";

const hasPrefix = function hasPrefix(text: string, prefix: string): boolean {
    if (prefix.length > text.length) {
        return false;
    }
    for (let i = 0; i < prefix.length; i += 1) {
        if (text[i] !== prefix[i]) {
            return false;
        }
    }
    return true;
};

const stripAnchor = function stripAnchor(value: string): string {
    const hash = value.indexOf("#");
    return hash === -1 ? value : value.slice(0, hash);
};

const stripLocator = function stripLocator(value: string): string {
    const colon = value.lastIndexOf(":");
    if (colon <= 0 || colon === value.length - 1) {
        return value;
    }

    for (let index = colon + 1; index < value.length; index += 1) {
        const char = value.charAt(index);
        const digit = char >= "0" && char <= "9";
        if (!digit && char !== "-") {
            return value;
        }
    }

    return value.slice(0, colon);
};

const unquote = function unquote(value: string): string {
    let start = 0;
    let end = value.length;
    while (start < end && value[start] === "`") {
        start += 1;
    }
    while (end > start && value[end - 1] === "`") {
        end -= 1;
    }
    return value.slice(start, end);
};

const firstToken = function firstToken(value: string): string {
    const space = value.indexOf(" ");
    return space === -1 ? value : value.slice(0, space);
};

const PLACEHOLDERS = ["<", ">", "*", "?"];

const isPattern = function isPattern(value: string): boolean {
    for (const character of PLACEHOLDERS) {
        if (value.includes(character)) {
            return true;
        }
    }
    return false;
};

const isExternal = function isExternal(value: string): boolean {
    for (const prefix of EXTERNAL_PREFIXES) {
        if (hasPrefix(value, prefix)) {
            return true;
        }
    }

    const colon = value.indexOf(":");
    const slash = value.indexOf("/");
    return colon !== -1 && (slash === -1 || colon < slash);
};

export const referencesIn = function referencesIn(segment: Segment): Reference[] {
    const out: Reference[] = [];

    const consider = (raw: string, locus: string): void => {
        let value = unquote(firstToken(raw));
        if (hasPrefix(value, LOCAL_SCHEME)) {
            value = value.slice(LOCAL_SCHEME.length);
        }
        if (value.length === 0 || isExternal(value)) {
            return;
        }
        if (hasPrefix(value, "@")) {
            value = value.slice(1);
        }

        const target = stripLocator(stripAnchor(value));
        if (target.length === 0) {
            return;
        }

        const slash = target.lastIndexOf("/");
        if (slash === -1) {
            return;
        }
        if (!target.slice(slash + 1).includes(".")) {
            return;
        }
        if (isPattern(target)) {
            return;
        }

        out.push({ line: segment.line, locus, raw, target });
    };

    const isField = segment.kind === "field" || segment.kind === "frontmatter-field";
    if (isField && segment.key !== undefined && segment.value !== undefined) {
        for (const key of REFERENCE_FIELDS) {
            if (segment.key === key) {
                consider(segment.value, `${key}:`);
            }
        }
    }

    for (const inline of segment.inlines) {
        if (REFERENCE_INLINE_KINDS.has(inline.kind)) {
            consider(inline.value, inline.kind);
        }
    }

    return out;
};

import {
    BODILESS_ALTERNATE,
    EMPTY_PAYLOAD,
    MALFORMED_PAYLOAD,
    inlineTag,
    unanchoredAlternate,
    untitledAlternate,
    wrongPayloadId,
    wrongPayloadTab,
} from "#configuration/strings/payload.strings";
import type { Finding } from "#types/validation.types";
import { isRecord } from "#core/selectors/base.selector";

const INLINE_TAG_OPEN = "<";
const INLINE_TAG_STOPS = new Set([">", " ", "/"]);
const INLINE_TAGS = new Set(["strong", "b", "em", "i", "code", "a", "span", "br"]);
const MIN_MARKDOWN_LINES = 5;

interface Payload {
    readonly content: unknown;
    readonly id: unknown;
    readonly tab?: unknown;
}

const tagAt = function tagAt(text: string, open: number): string {
    let end = open + 1;
    while (end < text.length && !INLINE_TAG_STOPS.has(text.charAt(end))) {
        end += 1;
    }
    return text.slice(open + 1, end).toLowerCase();
};

export const inlineMarkupIn = function inlineMarkupIn(value: unknown): string | null {
    if (typeof value === "string") {
        let open = value.indexOf(INLINE_TAG_OPEN);
        while (open !== -1) {
            const tag = tagAt(value, open);
            if (INLINE_TAGS.has(tag)) {
                return tag;
            }
            open = value.indexOf(INLINE_TAG_OPEN, open + 1);
        }
        return null;
    }
    if (typeof value === "object" && value !== null) {
        for (const entry of Object.values(value)) {
            const found = inlineMarkupIn(entry);
            if (found !== null) {
                return found;
            }
        }
    }
    return null;
};

const parsePayload = function parsePayload(raw: string): Payload | null {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !("content" in parsed) || !("id" in parsed)) {
        return null;
    }
    return { content: parsed["content"], id: parsed["id"], tab: parsed["tab"] };
};

const checkPayloadContent = function checkPayloadContent(file: string, content: unknown): Finding[] {
    if (content === undefined || content === null) {
        return [{ file, message: EMPTY_PAYLOAD }];
    }
    const markup = inlineMarkupIn(content);
    return markup === null ? [] : [{ file, message: inlineTag(markup) }];
};

export const checkPayload = function checkPayload(
    file: string,
    id: string,
    tab: string | null,
    raw: string,
): Finding[] {
    const payload = parsePayload(raw);
    if (payload === null) {
        return [{ file, message: MALFORMED_PAYLOAD }];
    }
    const findings: Finding[] = [];
    if (payload.id !== id) {
        findings.push({ file, message: wrongPayloadId(String(payload.id), id) });
    }
    if (payload.tab !== tab) {
        findings.push({ file, message: wrongPayloadTab(String(tab)) });
    }
    return [...findings, ...checkPayloadContent(file, payload.content)];
};

export const checkMarkdown = function checkMarkdown(
    file: string,
    text: string,
    title: string,
    address: string,
): Finding[] {
    const findings: Finding[] = [];
    if (!text.startsWith(`# ${title}`)) {
        findings.push({ file, message: untitledAlternate(title) });
    }
    if (!text.includes(address)) {
        findings.push({ file, message: unanchoredAlternate(address) });
    }
    if (text.trim().split("\n").length < MIN_MARKDOWN_LINES) {
        findings.push({ file, message: BODILESS_ALTERNATE });
    }
    return findings;
};

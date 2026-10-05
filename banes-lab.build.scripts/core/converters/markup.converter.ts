import type { Attribute, Tag } from "#types/markup.types";

const TAG_OPEN = "<";
const TAG_CLOSE = ">";
const ASSIGN = "=";
const SLASH = "/";
const SPACE = " ";
const ENTITY_OPEN = "&";
const ENTITY_CLOSE = ";";
const QUOTES = new Set(['"', "'"]);
const WHITESPACE = new Set([" ", "\n", "\t", "\r"]);
const ENTITIES: ReadonlyMap<string, string> = new Map([
    ["&amp;", "&"],
    ["&apos;", "'"],
    ["&gt;", ">"],
    ["&lt;", "<"],
    ["&quot;", '"'],
]);

interface Token {
    readonly attribute: Attribute | null;
    readonly next: number;
    readonly selfClosing: boolean;
}

export const decodeEntities = function decodeEntities(text: string): string {
    let out = "";
    let at = 0;
    while (at < text.length) {
        const open = text.indexOf(ENTITY_OPEN, at);
        if (open === -1) {
            return out + text.slice(at);
        }
        const close = text.indexOf(ENTITY_CLOSE, open);
        const decoded = close === -1 ? undefined : ENTITIES.get(text.slice(open, close + 1));
        out += decoded === undefined ? text.slice(at, open + 1) : text.slice(at, open) + decoded;
        at = decoded === undefined ? open + 1 : close + 1;
    }
    return out;
};

export const nextQuote = function nextQuote(quote: string, char: string): string {
    if (quote !== "") {
        return char === quote ? "" : quote;
    }
    return QUOTES.has(char) ? char : "";
};

export const tagEnd = function tagEnd(markup: string, from: number): number {
    let quote = "";
    for (let at = from; at < markup.length; at += 1) {
        const char = markup.charAt(at);
        quote = nextQuote(quote, char);
        if (quote === "" && char === TAG_CLOSE) {
            return at;
        }
    }
    return -1;
};

const readWhile = function readWhile(text: string, from: number, admits: (char: string) => boolean): number {
    let at = from;
    while (at < text.length && admits(text.charAt(at))) {
        at += 1;
    }
    return at;
};

const isSpace = function isSpace(char: string): boolean {
    return WHITESPACE.has(char);
};

const isNameChar = function isNameChar(char: string): boolean {
    return !WHITESPACE.has(char) && char !== ASSIGN && char !== SLASH;
};

const readAttribute = function readAttribute(content: string, from: number): Token {
    const nameEnd = readWhile(content, from, isNameChar);
    const name = content.slice(from, nameEnd);
    let at = readWhile(content, nameEnd, isSpace);
    if (content.charAt(at) !== ASSIGN) {
        return { attribute: { name, quote: "", value: null }, next: nameEnd, selfClosing: false };
    }
    at = readWhile(content, at + 1, isSpace);
    const quote = content.charAt(at);
    if (!QUOTES.has(quote)) {
        const bareEnd = readWhile(content, at, isNameChar);
        return {
            attribute: { name, quote: '"', value: content.slice(at, bareEnd) },
            next: bareEnd,
            selfClosing: false,
        };
    }
    const valueEnd = content.indexOf(quote, at + 1);
    const end = valueEnd === -1 ? content.length : valueEnd;
    return { attribute: { name, quote, value: content.slice(at + 1, end) }, next: end + 1, selfClosing: false };
};

const readToken = function readToken(content: string, at: number): Token {
    if (at >= content.length) {
        return { attribute: null, next: at, selfClosing: false };
    }
    if (content.charAt(at) === SLASH) {
        return { attribute: null, next: at + 1, selfClosing: true };
    }
    return readAttribute(content, at);
};

export const parseTag = function parseTag(content: string): Tag {
    const nameEnd = readWhile(content, 0, isNameChar);
    const name = content.slice(0, nameEnd);
    const attributes: Attribute[] = [];
    let selfClosing = false;
    let at = nameEnd;
    while (at < content.length) {
        const token = readToken(content, readWhile(content, at, isSpace));
        selfClosing ||= token.selfClosing;
        if (token.attribute !== null) {
            attributes.push(token.attribute);
        }
        at = token.next;
    }
    return { attributes, name, selfClosing };
};

export const serializeTag = function serializeTag(tag: Tag): string {
    const attributes = tag.attributes.map((attribute) =>
        attribute.value === null
            ? SPACE + attribute.name
            : SPACE + attribute.name + ASSIGN + attribute.quote + attribute.value + attribute.quote,
    );
    return TAG_OPEN + tag.name + attributes.join("") + (tag.selfClosing ? SLASH : "") + TAG_CLOSE;
};

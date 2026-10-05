import {
    CONTRACT_FRESHNESS,
    CONTRACT_INPUT,
    CONTRACT_TRANSFORM,
    EM_DASH,
    HEAD_TOKEN_MIN,
    INVARIANT_BLOCK_HEAD,
    NODE_HEAD,
    NODE_TAG_SLOTS,
    REPAIR_EDGE_HEAD,
    RETIRED_UNIT_HEADS,
    TAG_CLOSE,
    TAG_CUE,
    TAG_GENESIS,
    TAG_OPEN,
    TAG_PURPOSE,
    TAG_SEPARATOR,
    TAG_YIELDS,
} from "#configuration/constants/grammar.constants";
import type { PagNode, PagNodeField, PagNodeFieldValue, PagNodeTag, ParsedHeader } from "#types/grammar.document.types";
import { valueAfter } from "#core/converters/text.converter";

const COMMENT: ParsedHeader = { head: "", kind: "comment", number: null, tag: null, title: "" };
const WORD_SEPARATOR = " ";
const COLON = ":";

const slotsOf = function slotsOf(inner: string): string[] {
    return inner
        .split(TAG_SEPARATOR)
        .map((slot) => slot.trim())
        .filter((slot) => slot !== "");
};

export const parseTag = function parseTag(text: string): PagNodeTag | null {
    const open = text.indexOf(TAG_OPEN);
    const close = text.lastIndexOf(TAG_CLOSE);
    if (open === -1 || close === -1 || close < open) {
        return null;
    }
    const slots = slotsOf(text.slice(open + 1, close));
    const yields = slots[NODE_TAG_SLOTS - 1] ?? "";
    if (slots.length !== NODE_TAG_SLOTS || !yields.startsWith(TAG_YIELDS)) {
        return null;
    }
    return {
        axis: slots[1] ?? "",
        layer: slots[0] ?? "",
        mathType: slots[2] ?? "",
        yields: valueAfter(yields, TAG_YIELDS),
    };
};

const titleOf = function titleOf(afterHead: string): string {
    const dash = afterHead.indexOf(EM_DASH);
    const body = dash === -1 ? afterHead : afterHead.slice(dash + EM_DASH.length);
    const open = body.indexOf(TAG_OPEN);
    return (open === -1 ? body : body.slice(0, open)).trim();
};

const parseNodeHeader = function parseNodeHeader(afterHash: string, tokens: string[]): ParsedHeader {
    const second = tokens[1] ?? "";
    const number = second === "" || second === EM_DASH ? null : second;
    const afterHead = afterHash.slice(NODE_HEAD.length + 1 + (number ?? "").length);
    return { head: NODE_HEAD, kind: "node", number, tag: parseTag(afterHash), title: titleOf(afterHead) };
};

const parseRetiredHeader = function parseRetiredHeader(afterHash: string, tokens: string[]): ParsedHeader {
    const colon = afterHash.indexOf(COLON);
    const rawNumber = tokens[1] ?? "";
    return {
        head: tokens[0] ?? "",
        kind: "retired-unit",
        number: rawNumber === "" ? null : (rawNumber.split(COLON)[0] ?? null),
        tag: null,
        title: colon === -1 ? afterHash.trim() : afterHash.slice(colon + 1).trim(),
    };
};

export const parseHeader = function parseHeader(afterHash: string): ParsedHeader {
    const trimmed = afterHash.trim();
    if (trimmed.startsWith(INVARIANT_BLOCK_HEAD)) {
        return { ...COMMENT, head: INVARIANT_BLOCK_HEAD, kind: "invariants" };
    }
    if (trimmed.startsWith(REPAIR_EDGE_HEAD)) {
        return { ...COMMENT, head: REPAIR_EDGE_HEAD, kind: "repair" };
    }
    const tokens = trimmed.split(WORD_SEPARATOR).filter(Boolean);
    const head = tokens[0] ?? "";
    if (tokens.length < HEAD_TOKEN_MIN) {
        return COMMENT;
    }
    if (head === NODE_HEAD) {
        return parseNodeHeader(trimmed, tokens);
    }
    return RETIRED_UNIT_HEADS.has(head) ? parseRetiredHeader(trimmed, tokens) : COMMENT;
};

const NODE_FIELDS: readonly [string, PagNodeField][] = [
    [TAG_PURPOSE, "purpose"],
    [TAG_CUE, "cue"],
    [TAG_GENESIS, "genesis"],
    [CONTRACT_INPUT, "input"],
    [CONTRACT_TRANSFORM, "transform"],
    [CONTRACT_FRESHNESS, "freshness"],
];

export const nodeFieldOf = function nodeFieldOf(trimmed: string): PagNodeFieldValue | null {
    const entry = NODE_FIELDS.find(([prefix]) => trimmed.startsWith(prefix));
    return entry === undefined ? null : { field: entry[1], value: valueAfter(trimmed, entry[0]) };
};

export const nodeOf = function nodeOf(header: ParsedHeader, raw: string, line: number): PagNode {
    return {
        cue: null,
        directives: [],
        freshness: null,
        gate: null,
        genesis: null,
        head: header.head,
        header: raw,
        input: null,
        line,
        number: header.number,
        purpose: null,
        tag: header.tag,
        title: header.title,
        transform: null,
    };
};

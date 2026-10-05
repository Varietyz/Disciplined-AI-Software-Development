import {
    ARRAY_CLOSE,
    COMMENT,
    FIELD_BOUNDARIES,
    FIELD_KINDS_ANYWHERE,
    FIELD_KINDS_BY_ARRAY,
    FIELD_OPEN,
    HEADER_KINDS,
    HEADER_OPEN,
    HEADER_SEPARATOR,
    LIST_KINDS_BY_ARRAY,
    MATH_JOINER,
    MATH_PLUS,
    MATH_TYPE_KIND,
    NODE_HEADER,
    PLACEHOLDER_MARKS,
    QUOTE,
    ROW_DASH,
    SET_ASSIGN,
    SET_OPEN,
    SPINE_COLUMNS,
    SPINE_HEAD,
} from "#configuration/constants/template.constants";
import type { TemplateRef } from "#types/grammar.types";

type KindMembers = ReadonlyMap<string, ReadonlySet<string>>;

interface SpineIndexes {
    readonly axis: number;
    readonly layer: number;
    readonly mathType: number;
}

interface ScanState {
    readonly array: string | null;
    readonly spine: SpineIndexes | null;
}

interface LineScan {
    readonly refs: TemplateRef[];
    readonly state: ScanState;
}

const LINE_FEED = "\n";
const WORD_SEPARATOR = " ";

const isPlaceholder = function isPlaceholder(value: string): boolean {
    return PLACEHOLDER_MARKS.some((mark) => value.includes(mark));
};

const quotedStrings = function quotedStrings(text: string): string[] {
    const values: string[] = [];
    let open = text.indexOf(QUOTE);
    while (open !== -1) {
        const close = text.indexOf(QUOTE, open + 1);
        if (close === -1) {
            break;
        }
        values.push(text.slice(open + 1, close));
        open = text.indexOf(QUOTE, close + 1);
    }
    return values;
};

const fieldValues = function fieldValues(text: string, field: string): string[] {
    const marker = `${field}${FIELD_OPEN}`;
    const values: string[] = [];
    let at = text.indexOf(marker);
    while (at !== -1) {
        const start = at + marker.length;
        const end = text.indexOf(QUOTE, start);
        if (end === -1) {
            break;
        }
        if (at === 0 || FIELD_BOUNDARIES.has(text.charAt(at - 1))) {
            values.push(text.slice(start, end));
        }
        at = text.indexOf(marker, end + 1);
    }
    return values;
};

const tokensOf = function tokensOf(text: string): string[] {
    return text.split(WORD_SEPARATOR).filter((token) => token.length > 0);
};

const headerRefs = function headerRefs(trimmed: string, line: number): TemplateRef[] {
    const open = trimmed.indexOf(HEADER_OPEN);
    const close = trimmed.lastIndexOf(ARRAY_CLOSE);
    if (open === -1 || close <= open) {
        return [];
    }
    const [layer, axis, math] = trimmed.slice(open + 1, close).split(HEADER_SEPARATOR);
    if (layer === undefined || axis === undefined || math === undefined) {
        return [];
    }
    const [layerKind, axisKind, mathKind] = HEADER_KINDS;
    return [
        { id: layer.trim(), kind: layerKind, line },
        { id: axis.trim(), kind: axisKind, line },
        ...math.split(MATH_JOINER).map((part) => ({ id: part.trim(), kind: mathKind, line })),
    ];
};

const spineIndexes = function spineIndexes(trimmed: string): SpineIndexes | null {
    const columns = tokensOf(trimmed.slice(COMMENT.length));
    const [layer = -1, axis = -1, mathType = -1] = SPINE_COLUMNS.map((name) => columns.indexOf(name));
    return [layer, axis, mathType].includes(-1) ? null : { axis, layer, mathType };
};

const spineRefs = function spineRefs(trimmed: string, spine: SpineIndexes, line: number): TemplateRef[] {
    const tokens = tokensOf(trimmed.slice(COMMENT.length));
    const layer = tokens[spine.layer];
    const axis = tokens[spine.axis];
    const math = tokens[spine.mathType];
    if (layer === undefined || axis === undefined || math === undefined) {
        return [];
    }
    const second = tokens[spine.mathType + 1] === MATH_PLUS ? tokens[spine.mathType + 2] : undefined;
    return [
        { id: layer, kind: "layer", line },
        { id: axis, kind: "axis", line },
        ...[math, ...(second === undefined ? [] : [second])].map((id) => ({ id, kind: MATH_TYPE_KIND, line })),
    ];
};

const isSeparatorRow = function isSeparatorRow(trimmed: string): boolean {
    return tokensOf(trimmed.slice(COMMENT.length)).every((cell) => cell.replaceAll(ROW_DASH, "").length === 0);
};

const arrayNameOf = function arrayNameOf(trimmed: string): string | null {
    const assign = trimmed.indexOf(SET_ASSIGN);
    return trimmed.startsWith(SET_OPEN) && assign !== -1 ? trimmed.slice(SET_OPEN.length, assign) : null;
};

const fieldRefs = function fieldRefs(text: string, fields: ReadonlyMap<string, string>, line: number): TemplateRef[] {
    return [...fields].flatMap(([field, kind]) => fieldValues(text, field).map((id) => ({ id, kind, line })));
};

const arrayRefs = function arrayRefs(trimmed: string, array: string | null, line: number): TemplateRef[] {
    const listKind = array === null ? undefined : LIST_KINDS_BY_ARRAY.get(array);
    const assign = trimmed.indexOf(SET_ASSIGN);
    const listText = assign === -1 ? trimmed : trimmed.slice(assign);
    const listed = listKind === undefined ? [] : quotedStrings(listText).map((id) => ({ id, kind: listKind, line }));
    const fields = array === null ? undefined : FIELD_KINDS_BY_ARRAY.get(array);
    return [
        ...listed,
        ...(fields === undefined ? [] : fieldRefs(trimmed, fields, line)),
        ...fieldRefs(trimmed, FIELD_KINDS_ANYWHERE, line),
    ];
};

const spineScan = function spineScan(trimmed: string, state: ScanState, line: number): LineScan | null {
    const opened = trimmed.startsWith(SPINE_HEAD) ? spineIndexes(trimmed) : null;
    if (opened !== null) {
        return { refs: [], state: { ...state, spine: opened } };
    }
    if (state.spine === null) {
        return null;
    }
    if (!trimmed.startsWith(COMMENT) || trimmed === COMMENT) {
        return null;
    }
    return { refs: isSeparatorRow(trimmed) ? [] : spineRefs(trimmed, state.spine, line), state };
};

const scanLine = function scanLine(trimmed: string, state: ScanState, line: number): LineScan {
    const spine = spineScan(trimmed, state, line);
    if (spine !== null) {
        return spine;
    }
    const open = { ...state, spine: null };
    if (trimmed.startsWith(NODE_HEADER)) {
        return { refs: headerRefs(trimmed, line), state: open };
    }
    const opened = arrayNameOf(trimmed);
    const array = opened ?? open.array;
    const closes = trimmed.startsWith(ARRAY_CLOSE) || (opened !== null && trimmed.endsWith(ARRAY_CLOSE));
    return { refs: arrayRefs(trimmed, array, line), state: { array: closes ? null : array, spine: null } };
};

export const templateRefsOf = function templateRefsOf(text: string): TemplateRef[] {
    let state: ScanState = { array: null, spine: null };
    const refs: TemplateRef[] = [];
    for (const [index, raw] of text.split(LINE_FEED).entries()) {
        const scan = scanLine(raw.trim(), state, index + 1);
        refs.push(...scan.refs);
        ({ state } = scan);
    }
    return refs.filter((ref) => ref.id.length > 0 && !isPlaceholder(ref.id));
};

export const unresolvedTemplateRefsOf = function unresolvedTemplateRefsOf(
    text: string,
    members: KindMembers,
): TemplateRef[] {
    return templateRefsOf(text).filter((ref) => !(members.get(ref.kind)?.has(ref.id) ?? false));
};

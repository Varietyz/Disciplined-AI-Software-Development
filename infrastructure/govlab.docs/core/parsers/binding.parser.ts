import type { BracedSpan, SlotRef } from "#types/reference.types";
import { splitLines } from "#core/parsers/markdown.parser";

const OPEN = "{";
const CLOSE = "}";
const TICK = "`";
const SEGMENT = ".";
const SLOT_CHARS: ReadonlySet<string> = new Set("abcdefghijklmnopqrstuvwxyz0123456789_-.");

const isSlotName = function isSlotName(inner: string): boolean {
    if (inner.length === 0) {
        return false;
    }
    for (const char of inner) {
        if (!SLOT_CHARS.has(char)) {
            return false;
        }
    }
    return true;
};

const rootOf = function rootOf(slot: string): string {
    const dot = slot.indexOf(SEGMENT);
    return dot === -1 ? slot : slot.slice(0, dot);
};

const bracesIn = function bracesIn(line: string): BracedSpan[] {
    const found: BracedSpan[] = [];
    let from = 0;
    while (from < line.length) {
        const open = line.indexOf(OPEN, from);
        const close = open === -1 ? -1 : line.indexOf(CLOSE, open + 1);
        if (close === -1) {
            return found;
        }
        found.push({ col: open + 1, inner: line.slice(open + 1, close) });
        from = open + 1;
    }
    return found;
};

const isTicked = function isTicked(line: string, span: BracedSpan): boolean {
    return line.charAt(span.col - 2) === TICK && line.charAt(span.col + span.inner.length + 1) === TICK;
};

export const declaredSlotsOf = function declaredSlotsOf(adapterSource: string): ReadonlySet<string> {
    const declared = new Set<string>();
    for (const line of splitLines(adapterSource)) {
        for (const span of bracesIn(line)) {
            if (isTicked(line, span) && isSlotName(span.inner)) {
                declared.add(span.inner);
            }
        }
    }
    return declared;
};

export const slotFamiliesOf = function slotFamiliesOf(declared: ReadonlySet<string>): ReadonlySet<string> {
    return new Set([...declared].map(rootOf));
};

const isFamilySlot = function isFamilySlot(inner: string, families: ReadonlySet<string>): boolean {
    return isSlotName(inner) && families.has(rootOf(inner));
};

const slotsInLine = function slotsInLine(line: string, lineNo: number, families: ReadonlySet<string>): SlotRef[] {
    return bracesIn(line).flatMap((span) =>
        isFamilySlot(span.inner, families) ? [{ col: span.col, line: lineNo, slot: span.inner }] : [],
    );
};

export const slotRefs = function slotRefs(source: string, families: ReadonlySet<string>): SlotRef[] {
    return splitLines(source).flatMap((line, index) => slotsInLine(line, index + 1, families));
};

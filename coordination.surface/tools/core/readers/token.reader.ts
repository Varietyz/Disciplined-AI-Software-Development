import type { Inline, InlineKind } from "../types/segment.types.ts";

interface LineContext {
    readonly line: string;
    readonly start: number;
    readonly number: number;
}

interface Step {
    readonly inlines: readonly Inline[];
    readonly next: number;
}

const IMPORT_STOPS = new Set([" ", "`", ")"]);

const inlineOf = function inlineOf(context: LineContext, kind: InlineKind, from: number, to: number): Inline {
    return {
        end: context.start + to,
        kind,
        line: context.number,
        start: context.start + from,
        value: context.line.slice(from, to),
    };
};

const enclosedStep = function enclosedStep(
    context: LineContext,
    at: number,
    width: number,
    closer: string,
    kind: InlineKind,
): Step {
    const close = context.line.indexOf(closer, at + width);
    if (close === -1) {
        return { inlines: [], next: at + 1 };
    }
    const inline = inlineOf(context, kind, at + width, close);
    return { inlines: inline.value.length > 0 ? [inline] : [], next: close + 1 };
};

const importStep = function importStep(context: LineContext, at: number): Step {
    let cursor = at + 1;
    while (cursor < context.line.length && !IMPORT_STOPS.has(context.line.charAt(cursor))) {
        cursor += 1;
    }
    const inline = inlineOf(context, "import-path", at + 1, cursor);
    return { inlines: inline.value.includes("/") ? [inline] : [], next: cursor };
};

const stepAt = function stepAt(context: LineContext, at: number): Step {
    const char = context.line.charAt(at);
    if (char === "`") {
        return enclosedStep(context, at, 1, "`", "inline-code");
    }
    if (char === "]" && context.line.charAt(at + 1) === "(") {
        return enclosedStep(context, at, 2, ")", "link-target");
    }
    const opensImport = char === "@" && (at === 0 || context.line.charAt(at - 1) === " ");
    return opensImport ? importStep(context, at) : { inlines: [], next: at + 1 };
};

export const inlinesOf = function inlinesOf(line: string, lineStart: number, lineNumber: number): Inline[] {
    const context: LineContext = { line, number: lineNumber, start: lineStart };
    const out: Inline[] = [];
    let index = 0;

    while (index < line.length) {
        const step = stepAt(context, index);
        out.push(...step.inlines);
        index = step.next;
    }

    return out;
};

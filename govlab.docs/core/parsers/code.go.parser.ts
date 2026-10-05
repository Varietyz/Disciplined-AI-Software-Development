import {
    FUNC,
    isIdentPart,
    isIdentStart,
    lastIdent,
    skipBalanced,
    skipIdent,
    skipIdentBack,
    skipSpaces,
    skipSpacesBack,
} from "#core/lexers/code.go.lexer";
import { GO_BUILTINS, GO_KEYWORDS } from "#configuration/constants/code.go.constants";
import type { GoCall, GoCallHit, GoCallScan, GoFuncHit, GoReceiver, ParsedFunc } from "#types/code.types";

const PARENS = "()";
const BRACES = "{}";
const OPEN_PAREN = "(";
const OPEN_BRACE = "{";
const CLOSE_BRACE = "}";
const DOT = ".";
const FUNC_HEAD = "f";

const receiverAt = function receiverAt(src: string, at: number, bound: number): GoReceiver {
    if (src[at] !== OPEN_PAREN) {
        return { next: at, receiver: null };
    }
    const close = skipBalanced(src, at, PARENS);
    return { next: skipSpaces(src, close, bound), receiver: lastIdent(src.slice(at + 1, close - 1)) };
};

const signatureEnd = function signatureEnd(src: string, at: number, bound: number): number {
    let position = src[at] === OPEN_PAREN ? skipBalanced(src, at, PARENS) : at;
    while (position < bound && src[position] !== OPEN_BRACE && src[position] !== CLOSE_BRACE) {
        position = src[position] === OPEN_PAREN ? skipBalanced(src, position, PARENS) : position + 1;
    }
    return position;
};

const isFuncKeyword = function isFuncKeyword(src: string, at: number): boolean {
    return src.startsWith(FUNC, at) && !isIdentPart(src[at - 1]) && !isIdentPart(src[at + FUNC.length]);
};

const funcFrom = function funcFrom(
    src: string,
    receiver: GoReceiver & { sigPos: number },
    bound: number,
): GoFuncHit | null {
    const nameEnd = skipIdent(src, receiver.next, bound);
    const bodyStart = signatureEnd(src, skipSpaces(src, nameEnd, bound), bound);
    if (src[bodyStart] !== OPEN_BRACE) {
        return null;
    }
    const bodyEnd = skipBalanced(src, bodyStart, BRACES);
    return {
        func: {
            bodyEnd: bodyEnd - 1,
            bodyStart: bodyStart + 1,
            name: src.slice(receiver.next, nameEnd),
            receiver: receiver.receiver,
            sigPos: receiver.sigPos,
        },
        next: bodyEnd,
    };
};

const funcAt = function funcAt(src: string, at: number, bound: number): GoFuncHit | null {
    if (!isFuncKeyword(src, at)) {
        return null;
    }
    const receiver = receiverAt(src, skipSpaces(src, at + FUNC.length, bound), bound);
    return isIdentStart(src[receiver.next]) ? funcFrom(src, { ...receiver, sigPos: at }, bound) : null;
};

export const parseFuncs = function parseFuncs(src: string): ParsedFunc[] {
    const funcs: ParsedFunc[] = [];
    let at = 0;
    while (at < src.length) {
        const hit = src[at] === FUNC_HEAD ? funcAt(src, at, src.length) : null;
        if (hit === null) {
            at += 1;
        } else {
            funcs.push(hit.func);
            at = hit.next;
        }
    }
    return funcs;
};

const qualifierBefore = function qualifierBefore(src: string, at: number, start: number): string | null {
    const dot = skipSpacesBack(src, at - 1, start);
    if (src[dot] !== DOT) {
        return null;
    }
    const qualifierEnd = skipSpacesBack(src, dot - 1, start);
    const identStart = skipIdentBack(src, qualifierEnd, start);
    const qualifier = src.slice(identStart + 1, qualifierEnd + 1);
    return qualifier === "" ? null : qualifier;
};

const isCallName = function isCallName(src: string, next: number, end: number, name: string): boolean {
    return src[skipSpaces(src, next, end)] === OPEN_PAREN && !GO_KEYWORDS.has(name) && !GO_BUILTINS.has(name);
};

const callAt = function callAt(scan: GoCallScan, at: number): GoCallHit {
    const { src, start, end } = scan;
    const next = skipIdent(src, at, end);
    const name = src.slice(at, next);
    return {
        call: isCallName(src, next, end, name) ? { name, qualifier: qualifierBefore(src, at, start) } : null,
        next,
    };
};

const stepCalls = function stepCalls(scan: GoCallScan, at: number): GoCallHit {
    if (!isIdentStart(scan.src[at]) || isIdentPart(scan.src[at - 1])) {
        return { call: null, next: at + 1 };
    }
    return callAt(scan, at);
};

export const callsIn = function callsIn(src: string, start: number, end: number): GoCall[] {
    const scan: GoCallScan = { end, src, start };
    const calls: GoCall[] = [];
    let at = start;
    while (at < end) {
        const step = stepCalls(scan, at);
        if (step.call !== null) {
            calls.push(step.call);
        }
        at = step.next;
    }
    return calls;
};

import { ROLE_DEFINITION, ROLE_NODE, roleOf } from "#core/classifiers/syntax.classifier";
import { childNodes, lineOf } from "#core/selectors/syntax.selector";
import type { CstNode } from "@govlab/code-parse";
import { MODULE_SCOPE } from "#configuration/constants/report.constants";
const SNIPPET_MAX = 76;
const HIGH_SURROGATE_MIN = 0xD8_00;
const HIGH_SURROGATE_MAX = 0xDB_FF;
const LINE_BREAK = "\n";

interface WalkContext {
    depth: number;
    language: string;
    caller: string;
}

interface WalkFrame {
    context: WalkContext;
    node: CstNode;
}

const snippetOf = function snippetOf(node: CstNode): string {
    const raw = node.text ?? "";
    const firstLine = raw.split(LINE_BREAK)[0] ?? raw;
    const clipped = firstLine.trim().slice(0, SNIPPET_MAX);
    const lastCode = clipped.codePointAt(clipped.length - 1) ?? 0;
    return lastCode >= HIGH_SURROGATE_MIN && lastCode <= HIGH_SURROGATE_MAX ? clipped.slice(0, -1) : clipped;
};

const recordFor = function recordFor(node: CstNode, context: WalkContext, role: string): Record<string, unknown> {
    const childTypes = childNodes(node)
        .filter((child) => child.isNamed)
        .map((child) => child.type);
    return {
        caller: context.caller,
        childCount: childTypes.length,
        childTypes,
        depth: context.depth,
        language: context.language,
        line: lineOf(node),
        nodeType: node.type,
        role,
        text: snippetOf(node),
    };
};

const contextBelow = function contextBelow(node: CstNode, context: WalkContext, role: string): WalkContext {
    return {
        caller: node.isNamed && role === ROLE_DEFINITION ? node.type : context.caller,
        depth: node.isNamed ? context.depth + 1 : context.depth,
        language: context.language,
    };
};

export const codeRecords = function codeRecords(root: CstNode, language: string): Record<string, unknown>[] {
    const out: Record<string, unknown>[] = [];
    const stack: WalkFrame[] = [{ context: { caller: MODULE_SCOPE, depth: 0, language }, node: root }];
    let frame = stack.pop();
    while (frame !== undefined) {
        const { context, node } = frame;
        const role = node.isNamed ? roleOf(node.type) : ROLE_NODE;
        if (node.isNamed) {
            out.push(recordFor(node, context, role));
        }
        const below = contextBelow(node, context, role);
        stack.push(
            ...childNodes(node)
                .toReversed()
                .map((child) => ({ context: below, node: child })),
        );
        frame = stack.pop();
    }
    return out;
};

import type { NodeHandler, NodeHandlers, RuleListener, RuleNode } from "../../types/rule.types.ts";
import { asNode } from "../selectors/syntax.selector.ts";

const nodeTypeOf = function nodeTypeOf(handler: string): string {
    const head = handler.slice(0, 1).toUpperCase();
    return head + handler.slice(1);
};

const bind = function bind(handler: NodeHandler): (raw: RuleNode) => void {
    return function visit(raw: RuleNode): void {
        const view = asNode(raw);
        if (view !== null) {
            handler(view, raw);
        }
    };
};

export const listener = function listener(handlers: NodeHandlers, onProgramExit?: NodeHandler): RuleListener {
    const visitors: Record<string, (raw: RuleNode) => void> = {};
    for (const [handler, fn] of Object.entries(handlers)) {
        visitors[nodeTypeOf(handler)] = bind(fn);
    }
    if (onProgramExit !== undefined) {
        visitors["Program:exit"] = bind(onProgramExit);
    }
    const empty: RuleListener = {};
    return Object.assign(empty, visitors);
};

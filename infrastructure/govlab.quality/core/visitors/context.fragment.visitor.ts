import type { AstNode } from "#types/context.types";
import { isNode } from "#core/predicates/context.fragment.predicate";

const walkChildren = function walkChildren(
    value: unknown,
    visit: (n: AstNode) => void,
    recurse: (node: AstNode, visit: (n: AstNode) => void) => void,
): void {
    const items = Array.isArray(value) ? value : [value];
    for (const item of items) {
        if (isNode(item)) {
            recurse(item, visit);
        }
    }
};

export const walk = function walk(node: AstNode, visit: (n: AstNode) => void): void {
    visit(node);
    for (const key of Object.keys(node)) {
        if (key !== "parent") {
            walkChildren(node[key], visit, walk);
        }
    }
};

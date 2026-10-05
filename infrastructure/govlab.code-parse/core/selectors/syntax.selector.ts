import type { CstNode } from "#types/syntax.types";
import { isCommentType } from "#core/predicates/syntax.predicate";

const childrenOf = function childrenOf(node: CstNode): CstNode[] {
    const children: CstNode[] = [];
    for (let index = node.childCount - 1; index >= 0; index -= 1) {
        const child = node.child(index);
        if (child !== null) {
            children.push(child);
        }
    }
    return children;
};

export const walk = function walk(root: CstNode, visit: (node: CstNode) => void): void {
    const stack: CstNode[] = [root];
    while (stack.length > 0) {
        const node = stack.pop();
        if (node) {
            visit(node);
            stack.push(...childrenOf(node));
        }
    }
};

export const commentNodes = function commentNodes(root: CstNode): CstNode[] {
    const found: CstNode[] = [];
    walk(root, (node) => {
        if (isCommentType(node.type)) {
            found.push(node);
        }
    });
    return found;
};

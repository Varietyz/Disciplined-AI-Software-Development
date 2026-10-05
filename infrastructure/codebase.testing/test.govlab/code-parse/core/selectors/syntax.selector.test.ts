import { commentNodes, isCommentType, walk } from "@govlab/code-parse";
import { describe, expect, it } from "vitest";
import { COMMENT_NODE_TYPES } from "@govlab/code-parse/configuration/constants/syntax.constants.ts";
import type { RawNode } from "@govlab/code-parse/types/syntax.types.ts";
import { adaptNode } from "@govlab/code-parse/core/adapters/syntax.adapter.ts";

const leaf = function leaf(type: string, startIndex: number): RawNode {
    return { child: () => null, childCount: 0, endIndex: startIndex + 1, isNamed: true, startIndex, type };
};

const TREE: RawNode = {
    child: (index) => [leaf("comment", 0), leaf("identifier", 1)].at(index) ?? null,
    childCount: 2,
    endIndex: 2,
    fieldNameForChild: (index) => (index === 1 ? "name" : null),
    isNamed: () => true,
    startIndex: 0,
    type: "program",
};

describe("adaptNode", () => {
    it("copies the tree into plain nodes with named fields", () => {
        const root = adaptNode(TREE);
        expect(root.isNamed).toBe(true);
        expect(root.child(1)?.type).toBe("identifier");
        expect(root.child(5)).toBeNull();
        expect(root.childForFieldName?.("name")?.type).toBe("identifier");
        expect(root.startPosition).toStrictEqual({ column: 0, row: 0 });
    });
});

describe("walk and commentNodes", () => {
    it("visit every node in document order and keep only the comment kinds", () => {
        const root = adaptNode(TREE);
        const seen: string[] = [];
        walk(root, (node) => {
            seen.push(node.type);
        });
        expect(seen).toStrictEqual(["program", "comment", "identifier"]);
        expect(commentNodes(root).map((node) => node.type)).toStrictEqual(["comment"]);
    });
});

describe("isCommentType", () => {
    it("accepts every declared comment kind and nothing else", () => {
        expect([...COMMENT_NODE_TYPES].every(isCommentType)).toBe(true);
        expect(isCommentType("function_declaration")).toBe(false);
    });
});

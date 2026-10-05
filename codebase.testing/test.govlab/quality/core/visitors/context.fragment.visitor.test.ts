import assert from "node:assert/strict";
import { test } from "vitest";
import { walk } from "@govlab/quality/core/visitors/context.fragment.visitor.ts";

test("walk visits every nested node once and skips the parent back-reference", () => {
    const leaf = { type: "Literal", value: "x" };
    const root = { body: [leaf], parent: { type: "Program" }, type: "BlockStatement" };
    const seen: string[] = [];
    walk(root, (node) => {
        seen.push(node.type);
    });
    assert.deepEqual(seen, ["BlockStatement", "Literal"]);
});

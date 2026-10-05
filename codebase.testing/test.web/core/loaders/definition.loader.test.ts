import { describe, expect, it } from "vitest";
import { listDefinitions, locateNode } from "@banes-lab/web/core/loaders/definition.loader.ts";

describe("locateNode", () => {
    it("locates a definition the trees hold, and answers nothing for a node that names nothing", () => {
        const [first] = listDefinitions();
        if (first === undefined) {
            throw new Error("the anatomy trees hold no definition");
        }
        expect(locateNode({ file: first.file, kind: "definition", name: first.name })).not.toBeNull();
        expect(locateNode({ kind: "file", name: "no-such-file.ts" })).toBeNull();
    });
});

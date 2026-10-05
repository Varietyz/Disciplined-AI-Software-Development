import { cyclesIn, localImports, moduleSource } from "coordination-surface/tools/core/analyzers/graph.analyzer.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

describe("cyclesIn", () => {
    it("reports each cycle once, whichever node the walk entered it from", () => {
        const edges = new Map([
            ["a", new Set(["b"])],
            ["b", new Set(["c"])],
            ["c", new Set(["a"])],
            ["d", new Set(["a"])],
        ]);
        assert.deepEqual(cyclesIn(edges), [["a", "b", "c"]]);
    });

    it("finds no cycle in an acyclic graph", () => {
        const edges = new Map([["a", new Set(["b"])]]);
        assert.deepEqual(cyclesIn(edges), []);
    });
});

describe("localImports", () => {
    it("resolves relative specifiers, including multi-line imports, against the known module set", () => {
        const source = [
            'import { a } from "./a.ts";',
            "import {",
            "    b,",
            '} from "../lib/b.ts";',
            'import { c } from "node:path";',
        ].join("\n");
        const known = new Set(["core/a.ts", "lib/b.ts", "core/c.ts"]);
        assert.deepEqual(localImports("/repo/core/entry.ts", source, known).toSorted(), ["core/a.ts", "lib/b.ts"]);
    });
});

describe("moduleSource", () => {
    it("appends each readable local import's source and skips type-only imports and unreadable ones", () => {
        const files = new Map([
            [
                "/repo/core/entry.ts",
                'import type { T } from "./types.ts";\nimport { a } from "./a.ts";\nimport { gone } from "./gone.ts";',
            ],
            ["core/a.ts", "export const a = 1;"],
        ]);
        const read = (path: string): string => {
            const text = files.get(path);
            if (text === undefined) {
                throw Object.assign(new Error(path), { code: "ENOENT" });
            }
            return text;
        };
        const combined = moduleSource(
            "/repo/core/entry.ts",
            read,
            new Set(["core/a.ts", "core/types.ts", "core/gone.ts"]),
        );
        assert.equal(combined.endsWith("\nexport const a = 1;"), true);
        assert.equal(combined.includes("core/types.ts"), false);
    });
});

import {
    declaredDependencies,
    dependencyReach,
    installRootPresent,
} from "coordination-surface/tools/core/resolvers/dependency.resolver.ts";
import { describe, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const write = function write(path: string, value: unknown): void {
    writeVerbatim(path, JSON.stringify(value, null, 4));
};

describe("declaredDependencies", () => {
    it("lists runtime and development dependencies in declared order", () => {
        assert.deepEqual(
            declaredDependencies({ dependencies: { a: "1" }, devDependencies: { b: "1" }, peer: { c: "1" } }),
            ["a", "b"],
        );
    });
});

describe("dependencyReach and installRootPresent", () => {
    it("reads a dependency as reached by an import, a type package, a script or its binary, and says when it cannot tell", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-dependencies-"));
        try {
            const manifest = join(root, "package.json");
            write(manifest, {
                dependencies: { "@types/typed": "1", ghost: "1", imported: "1", tool: "1", unused: "1" },
                scripts: { lint: "tool-bin ." },
            });
            mkdirSync(join(root, "src"));
            writeVerbatim(join(root, "src", "a.ts"), 'import x from "imported/sub";\nimport y from "typed";\n');
            mkdirSync(join(root, "node_modules", "tool"), { recursive: true });
            write(join(root, "node_modules", "tool", "package.json"), { bin: { "tool-bin": "cli.js" } });
            mkdirSync(join(root, "node_modules", "unused"), { recursive: true });
            write(join(root, "node_modules", "unused", "package.json"), {});
            const reach = dependencyReach(root, manifest);
            assert.deepEqual(reach.reached, ["@types/typed", "imported", "tool"]);
            assert.deepEqual(reach.unreached, ["unused"]);
            assert.deepEqual(reach.undetermined, ["ghost"]);
            assert.equal(installRootPresent(root), true);
            assert.deepEqual(dependencyReach(root, join(root, "absent.json")).declared, []);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { relFromModules, resolveTargetFile, targetExists } from "@govlab/docs/core/resolvers/source.resolver.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const MODULE = absolutePath("govlab.docs");
const moduleDir = mkdtempSync(join(tmpdir(), "doc-targets-"));
writeVerbatim(join(moduleDir, "local.txt"), "");

afterAll(() => {
    rmSync(moduleDir, { force: true, recursive: true });
});

describe("relFromModules", () => {
    it("expresses a workspace file relative to the root and keeps an outside file absolute", () => {
        expect(relFromModules(join(MODULE, "index.ts"))).toBe(`${relativePath("govlab.docs")}/index.ts`);
        expect(relFromModules(join(ROOT, "..", "outside.ts")).endsWith("outside.ts")).toBe(true);
    });
});

describe("resolveTargetFile and targetExists", () => {
    it("resolve a relative target from the module, a rooted one from the workspace, then from the module", () => {
        expect(resolveTargetFile("./local.txt", moduleDir, ROOT)).toBe(join(moduleDir, "local.txt"));
        expect(resolveTargetFile(`${relativePath("govlab.docs")}/index.ts`, MODULE, ROOT)).toBe(
            join(MODULE, "index.ts"),
        );
        expect(resolveTargetFile("local.txt", moduleDir, join(ROOT, "absent"))).toBe(join(moduleDir, "local.txt"));
        expect(targetExists("./gone.ts", moduleDir, ROOT)).toBe(false);
    });
});

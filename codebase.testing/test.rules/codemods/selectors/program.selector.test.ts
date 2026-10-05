import {
    CODEMOD_TSCONFIGS,
    inRepo,
    lineOf,
    programFor,
    relPath,
    repoSourceFiles,
    toPosix,
} from "@ssot/govlab/codemods/selectors/program.selector.ts";
import { absolutePath, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { join, sep } from "node:path";
import { existsSync } from "node:fs";
import ts from "typescript";

const MEMBER = absolutePath("app.member").split(sep).join("/");

describe("toPosix", () => {
    it("normalizes a platform path to forward slashes", () => {
        expect(toPosix(join("core", "registries", "probe.ts"))).toBe(["core", "registries", "probe.ts"].join("/"));
    });

    it("leaves an already-posix path untouched", () => {
        const value = ["core", "registries", "probe.ts"].join("/");
        expect(toPosix(value)).toBe(value);
    });
});

describe("relPath", () => {
    it("expresses a file inside the workspace relative to it", () => {
        expect(relPath(`${MEMBER}/index.ts`)).toBe(`${relativePath("app.member")}/index.ts`);
    });
});

describe("inRepo", () => {
    it("accepts a file inside the workspace", () => {
        expect(inRepo(`${MEMBER}/index.ts`)).toBe(true);
    });

    it("refuses an installed dependency, which the codemods never rewrite", () => {
        expect(inRepo(`${MEMBER}/node_modules/pkg/index.ts`)).toBe(false);
    });

    it("refuses a path outside the workspace", () => {
        expect(inRepo(["", "elsewhere", "index.ts"].join("/"))).toBe(false);
    });
});

describe("CODEMOD_TSCONFIGS", () => {
    it("covers one program per workspace member, since a member absent here is silently never scanned", () => {
        expect(CODEMOD_TSCONFIGS.length).toBeGreaterThan(0);
        expect(CODEMOD_TSCONFIGS).toContain(`${relativePath("app.member")}/tsconfig.json`);
        expect(CODEMOD_TSCONFIGS).toContain(`${relativePath("codebase.testing")}/tsconfig.json`);
        expect(CODEMOD_TSCONFIGS.every((entry) => entry.endsWith("/tsconfig.json"))).toBe(true);
        expect(CODEMOD_TSCONFIGS.every((entry) => existsSync(entry))).toBe(true);
    });
});

describe("programFor and repoSourceFiles", () => {
    it("builds a program whose repo sources exclude declarations and dependencies", () => {
        const program = programFor(`${relativePath("app.member")}/tsconfig.json`);
        const sources = repoSourceFiles(program);
        expect(sources.every((file) => !file.isDeclarationFile)).toBe(true);
        expect(sources.every((file) => inRepo(file.fileName))).toBe(true);
    });
});

describe("lineOf", () => {
    it("reports a one-based line for a node", () => {
        const source = ts.createSourceFile("probe.ts", "const a = 1;\nconst b = 2;", ts.ScriptTarget.Latest, true);
        const [, second] = source.statements;
        expect(second === undefined ? 0 : lineOf(source, second)).toBe(2);
    });
});

import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/no-hardcoded-exclusions.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const FILE = `${absolutePath("govlab.quality").split(sep).join("/")}/src/probe.ts`;
const EXEMPT = absolutePath("govlabHost.config").split(sep).join("/");

const idsFor = function idsFor(code: string, file = FILE): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("no-hardcoded-exclusions", () => {
    it("flags a skip list spelling infrastructure directories", () => {
        expect(idsFor('const SKIP_DIRS = ["node_modules", "dist"];')).toContain("hardcodedExclusion");
    });

    it("flags the same set however the name is spelled", () => {
        expect(idsFor('const ignoreDirs = ["node_modules"];')).toContain("hardcodedExclusion");
        expect(idsFor('const PRUNE = ["coverage"];')).toContain("hardcodedExclusion");
        expect(idsFor('const RUNTIME_ROOTS = [".cache", ".vite"];')).toContain("hardcodedExclusion");
    });

    it("flags a set wrapped in a Set or a call", () => {
        expect(idsFor('const SKIP = new Set(["node_modules"]);')).toContain("hardcodedExclusion");
    });

    it("flags a list that reads the master surface and then appends in source", () => {
        const code = 'const SKIP_DIRS = [...masterExcludeMarkers(config), "node_modules"];';
        expect(idsFor(code)).toContain("partialExclusion");
    });

    it("accepts a list taken wholly from the master surface", () => {
        expect(idsFor("const SKIP_DIRS = [...masterExcludeMarkers(config)];")).toStrictEqual([]);
    });

    it("ignores a list whose name names no exclusion", () => {
        expect(idsFor('const ROOTS = ["node_modules"];')).toStrictEqual([]);
    });

    it("ignores a list holding no infrastructure directory", () => {
        expect(idsFor('const SKIP_TAGS = ["draft", "internal"];')).toStrictEqual([]);
    });

    it("ignores the config that owns the master list", () => {
        expect(idsFor('const exclude = ["node_modules", "dist"];', EXEMPT)).toStrictEqual([]);
    });

    it("holds a file that only shares the config's name", () => {
        const namesake = `${absolutePath("govlab.quality").split(sep).join("/")}/govlab.config.ts`;
        expect(idsFor('const exclude = ["node_modules"];', namesake)).toContain("hardcodedExclusion");
    });
});

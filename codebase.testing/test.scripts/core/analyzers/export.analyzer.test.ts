import { describe, expect, it } from "vitest";
import { RUNNER_MODULES } from "@banes-lab/build-scripts/configuration/constants/loader.constants.ts";
import { absolutePath } from "@ssot/paths";
import { collectExternalConsumers } from "@project/scripts/core/analyzers/export.analyzer.ts";
import { join } from "node:path";
import { readFileSync } from "node:fs";

const MEMBER = absolutePath("app.member");
const ANCHOR = ".";
const PATTERNED_NAME = "recordCountPhrase";
const TYPESCRIPT_SUFFIX = ".ts";
const WEB_PACKAGE = "@banes-lab/web/";
const localOf = (path: string): string => path.slice(WEB_PACKAGE.length);
const anchoredOf = (path: string): string => `${ANCHOR}/${localOf(path)}`;
const SITE_FILE = anchoredOf(RUNNER_MODULES.site.path);
const COMPANY_FILE = anchoredOf(RUNNER_MODULES.company.path);
const COMPANY_EXPORTS = [
    { file: localOf(RUNNER_MODULES.company.path), name: "COMPANY_NAME" },
    { file: localOf(RUNNER_MODULES.company.path), name: "COMPANY_OWNER" },
    { file: localOf(RUNNER_MODULES.pageStrings.path), name: "SITE_NAME" },
];
const SIDE_EFFECT_FILES = new Set(
    Object.values(RUNNER_MODULES)
        .filter((module) => module.names.length === 0)
        .map((module) => anchoredOf(module.path)),
);

describe("collectExternalConsumers", () => {
    const imports = collectExternalConsumers(MEMBER, COMPANY_EXPORTS);
    const named = (from: string): readonly string[] | undefined =>
        imports.findLast((entry) => entry.from === from)?.names;

    it("anchors every entry at the member it describes, not at the file that imported it", () => {
        for (const entry of imports) {
            expect(entry.file).toBe(ANCHOR);
        }
    });

    it("records at least one name for every test or config import, so a bare side-effect import is dropped", () => {
        for (const entry of imports.slice(0, -Object.keys(RUNNER_MODULES).length)) {
            expect(entry.names.length).toBeGreaterThan(0);
        }
    });

    it("keeps a runner module the build loads for its side effects, with no names", () => {
        for (const file of SIDE_EFFECT_FILES) {
            expect(named(file)).toEqual([]);
        }
    });

    it("finds the centralized tests that consume the member", () => {
        expect(imports.length).toBeGreaterThan(Object.keys(RUNNER_MODULES).length);
    });

    it("resolves a specifier through the member's declared export pattern, extension included", () => {
        const viaPattern = imports.find((entry) => entry.names.includes(PATTERNED_NAME));
        const from = viaPattern?.from ?? "";
        expect(from.startsWith(ANCHOR)).toBe(true);
        expect(from.endsWith(TYPESCRIPT_SUFFIX)).toBe(true);
        expect(readFileSync(join(MEMBER, from), "utf8")).toContain(`const ${PATTERNED_NAME} `);
    });

    it("rewrites the member's own package specifier to a path inside it, and leaves a third-party one alone", () => {
        const rewritten = imports.filter((entry) => entry.from.startsWith(ANCHOR));
        expect(rewritten.length).toBeGreaterThan(0);
        for (const entry of imports) {
            expect(entry.from.startsWith(`${MEMBER}/`)).toBe(false);
        }
    });

    it("counts a module the build loads through the runner as consumed, with the names the registry declares", () => {
        expect(named(SITE_FILE)).toEqual(RUNNER_MODULES.site.names);
    });

    it("expands a whole-module runner read to that file's exports alone", () => {
        expect(named(COMPANY_FILE)).toEqual(["COMPANY_NAME", "COMPANY_OWNER"]);
    });
});

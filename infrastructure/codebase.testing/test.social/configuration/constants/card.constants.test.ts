import { describe, expect, it } from "vitest";
import { dirname, resolve } from "node:path";
import { STAGE_SHEETS } from "@banes-lab/social-share/configuration/constants/card.constants.ts";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const ACCENT_SUFFIX = "_ACCENT";
const IMPORT_HEAD = 'import "';
const IMPORT_TAIL = '";';
const STYLE_EXTENSION = ".css";
const RELATIVE_HEAD = ".";

const sheetPath = function sheetPath(specifier: string): string {
    return fileURLToPath(import.meta.resolve(specifier));
};

const entryPath = sheetPath("@banes-lab/social-share/runtime/entrypoints/stage.entrypoint.ts");

const entrySheets = function entrySheets(): string[] {
    return readFileSync(entryPath, "utf8")
        .split("\n")
        .filter((line) => line.startsWith(IMPORT_HEAD) && line.endsWith(STYLE_EXTENSION + IMPORT_TAIL))
        .map((line) => line.slice(IMPORT_HEAD.length, line.length - IMPORT_TAIL.length))
        .map((specifier) =>
            specifier.startsWith(RELATIVE_HEAD) ? resolve(dirname(entryPath), specifier) : sheetPath(specifier),
        );
};

const pageConstants: Readonly<Record<string, unknown>> =
    await import("@banes-lab/web/configuration/constants/page.constants.ts");

const accents = Object.entries(pageConstants).flatMap(([name, value]) =>
    name.endsWith(ACCENT_SUFFIX) && typeof value === "string" ? [value] : [],
);

describe("STAGE_SHEETS", () => {
    it("is exactly the set of stylesheets the stage entry loads, in the same order", () => {
        expect(entrySheets()).toStrictEqual(STAGE_SHEETS.map(sheetPath));
    });

    it("declares every page accent, so each card takes its page's colors", () => {
        const styles = STAGE_SHEETS.map((sheet) => readFileSync(sheetPath(sheet), "utf8")).join("\n");
        expect(accents.length).toBeGreaterThan(0);
        expect(accents.filter((accent) => !styles.includes(`.${accent} {`))).toStrictEqual([]);
    });
});

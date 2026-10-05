import {
    baselineTarget,
    literalsOf,
    readStringsModules,
    stringsFolders,
    toneTarget,
} from "@banes-lab/content/core/loaders/strings.loader.ts";
import { describe, expect, it } from "vitest";

const SLOT = ["$", "{A}"].join("");

describe("literalsOf", () => {
    it("reads string literals and template quasis out of a source through the parser", async () => {
        const literals = await literalsOf(`export const A = "Alpha";\nexport const B = \`Beta ${SLOT}\`;\n`);
        expect(literals).toContain("Alpha");
        expect(literals.some((text) => text.startsWith("Beta"))).toBe(true);
    });
});

describe("stringsFolders and readStringsModules", () => {
    it("finds the application member's strings folder and reads every module in it", async () => {
        expect(stringsFolders()).toHaveLength(1);
        const modules = await readStringsModules();
        expect(modules.length).toBeGreaterThan(0);
        expect(modules.every((held) => held.module.endsWith(".strings.ts"))).toBe(true);
    });
});

describe("toneTarget and baselineTarget", () => {
    it("resolve the JSON report and the generated document by key", () => {
        expect(toneTarget()).toContain("tone-baseline");
        expect(baselineTarget("x.generated.md").split("\\").join("/")).toContain("/generated/x.generated.md");
    });
});

import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/no-comments.eslint.rule.ts";
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

const SRC = `${absolutePath("app.member").split(sep).join("/")}/core/registries/probe.registry.ts`;

const idsFor = function idsFor(code: string): string[] {
    return linter
        .verify(code, config, SRC)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

const fixed = function fixed(code: string): string {
    return linter.verifyAndFix(code, config, SRC).output;
};

describe("no-comments", () => {
    it("reports a line comment", () => {
        expect(idsFor("// explains nothing\nconst a = 1;")).toStrictEqual(["report"]);
    });

    it("reports a block comment", () => {
        expect(idsFor("/* explains nothing */\nconst a = 1;")).toStrictEqual(["report"]);
    });

    it("removes a whole-line comment when fixing", () => {
        expect(fixed("// explains nothing\nconst a = 1;")).toBe("const a = 1;");
    });

    it("removes a trailing comment and the space before it", () => {
        expect(fixed("const a = 1; // note")).toBe("const a = 1;");
    });

    it("keeps a compiler directive", () => {
        expect(idsFor("// @ts-expect-error narrowing\nconst a = 1;")).toStrictEqual([]);
    });

    it("keeps a lint directive, which its own rule governs", () => {
        expect(idsFor("// eslint-disable-next-line no-console\nconst a = 1;")).toStrictEqual([]);
    });

    it("accepts source with no comments", () => {
        expect(idsFor("const a = 1;")).toStrictEqual([]);
    });
});

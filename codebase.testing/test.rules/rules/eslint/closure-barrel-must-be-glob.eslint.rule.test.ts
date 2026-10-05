import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import rule from "@ssot/govlab/rules/eslint/closure-barrel-must-be-glob.eslint.rule.ts";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const BARREL = "domain/policies/policies.barrel.ts";

const HAND_WRITTEN = 'import "./one.policy.ts";\nimport "./two.policy.ts";';

const idsFor = function idsFor(code: string, file = BARREL): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("closure-barrel-must-be-glob", () => {
    it("reports a barrel that enumerates its siblings by hand", () => {
        expect(idsFor(HAND_WRITTEN)).toStrictEqual(["barrelMustGlob"]);
    });

    it("accepts a barrel that discovers through a glob", () => {
        const globbed = `${HAND_WRITTEN}\nconst all = import.meta.glob("./*.policy.ts", { eager: true });`;
        expect(idsFor(globbed)).toStrictEqual([]);
    });

    it("accepts a single hand-written import, which is below the threshold", () => {
        expect(idsFor('import "./one.policy.ts";')).toStrictEqual([]);
    });

    it("ignores side-effect imports of packages rather than siblings", () => {
        expect(idsFor('import "some-package";\nimport "other-package";')).toStrictEqual([]);
    });

    it("reports every export a barrel declares, since a barrel only loads its variants", () => {
        const exporting =
            'const found = import.meta.glob("./*.policy.ts", { eager: true });\nexport const NAMES = Object.keys(found);\nexport default found;';
        expect(idsFor(exporting)).toStrictEqual(["barrelExports", "barrelExports"]);
    });

    it("accepts a barrel that runs its glob for the side effect alone", () => {
        expect(idsFor('import.meta.glob("./*.policy.ts", { eager: true });')).toStrictEqual([]);
    });

    it("does not fire outside a barrel file", () => {
        expect(idsFor(HAND_WRITTEN, "domain/policies/base.policy.ts")).toStrictEqual([]);
    });
});

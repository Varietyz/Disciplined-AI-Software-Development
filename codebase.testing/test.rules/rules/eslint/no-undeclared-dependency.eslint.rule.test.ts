import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import { sep } from "node:path";
import wrapper from "@ssot/govlab/rules/eslint/no-undeclared-dependency.eslint.rule.ts";

const rule = wrapper.plugins["govlab-deps"].rules["no-undeclared-dependency"];

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

describe("no-undeclared-dependency", () => {
    it("reports an import of a package no manifest up the tree declares", () => {
        expect(idsFor(`import x from "definitely-not-installed-anywhere";\nexport const a = x;`)).toStrictEqual([
            "undeclared",
        ]);
    });

    it("reports an undeclared package reached through require", () => {
        expect(idsFor(`const x = require("definitely-not-installed-anywhere");\nexport const a = x;`)).toStrictEqual([
            "undeclared",
        ]);
    });

    it("reports an undeclared package reached through a dynamic import", () => {
        expect(idsFor(`export const a = async () => import("definitely-not-installed-anywhere");`)).toStrictEqual([
            "undeclared",
        ]);
    });

    it("accepts a node builtin", () => {
        expect(idsFor(`import { join } from "node:path";\nexport const a = join;`)).toStrictEqual([]);
    });

    it("accepts a subpath self-import, which the member's own imports map declares", () => {
        expect(
            idsFor(`import type { Capability } from "#types/base.types";\nexport type A = Capability;`),
        ).toStrictEqual([]);
    });

    it("accepts a relative import", () => {
        expect(idsFor(`import { a } from "./sibling.ts";\nexport const b = a;`)).toStrictEqual([]);
    });

    it("accepts a self-declaring scheme that resolves without a manifest entry", () => {
        expect(idsFor(`export const a = async () => import("data:text/javascript,export default 1");`)).toStrictEqual(
            [],
        );
    });
});

import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/no-inline-asset-path.eslint.rule.ts";
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

const MEMBER = absolutePath("app.member").split(sep).join("/");
const SRC = `${MEMBER}/domain/models/probe.model.ts`;

const idsFor = function idsFor(code: string, file = SRC): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("no-inline-asset-path", () => {
    it("reports an asset location spelled at a call site", () => {
        expect(idsFor('const logo = "/assets/logo.svg";')).toStrictEqual(["pathLiteral"]);
    });

    it("reports a route or endpoint location too", () => {
        expect(idsFor('const url = "/api/session";')).toStrictEqual(["pathLiteral"]);
        expect(idsFor('const url = "/v1/session";')).toStrictEqual(["pathLiteral"]);
    });

    it("reports the same location inside a template literal", () => {
        expect(idsFor(`const url = \`/static/\${name}\`;`)).toStrictEqual(["pathLiteral"]);
    });

    it("reports a direct read of the deployment base", () => {
        expect(idsFor("const base = import.meta.env.BASE_URL;")).toStrictEqual(["envBaseUrl"]);
    });

    it("accepts a string that names no location", () => {
        expect(idsFor('const label = "Reset to defaults";')).toStrictEqual([]);
    });

    it("does not fire in a standalone server script, which is its own catalog", () => {
        const script = `${absolutePath("app.nginxScripts").split(sep).join("/")}/probe.entrypoint.ts`;
        expect(idsFor('const url = "/api/session";', script)).toStrictEqual([]);
    });

    it("does not fire inside the asset catalog", () => {
        expect(idsFor('const logo = "/assets/logo.svg";', `${MEMBER}/core/assets/probe.asset.ts`)).toStrictEqual([]);
    });
});

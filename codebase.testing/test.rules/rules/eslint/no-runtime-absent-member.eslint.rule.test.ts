import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import rule from "@ssot/govlab/rules/eslint/no-runtime-absent-member.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "no-runtime-absent-member": rule } } },
    rules: { "local/no-runtime-absent-member": "error" },
};

const BOUND_FILE = join(absolutePath("app.nginxScripts"), "probe.entrypoint.ts");
const FREE_FILE = join(absolutePath("project.scripts"), "runtime", "entrypoints", "probe.entrypoint.ts");

const idsFor = function idsFor(code: string, filename: string): string[] {
    return linter
        .verify(code, config, { filename })
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

describe("no-runtime-absent-member", () => {
    it("reports a dotted call to a member the bound runtime lacks", () => {
        expect(idsFor("const order = left.localeCompare(right);", BOUND_FILE)).toStrictEqual(["absentMember"]);
    });

    it("reports a computed access written with a literal", () => {
        expect(idsFor('const order = left["localeCompare"](right);', BOUND_FILE)).toStrictEqual(["absentMember"]);
    });

    it("accepts a comparison written with operators in a bound folder", () => {
        expect(idsFor("const order = left < right ? -1 : 1;", BOUND_FILE)).toStrictEqual([]);
    });

    it("leaves a file outside every bound folder", () => {
        expect(idsFor("const order = left.localeCompare(right);", FREE_FILE)).toStrictEqual([]);
    });
});

import { describe, expect, it } from "vitest";
import { FILE_LENGTH } from "@ssot/govlab/shared/generated/thresholds.generated.ts";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import { concernSuffix } from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";
import fileLength from "@ssot/govlab/rules/eslint/file-length.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();

const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "file-length": fileLength } } },
    rules: { "local/file-length": "error" },
};

const overLong = Array.from(
    { length: FILE_LENGTH + 1 },
    (_, index) => `export const v${String(index)} = ${String(index)};`,
).join("\n");

const lint = function lint(filename: string): Linter.LintMessage[] {
    return linter.verify(overLong, config, { filename });
};

describe("file-length", () => {
    it("reports a source file over the budget", () => {
        const msgs = lint("page.loader.ts");
        expect(msgs).toHaveLength(1);
        expect(msgs[0]?.messageId).toBe("tooLong");
    });

    it("exempts a strings module, whose length is decided by its copy", () => {
        expect(lint(`methodology${concernSuffix("strings")}`)).toHaveLength(0);
    });

    it("exempts a standalone server script, which ships as one file", () => {
        const scripts = absolutePath("app.nginxScripts").split(sep).join("/");
        expect(lint(`${scripts}/probe.entrypoint.ts`)).toHaveLength(0);
    });

    it("exempts tests and generated files", () => {
        expect(lint("page.loader.test.ts")).toHaveLength(0);
        expect(lint("diagram.generated.ts")).toHaveLength(0);
    });
});

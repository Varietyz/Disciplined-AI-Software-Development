import { absolutePath, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { join } from "node:path";
import standaloneScriptImported from "@ssot/govlab/rules/eslint/closure-standalone-script-imported.eslint.rule.ts";

const linter = new Linter();
const config: Linter.Config = {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: 2025, sourceType: "module" },
    plugins: { local: { rules: { "closure-standalone-script-imported": standaloneScriptImported } } },
    rules: { "local/closure-standalone-script-imported": "error" },
};

const lint = function lint(filename: string): Linter.LintMessage[] {
    return linter.verify("export const probe = 1;\n", config, { filename });
};

describe("closure-standalone-script-imported", () => {
    it("passes a standalone script that nothing under the application root imports", () => {
        const script = join(absolutePath("project.scripts"), "runtime", "entrypoints", "probe.entrypoint.ts");
        expect(lint(script)).toStrictEqual([]);
    });

    it("never reports a file outside the standalone scripts, whoever imports it", () => {
        const buildFile = join(absolutePath("app.build"), "base.timer.ts");
        expect(lint(buildFile)).toStrictEqual([]);
    });

    it("points its finding at the member the paths SSOT declares as the build home", () => {
        const message = standaloneScriptImported.meta.messages.importedScript;
        expect(message).toContain("{{home}}");
        expect(relativePath("app.build").length).toBeGreaterThan(0);
        expect(standaloneScriptImported.meta.docs.workspaceWide).toBe(true);
    });
});

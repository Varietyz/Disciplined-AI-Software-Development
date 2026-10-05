import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import rule from "@ssot/govlab/rules/stylelint/no-unresolved-import.stylelint.rule.ts";
import stylelint from "stylelint";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const RULE_NAME = "local/no-unresolved-import";

const warningsOf = async function warningsOf(code: string, codeFilename: string): Promise<readonly string[]> {
    const result = await stylelint.lint({
        code,
        codeFilename,
        config: { plugins: [rule], rules: { [RULE_NAME]: true } },
    });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.text));
};

describe("no-unresolved-import", () => {
    it("reports a relative import that names no file, and passes one that does and one that is served", async () => {
        const root = mkdtempSync(join(tmpdir(), "sheet-"));
        writeVerbatim(join(root, "present.css"), "a { color: red; }\n");
        const code = [
            '@import url("./present.css");',
            "@import './missing.css';",
            '@import url("https://example.org/remote.css");',
            '@import "/served/root.css";',
        ].join("\n");
        const warnings = await warningsOf(code, join(root, "site.css"));
        rmSync(root, { force: true, recursive: true });
        expect(warnings).toHaveLength(1);
        expect(warnings[0]).toContain("'./missing.css' names no file on disk");
    });

    it("resolves a package import from the sheet's own location", async () => {
        const code = [
            '@import "bootstrap-icons/font/bootstrap-icons.css";',
            '@import "no-such-package/sheet.css";',
        ].join("\n");
        const warnings = await warningsOf(code, join(absolutePath("app.member"), "probe.style.css"));
        expect(warnings).toHaveLength(1);
        expect(warnings[0]).toContain("'no-such-package/sheet.css'");
    });
});

import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import stylelint from "stylelint";
import stylesheetPlugins from "@ssot/govlab/rules/plugins/stylelint.plugin.ts";
import { tmpdir } from "node:os";

const CODE = '@import "./missing.css";';
const PROBE = "probe.style.css";

const warningsAt = async function warningsAt(codeFilename: string): Promise<number> {
    const result = await stylelint.lint({
        code: CODE,
        codeFilename,
        config: { plugins: [...stylesheetPlugins.plugins], rules: { "local/no-unresolved-import": true } },
    });
    return result.results.flatMap((entry) => entry.warnings).length;
};

describe("the stylesheet rule plugin", () => {
    it("runs each local stylesheet rule on a governed file only", async () => {
        expect(stylesheetPlugins.tool).toBe("stylelint");
        const governed = join(absolutePath("app.member"), PROBE);
        const outside = join(tmpdir(), PROBE);
        expect(await warningsAt(governed)).toBe(1);
        expect(await warningsAt(outside)).toBe(0);
    });
});

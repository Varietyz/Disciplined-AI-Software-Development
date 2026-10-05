import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import noHeldEntranceFill from "@govlab/quality/core/stylelint/no-held-entrance-fill.stylelint.rule.ts";
import stylelint from "stylelint";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const RULE = "govlab/no-held-entrance-fill";
const FADE = "@keyframes fade { from { opacity: 0; } to { opacity: 1; } }";
const FADE_OUT = "@keyframes vanish { 0% { opacity: 1; } 100% { opacity: 0; } }";

const lint = async function lint(code: string): Promise<readonly string[]> {
    const result = await stylelint.lint({ code, config: { plugins: [noHeldEntranceFill], rules: { [RULE]: true } } });
    return result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule));
};

describe("govlab/no-held-entrance-fill", () => {
    it("reports a shorthand that holds an opaque end with both or forwards", async () => {
        expect(await lint(`${FADE} .card { animation: fade 1s ease both; }`)).toStrictEqual([RULE]);
        expect(await lint(`${FADE} .card { animation: fade 1s forwards; }`)).toStrictEqual([RULE]);
    });

    it("reports the held layer among several", async () => {
        expect(await lint(`${FADE} ${FADE_OUT} .card { animation: vanish 1s, fade 1s both; }`)).toStrictEqual([RULE]);
    });

    it("reports longhands that hold an opaque end", async () => {
        const code = `${FADE} .card { animation-name: fade; animation-fill-mode: both; }`;
        expect(await lint(code)).toStrictEqual([RULE]);
    });

    it("allows an entrance that fills backwards and rests on the element's own rule", async () => {
        expect(await lint(`${FADE} .card { animation: fade 1s backwards; opacity: 1; }`)).toStrictEqual([]);
    });

    it("allows holding an exit that ends transparent", async () => {
        expect(await lint(`${FADE_OUT} .card { animation: vanish 1s forwards; }`)).toStrictEqual([]);
    });

    it("reads keyframes declared in another stylesheet of the same member", async () => {
        const member = mkdtempSync(join(tmpdir(), "held-fill-"));
        mkdirSync(join(member, "effects"));
        writeVerbatim(join(member, "package.json"), "{}");
        writeVerbatim(join(member, "effects", "pop.effect.css"), FADE);
        const codeFilename = join(member, "dialog.style.css");
        const code = ".dialog { animation: fade 1s forwards; }";
        const result = await stylelint.lint({
            code,
            codeFilename,
            config: { plugins: [noHeldEntranceFill], rules: { [RULE]: true } },
        });
        expect(result.results.flatMap((entry) => entry.warnings.map((warning) => warning.rule))).toStrictEqual([RULE]);
    });
});

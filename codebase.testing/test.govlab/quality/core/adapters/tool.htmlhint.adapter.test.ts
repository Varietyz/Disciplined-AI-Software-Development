import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths";
import { govlabHtmlhintConfig } from "@govlab/quality/core/adapters/tool.htmlhint.adapter.ts";

test("govlabHtmlhintConfig returns the rules object and an ignore list", async () => {
    const config = await govlabHtmlhintConfig(ROOT);
    expect(typeof config.rules).toBe("object");
    expect(Array.isArray(config.ignore)).toBe(true);
});

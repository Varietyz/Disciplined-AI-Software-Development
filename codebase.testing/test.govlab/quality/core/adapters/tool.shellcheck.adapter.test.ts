import { expect, test } from "vitest";
import { shellcheckFlags } from "@govlab/quality/core/adapters/tool.shellcheck.adapter.ts";

test("shellcheckFlags turns the config section into shellcheck flags", () => {
    expect(shellcheckFlags({})).toStrictEqual([]);
    expect(shellcheckFlags({ enableAll: true, exclude: ["SC1090", "SC2034"], severity: "style" })).toStrictEqual([
        "--enable=all",
        "--severity=style",
        "--exclude=SC1090,SC2034",
    ]);
});

import { expect, test } from "vitest";
import { hadolintFlags } from "@govlab/quality/core/adapters/tool.hadolint.adapter.ts";

test("hadolintFlags turns the threshold and ignore list into hadolint flags", () => {
    expect(hadolintFlags({})).toStrictEqual([]);
    expect(hadolintFlags({ failureThreshold: "warning", ignore: ["DL3008"] })).toStrictEqual([
        "--failure-threshold",
        "warning",
        "--ignore",
        "DL3008",
    ]);
});

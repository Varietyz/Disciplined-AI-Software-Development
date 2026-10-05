import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths";
import { govlabJscpdConfig } from "@govlab/quality/core/adapters/tool.jscpd.adapter.ts";

test("govlabJscpdConfig reports through the json reporter and carries the thresholds", async () => {
    const config = await govlabJscpdConfig(ROOT);
    expect(config["reporters"]).toStrictEqual(["json"]);
    expect(typeof config["minTokens"]).toBe("number");
});

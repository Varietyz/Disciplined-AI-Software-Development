import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths";
import { govlabYamllintConfig } from "@govlab/quality/core/adapters/tool.yamllint.adapter.ts";

test("govlabYamllintConfig builds the inline config and the interpreter command", async () => {
    const { command, config } = await govlabYamllintConfig(ROOT);
    expect(command.length).toBeGreaterThan(0);
    expect(typeof config["extends"]).toBe("string");
});

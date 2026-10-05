import {
    enabledToolRules,
    nativeToolConfig,
    resolveActiveEcosystems,
    resolveActiveSelectable,
    toolSection,
    toolSetting,
} from "@govlab/quality/core/resolvers/tool.resolver.ts";
import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths";

test("tool settings fall back to their defaults and the workspace declares its ecosystems", async () => {
    expect(typeof (await toolSection(ROOT, "knip"))).toBe("object");
    expect(await toolSetting(ROOT, "govlab-missing-section", { command: "tool" })).toStrictEqual({ command: "tool" });
    expect(typeof (await nativeToolConfig(ROOT, "python", "ruff.toml"))).toBe("string");
    expect(Array.isArray(await enabledToolRules(ROOT, "rust", "clippy"))).toBe(true);
    expect(Array.isArray(await resolveActiveSelectable(ROOT))).toBe(true);
    expect(await resolveActiveEcosystems(ROOT)).toContain("typescript");
});

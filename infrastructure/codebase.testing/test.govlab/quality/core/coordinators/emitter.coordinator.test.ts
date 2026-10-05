import { expect, test } from "vitest";
import { generateNativeConfigs } from "@govlab/quality/core/coordinators/emitter.coordinator.ts";

const COMPLEXITY = 10;

test("generateNativeConfigs emits nothing when no concern is active", async () => {
    expect(await generateNativeConfigs({}, ["python"])).toStrictEqual([]);
});

test("generateNativeConfigs emits the native config files a language's tools read", async () => {
    const files = await generateNativeConfigs(Object.fromEntries([["cyclomatic-complexity", COMPLEXITY]]), ["python"]);
    const ruff = files.find((file) => file.path === "ruff.toml");
    expect(ruff?.content).toContain("max-complexity = 10");
});

import { expect, test } from "vitest";
import { loadRuleSources } from "@govlab/quality/core/loaders/binding.loader.ts";

test("loadRuleSources reads every rule file of the host and quality rule folders under its rule id", () => {
    const sources = loadRuleSources();
    expect(sources.some((source) => source.id === "require-test-coverage")).toBe(true);
    expect(sources.every((source) => source.text.length > 0)).toBe(true);
});

import { expect, test } from "vitest";
import { canonicalOf } from "@govlab/quality/core/parsers/binding.parser.ts";

test("canonicalOf reads the canonical concept list of a rule source", () => {
    expect(canonicalOf("meta: govlabMeta({ canonical: [\"magic-number\", 'test-quality'] })")).toStrictEqual([
        "magic-number",
        "test-quality",
    ]);
    expect(canonicalOf("meta: { docs: {} }")).toBeNull();
    expect(canonicalOf("canonical: [")).toBeNull();
});

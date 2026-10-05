import { dirOf, forwardSlashed, stripExtension } from "@govlab/quality/core/converters/filename.converter.ts";
import { expect, test } from "vitest";

test("stripExtension removes only a recognized source extension", () => {
    expect(stripExtension("a.module.ts")).toBe("a.module");
    expect(stripExtension("a.module.md")).toBe("a.module.md");
});

test("forwardSlashed and dirOf normalize separators and drop the last segment", () => {
    expect(forwardSlashed(String.raw`a\b\c.ts`)).toBe("a/b/c.ts");
    expect(dirOf(String.raw`a\b\c.ts`)).toBe("a/b");
});

import {
    cleanTarget,
    normalizeTarget,
    unquote,
    withoutFragment,
} from "@govlab/docs/core/normalizers/reference.normalizer.ts";
import { describe, expect, it } from "vitest";

describe("the target normalizers", () => {
    it("strip quotes, fragments, trailing slashes and line suffixes", () => {
        expect([unquote('"a.md"'), unquote("'a.md'"), unquote('"')]).toStrictEqual(["a.md", "a.md", '"']);
        expect(withoutFragment("a.md#part")).toBe("a.md");
        expect(cleanTarget('"a.md#part"')).toBe("a.md");
        expect(normalizeTarget("src/a.ts:10-12")).toBe("src/a.ts");
        expect(normalizeTarget("src/a.ts:4:9")).toBe("src/a.ts");
        expect(normalizeTarget("src/")).toBe("src");
        expect(normalizeTarget("src/a.ts:x")).toBe("src/a.ts:x");
    });
});

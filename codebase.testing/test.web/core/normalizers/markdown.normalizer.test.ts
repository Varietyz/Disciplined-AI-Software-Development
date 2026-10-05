import { describe, expect, it } from "vitest";
import { inlineCode } from "@banes-lab/web/core/normalizers/markdown.normalizer.ts";

describe("inlineCode", () => {
    it("reads each inline code span, and the spans inside a link label", () => {
        expect(inlineCode("run `plan` then `verify`")).toStrictEqual(["plan", "verify"]);
        expect(inlineCode("see [`tool`](a.md) here")).toStrictEqual(["tool"]);
        expect(inlineCode("plain text")).toStrictEqual([]);
    });
});

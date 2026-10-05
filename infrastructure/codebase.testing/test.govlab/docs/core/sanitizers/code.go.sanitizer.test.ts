import { describe, expect, it } from "vitest";
import { sanitizeGo } from "@govlab/docs/core/sanitizers/code.go.sanitizer.ts";

describe("sanitizeGo", () => {
    it("blanks strings and comments while keeping every offset and line break", () => {
        const source = 'call("x()") // note()\n/* a()\nb() */ run(`raw\\`)';
        const sanitized = sanitizeGo(source);
        expect(sanitized).toHaveLength(source.length);
        expect(sanitized.split("\n")).toHaveLength(source.split("\n").length);
        expect(sanitized).not.toContain("x()");
        expect(sanitized).not.toContain("note");
        expect(sanitized).not.toContain("a()");
        expect(sanitized).toContain("call(");
        expect(sanitized).toContain("run(");
    });
});

import { expect, test } from "vitest";
import { canonRefsModule } from "@govlab/quality/core/formatters/canon.reference.formatter.ts";

test("canonRefsModule writes a module whose map holds every concept and its refs", () => {
    const source = canonRefsModule([["file-length", ["architecture:size"]]]);
    expect(source).toContain('"file-length"');
    expect(source).toContain('"architecture:size"');
    expect(source).toContain("export const canonRefsFor");
});

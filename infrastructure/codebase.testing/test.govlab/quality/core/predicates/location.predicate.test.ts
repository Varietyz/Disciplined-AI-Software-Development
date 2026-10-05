import { expect, test } from "vitest";
import { isInsideRoot } from "@govlab/quality/core/predicates/location.predicate.ts";
import path from "node:path";

const ROOT = path.resolve("workspace-root");
const BESIDE = path.join(path.dirname(ROOT), "other", "a.ts");

test("isInsideRoot accepts the root and every path below it, relative or absolute", () => {
    expect(isInsideRoot(ROOT, ROOT)).toBe(true);
    expect(isInsideRoot(ROOT, "src/a.ts")).toBe(true);
    expect(isInsideRoot(ROOT, path.join(ROOT, "..x", "a.ts"))).toBe(true);
});

test("isInsideRoot refuses a path that climbs out of the root or sits beside it", () => {
    expect(isInsideRoot(ROOT, "../a.ts")).toBe(false);
    expect(isInsideRoot(ROOT, BESIDE)).toBe(false);
});

import { expect, test } from "vitest";
import { containsAny } from "@govlab/quality/core/predicates/filename.predicate.ts";

test("containsAny matches a fragment of the normalized filename", () => {
    expect(containsAny(String.raw`src\app\page.ts`, ["/app/"])).toBe(true);
    expect(containsAny("src/lib/page.ts", ["/app/"])).toBe(false);
    expect(containsAny("src/lib/page.ts")).toBe(false);
});

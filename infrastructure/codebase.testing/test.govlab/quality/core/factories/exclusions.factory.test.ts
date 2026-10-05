import { expect, test } from "vitest";
import { excludeMatcher } from "@govlab/quality/core/factories/exclusions.factory.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

test("excludeMatcher reads an absolute path relative to its root", async () => {
    const root = join(tmpdir(), "exclude-match-root");
    const isExcluded = await excludeMatcher(root);
    const absolute = join(root, "node_modules", "x.ts");
    const relative = join("node_modules", "x.ts");
    expect(isExcluded(absolute)).toBe(isExcluded(relative));
    expect(isExcluded(join(root, "member", "x.ts"))).toBe(false);
});

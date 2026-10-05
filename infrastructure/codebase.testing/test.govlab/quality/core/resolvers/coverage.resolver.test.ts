import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths/anchor";
import { join } from "node:path";
import { relativePath } from "@ssot/paths";
import { resolveScope } from "@govlab/quality/core/resolvers/coverage.resolver.ts";

const subject = join(ROOT, relativePath("govlab.quality"), "core", "matchers", "word.matcher.ts").split("\\").join("/");

test("resolveScope credits a construct that a centralized test names", () => {
    const scope = resolveScope(subject);
    expect(scope?.label.endsWith(relativePath("govlab.quality"))).toBe(true);
    expect(scope?.coversName("wordIncludes")).toBe(true);
    expect(scope?.coversName(["unnamed", "Construct", "Probe"].join(""))).toBe(false);
});

test("resolveScope answers null for a file with no package above it", () => {
    expect(resolveScope("/no/package/here.ts")).toBeNull();
});

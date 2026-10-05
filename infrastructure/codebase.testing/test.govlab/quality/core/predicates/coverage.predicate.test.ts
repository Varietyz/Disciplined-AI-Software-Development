import { expect, test } from "vitest";
import { MASTER_EXCLUDE_MARKERS } from "@ssot/govlab/shared/generated/exclusions.generated.ts";
import { isSkippable } from "@govlab/quality/core/predicates/coverage.predicate.ts";

test("isSkippable skips declarations, tests and every path the master exclusion names", () => {
    expect(isSkippable("a/types.d.ts", MASTER_EXCLUDE_MARKERS)).toBe(true);
    expect(isSkippable("a/b.test.ts", MASTER_EXCLUDE_MARKERS)).toBe(true);
    expect(isSkippable("a/node_modules/b.ts", MASTER_EXCLUDE_MARKERS)).toBe(true);
    expect(isSkippable("a/core/b.ts", MASTER_EXCLUDE_MARKERS)).toBe(false);
    expect(isSkippable("a/node_modules/b.ts", [])).toBe(false);
});

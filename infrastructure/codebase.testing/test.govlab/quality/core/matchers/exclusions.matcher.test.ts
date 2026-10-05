import { expect, test } from "vitest";
import { isExcludedPath, pathExclusion } from "@govlab/quality/core/matchers/exclusions.matcher.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

const REPORTS = "host/reports";

test("isExcludedPath matches a literal marker as a whole segment", () => {
    expect(isExcludedPath("a/node_modules/x.ts", ["node_modules"])).toBe(true);
    expect(isExcludedPath("a/node_modules_old/x.ts", ["node_modules"])).toBe(false);
});

test("isExcludedPath honors a leading, trailing and interior wildcard within a segment", () => {
    expect(isExcludedPath("build.cache", ["*.cache"])).toBe(true);
    expect(isExcludedPath("cache.build", ["*.cache"])).toBe(false);
    expect(isExcludedPath("_staged.artifacts", ["_staged.*"])).toBe(true);
    expect(isExcludedPath("a/report.generated.json", ["*.generated.*"])).toBe(true);
    expect(isExcludedPath("a/report.json", ["*.generated.*"])).toBe(false);
});

test("isExcludedPath matches a path marker only as a run of whole segments", () => {
    expect(isExcludedPath("host/reports/x.json", [REPORTS])).toBe(true);
    expect(isExcludedPath(String.raw`a\host\reports`, [REPORTS])).toBe(true);
    expect(isExcludedPath("xhost/reportsfoo/x.json", [REPORTS])).toBe(false);
    expect(isExcludedPath("reports/x.json", [REPORTS])).toBe(false);
});

test("isExcludedPath answers false for an empty marker set and an empty marker", () => {
    expect(isExcludedPath("dist", [])).toBe(false);
    expect(isExcludedPath("dist", [""])).toBe(false);
    expect(isExcludedPath("dist", ["node_modules", "dist", "*.cache"])).toBe(true);
});

test("pathExclusion reads a path under its root by its segments and one outside by its name alone", () => {
    const root = join(tmpdir(), "workspace");
    const isExcluded = pathExclusion(root, [REPORTS, "tmp"]);
    const insideOnly = join(tmpdir(), "tmp", "member");
    const outsideName = join(tmpdir(), "elsewhere", "tmp");
    expect(isExcluded(join(root, "host", "reports"))).toBe(true);
    expect(isExcluded(join("host", "reports", "x.json"))).toBe(true);
    expect(isExcluded(insideOnly)).toBe(false);
    expect(isExcluded(outsideName)).toBe(true);
});

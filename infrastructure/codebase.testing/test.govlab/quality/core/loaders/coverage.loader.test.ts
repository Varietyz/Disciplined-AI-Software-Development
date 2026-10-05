import { centralIndexFor, packageIndexFor } from "@govlab/quality/core/loaders/coverage.loader.ts";
import { expect, test } from "vitest";
import { mkdirSync, mkdtempSync } from "node:fs";
import { ROOT } from "@ssot/paths/anchor";
import { join } from "node:path";
import { relativePath } from "@ssot/paths";
import { tmpdir } from "node:os";
import { wordIncludes } from "@govlab/quality/core/matchers/word.matcher.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const coordination = join(ROOT, relativePath("app.coordination")).split("\\").join("/");

test("centralIndexFor returns an empty index when the declared test root does not exist", () => {
    expect(centralIndexFor(join(ROOT, "no-such-test-root"), ROOT).size).toBe(0);
});

test("centralIndexFor maps a centralized test root onto the members its tests import", () => {
    const index = centralIndexFor(join(ROOT, relativePath("codebase.testing")), ROOT);
    expect(index.size).toBeGreaterThan(0);
});

test("centralIndexFor credits a test to the nested package its package subpath lands in", () => {
    const index = centralIndexFor(join(ROOT, relativePath("codebase.testing")), ROOT);
    expect(wordIncludes(index.get(`${coordination}/tools`) ?? "", "declaresLead")).toBe(true);
});

test("packageIndexFor credits a package's tests to every nested package they import", () => {
    const outer = mkdtempSync(join(tmpdir(), "coverage-package-")).split("\\").join("/");
    mkdirSync(join(outer, "tools"));
    mkdirSync(join(outer, "spec"));
    writeVerbatim(join(outer, "package.json"), "{}");
    writeVerbatim(join(outer, "tools", "package.json"), "{}");
    writeVerbatim(
        join(outer, "spec", "standing.test.ts"),
        'import { claimStanding } from "../tools/core/standing.ts";\nclaimStanding();\n',
    );
    const credited = packageIndexFor(outer).get(`${outer}/tools`) ?? "";
    expect(wordIncludes(credited, "claimStanding")).toBe(true);
});

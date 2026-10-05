import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import type { ManifestModule } from "@govlab/docs/types/manifest.types.ts";
import { join } from "node:path";
import { relativePath } from "@ssot/paths";
import { staleChartsMessages } from "@govlab/docs/core/validators/figure.validator.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const made: string[] = [];

const moduleAt = function moduleAt(dir: string): ManifestModule {
    return { dir, group: "test", label: "mod", manifest: {}, pkg: {}, relPath: "test/mod", slug: "mod" };
};

afterEach(() => {
    for (const dir of made.splice(0)) {
        rmSync(dir, { force: true, recursive: true });
    }
});

describe("staleChartsMessages", () => {
    it("reports a charts file left behind by a module that is no longer analyzable", () => {
        const dir = mkdtempSync(join(tmpdir(), "docfig-"));
        made.push(dir);
        mkdirSync(join(dir, relativePath("moduleInfo.root")), { recursive: true });
        writeVerbatim(join(dir, relativePath("moduleInfo.charts")), "stale");
        expect(staleChartsMessages(moduleAt(dir), false)).toStrictEqual([expect.stringContaining("charts-stale")]);
    });

    it("stays quiet when the module still has charts or never had any", () => {
        expect(staleChartsMessages(moduleAt("module-under-test"), true)).toStrictEqual([]);
        expect(staleChartsMessages(moduleAt("module-under-test"), false)).toStrictEqual([]);
    });
});

import { afterAll, describe, expect, it } from "vitest";
import {
    barrelPath,
    indexDirectory,
    pruneStaleBarrels,
    writeCatalogJson,
} from "@govlab/docs/core/persistence/catalog.persistence.ts";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const dir = mkdtempSync(join(tmpdir(), "doc-index-"));
const PAYLOAD = {
    byConcern: {},
    byStatus: {},
    byType: {},
    cycles: [],
    deadEdges: [],
    docs: [],
    duplicateNames: [],
    superseded: [],
};

afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
});

describe("indexDirectory and barrelPath", () => {
    it("resolve the index folder and one barrel file per concern", () => {
        expect(indexDirectory()).toBe(absolutePath("docArch.index"));
        expect(existsSync(indexDirectory())).toBe(true);
        expect(barrelPath(dir, "scaling")).toBe(join(dir, "scaling.generated.md"));
    });
});

describe("writeCatalogJson", () => {
    it("writes formatted JSON once and reports no change when it already matches", async () => {
        expect(await writeCatalogJson(dir, PAYLOAD)).toBe(true);
        const written = readFileSync(join(dir, "catalog.generated.json"), "utf8");
        expect(JSON.parse(written)).toStrictEqual(PAYLOAD);
        expect(await writeCatalogJson(dir, PAYLOAD)).toBe(false);
    });
});

describe("pruneStaleBarrels", () => {
    it("removes only the barrels of concerns that no longer exist", () => {
        writeVerbatim(barrelPath(dir, "live"), "x");
        writeVerbatim(barrelPath(dir, "stale"), "x");
        expect(pruneStaleBarrels(dir, new Set(["live"]))).toBe(1);
        expect(readdirSync(dir).toSorted((left, right) => left.localeCompare(right))).toStrictEqual([
            "catalog.generated.json",
            "live.generated.md",
        ]);
    });
});

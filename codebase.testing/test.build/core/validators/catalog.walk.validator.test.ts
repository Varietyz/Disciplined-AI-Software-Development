import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { dirname, join } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { undeclaredRelation } from "@banes-lab/build-scripts/configuration/strings/catalog.strings.ts";
import { walkFindings } from "@banes-lab/build-scripts/core/validators/catalog.walk.validator.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const LEAF = "json/records/architecture/a.json";
const QUERY = "json/api/query.json";
let root = "";

const put = function put(file: string, value: unknown): void {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeVerbatim(join(root, file), JSON.stringify(value));
};

const RELATED = {
    relations: [
        { links: [], relation: "requires" },
        { links: [], relation: "drifts" },
        { links: [], relation: "drifts" },
    ],
};

beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "walk-"));
});

afterEach(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("walkFindings", () => {
    it("reports each leaf relation the query contract does not list once, and accepts one it lists", () => {
        put(LEAF, RELATED);
        put(QUERY, { relations: ["requires"] });
        expect(walkFindings(root, [LEAF], new Set([LEAF, QUERY]))).toStrictEqual([
            { file: LEAF, message: undeclaredRelation("drifts") },
        ]);
    });

    it("accepts a leaf whose every relation the contract lists, and a leaf with no relations", () => {
        put(LEAF, RELATED);
        put("json/pag.json", { title: "PAG" });
        put(QUERY, { relations: ["drifts", "requires"] });
        expect(walkFindings(root, [LEAF, "json/pag.json"], new Set([LEAF, QUERY]))).toStrictEqual([]);
    });

    it("reports every relation when the build published no query contract", () => {
        put(LEAF, RELATED);
        expect(walkFindings(root, [LEAF], new Set([LEAF]))).toHaveLength(2);
    });
});

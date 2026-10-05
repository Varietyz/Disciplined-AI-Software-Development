import { describe, expect, it } from "vitest";
import { collectFiles } from "@govlab/content-fingerprint";
import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { withTemp } from "../converters/fingerprint.fixture.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const KEPT = ".txt";

describe("collectFiles", () => {
    it("returns a sorted file list, descends real dirs, and skips excluded dirs and unmatched names", () => {
        withTemp((dir) => {
            writeVerbatim(join(dir, `b${KEPT}`), "b");
            writeVerbatim(join(dir, `a${KEPT}`), "a");
            writeVerbatim(join(dir, "note.log"), "n");
            mkdirSync(join(dir, "sub"));
            writeVerbatim(join(dir, "sub", `c${KEPT}`), "c");
            mkdirSync(join(dir, "vendored"));
            writeVerbatim(join(dir, "vendored", `d${KEPT}`), "d");
            const found = collectFiles(dir, {
                excluded: (child) => child === join(dir, "vendored"),
                include: (name) => name.endsWith(KEPT),
            });
            expect(found).toStrictEqual([join(dir, `a${KEPT}`), join(dir, `b${KEPT}`), join(dir, "sub", `c${KEPT}`)]);
        });
    });

    it("excludes nothing when the caller declares no exclusion", () => {
        withTemp((dir) => {
            mkdirSync(join(dir, "vendored"));
            writeVerbatim(join(dir, "vendored", `d${KEPT}`), "d");
            expect(collectFiles(dir, { include: (name) => name.endsWith(KEPT) })).toStrictEqual([
                join(dir, "vendored", `d${KEPT}`),
            ]);
        });
    });

    it("answers an empty list for a root it cannot read", () => {
        withTemp((dir) => {
            expect(collectFiles(join(dir, "absent"))).toStrictEqual([]);
        });
    });
});

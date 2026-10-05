import { describe, expect, it } from "vitest";
import { lookupsOf, parsedPartsOf } from "@banes-lab/build-scripts/core/converters/anatomy.index.converter.ts";
import { report, tree } from "./anatomy.fixture.ts";
import type { DiskFolder } from "@banes-lab/build-scripts/types/structure.types.ts";
import { createWalkAssets } from "@banes-lab/build-scripts/core/factories/walk.factory.ts";

const BACKUP = "backup";

const firstFile = function firstFile(folder: DiskFolder): DiskFolder["files"][number] | undefined {
    return folder.files[0] ?? folder.folders.map(firstFile).find((file) => file !== undefined);
};

describe("lookupsOf and parsedPartsOf", () => {
    it("indexes the report by file, and gives an excluded file none of what the parser read", () => {
        const lookups = lookupsOf(
            { cells: new Map(), charts: [], documents: new Map(), entries: [], imports: [], report: report(), tree: tree(), vectors: new Map() },
            createWalkAssets(),
        );
        const file = firstFile(tree());
        if (file === undefined) {
            throw new Error(BACKUP);
        }
        expect(parsedPartsOf(lookups, file).definitions.length).toBeGreaterThan(0);
        expect(parsedPartsOf(lookups, { ...file, excluded: BACKUP })).toStrictEqual({
            definitions: [],
            entry: null,
            findings: [],
        });
    });
});

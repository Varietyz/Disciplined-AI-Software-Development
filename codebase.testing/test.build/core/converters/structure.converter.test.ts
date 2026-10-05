import { FILE_NAME, concernFolder } from "./anatomy.fixture.ts";
import { describe, expect, it } from "vitest";
import {
    fileLayerOf,
    folderLayerOf,
    slotsOf,
    sumStats,
} from "@banes-lab/build-scripts/core/converters/structure.converter.ts";
import { EMPTY_STATS } from "@banes-lab/build-scripts/configuration/constants/anatomy.constants.ts";

describe("slotsOf, fileLayerOf and folderLayerOf", () => {
    it("reads a file's slots and layer from the taxonomy, or none for an exempt name", () => {
        expect(slotsOf(FILE_NAME)).toStrictEqual({ concern: "renderer", subject: "text", variant: null });
        expect(slotsOf("ontology.generated.ts")).toBeNull();
        expect(slotsOf("index.html")).toBeNull();
        expect(fileLayerOf(slotsOf(FILE_NAME))).toBe(folderLayerOf(concernFolder()));
    });
});

describe("sumStats", () => {
    it("sums nothing to an empty count", () => {
        expect(sumStats([EMPTY_STATS, EMPTY_STATS]).files).toBe(0);
    });
});

import { describe, expect, it } from "vitest";
import {
    missingRecording,
    missingSource,
    missingVector,
    missingWalk,
    pruneLine,
} from "@banes-lab/build-scripts/configuration/strings/asset.strings.ts";

describe("pruneLine", () => {
    it("reports the files and bytes the prune removed", () => {
        expect(pruneLine(3, 120)).toBe("prune: removed 3 unreferenced file(s), 120 bytes\n");
    });
});

describe("missingVector, missingWalk and missingSource", () => {
    it("name the asset path a route refers to and the build did not write", () => {
        expect(missingVector("/static/diagram/generated/a.svg")).toContain("/static/diagram/generated/a.svg");
        expect(missingWalk("/static/walk/generated/a.svg")).toContain("no asset at /static/walk/generated/a.svg");
        expect(missingSource("/static/source/generated/a.txt")).toContain("no text at /static/source/generated/a.txt");
        expect(missingRecording("/static/surface/generated/a.json")).toContain(
            "no recording at /static/surface/generated/a.json",
        );
    });
});

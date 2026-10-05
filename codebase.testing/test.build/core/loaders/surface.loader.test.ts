import { describe, expect, it } from "vitest";
import { isRecording } from "@banes-lab/web/core/predicates/surface.predicate.ts";
import { loadRecordings } from "@banes-lab/build-scripts/core/loaders/surface.loader.ts";

describe("loadRecordings", () => {
    it("reads every recording the surfaces step wrote, each one well-formed", () => {
        const recordings = loadRecordings().filter(isRecording);
        expect(recordings.map((recording) => recording.figure).toSorted()).toStrictEqual([
            "delivery",
            "owner",
            "venue",
            "wait",
        ]);
    });
});

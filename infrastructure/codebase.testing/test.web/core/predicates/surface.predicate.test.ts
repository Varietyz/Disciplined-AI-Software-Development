import { describe, expect, it } from "vitest";
import { isRecording } from "@banes-lab/web/core/predicates/surface.predicate.ts";

const FRAME = { command: "npm run await", lines: [{ changed: true, text: "+ A-1" }], output: "", surface: "venue.md" };

describe("isRecording", () => {
    it("accepts a figure with an opening and at least one well-formed frame", () => {
        expect(isRecording({ figure: "venue", frames: [FRAME], inputs: "", opening: ["line"] })).toBe(true);
    });

    it("refuses a recording with no frames, a malformed frame or no opening", () => {
        expect(isRecording({ figure: "venue", frames: [], opening: [] })).toBe(false);
        expect(isRecording({ figure: "venue", frames: [{ ...FRAME, lines: [{ text: 1 }] }], opening: [] })).toBe(false);
        expect(isRecording({ figure: "venue", frames: [FRAME] })).toBe(false);
        expect(isRecording(null)).toBe(false);
    });
});

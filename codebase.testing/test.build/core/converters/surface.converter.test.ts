import {
    CODE_FENCE,
    RECORD_CLOSE,
    RECORD_OPEN,
    ROSTER_LINES,
    SECTION_BANNER,
} from "@banes-lab/build-scripts/configuration/constants/surface.constants.ts";
import {
    appendLine,
    changedRegion,
    commandLine,
    markedLines,
    recordingsOf,
    venueView,
} from "@banes-lab/build-scripts/core/converters/surface.converter.ts";
import { describe, expect, it } from "vitest";
import type { FigureFrame } from "@banes-lab/build-scripts/types/surface.types.ts";

const ROSTER = `${ROSTER_LINES[0] ?? ""} B`;

const frameOf = function frameOf(command: string): FigureFrame["frame"] {
    return { command, lines: [], output: "", surface: "" };
};
const OPEN_A = `${RECORD_OPEN}A`;
const CLOSE_A = `${RECORD_CLOSE}A`;
const TAIL = `${SECTION_BANNER} POSITIONS`;

describe("changedRegion", () => {
    it("names the lines that differ between the prefix and suffix both versions share", () => {
        expect(changedRegion(["a", "b", "c"], ["a", "x", "y", "c"])).toStrictEqual({ from: 1, to: 3 });
        expect(changedRegion(["a", "b"], ["a"])).toStrictEqual({ from: 1, to: 1 });
        expect(changedRegion(["a"], ["a"])).toBeNull();
    });
});

describe("venueView", () => {
    it("keeps the roster lines, the unfenced records and everything from the last section banner on", () => {
        const lines = [
            "# Venue",
            "intro prose",
            ROSTER,
            CODE_FENCE,
            ROSTER,
            `${RECORD_OPEN}SPECIMEN`,
            CODE_FENCE,
            OPEN_A,
            "  status: working",
            CLOSE_A,
            "",
            "prose between",
            `${SECTION_BANNER} OLD`,
            "old entry",
            TAIL,
            "entry one",
        ];
        expect(venueView(lines)).toStrictEqual([ROSTER, OPEN_A, "  status: working", CLOSE_A, "", TAIL, "entry one"]);
    });
});

describe("markedLines and commandLine", () => {
    it("marks the lines inside the region, and quotes an argument that holds a space", () => {
        expect(markedLines(["a", "b", "c"], { from: 1, to: 2 }).map((line) => line.changed)).toStrictEqual([
            false,
            true,
            false,
        ]);
        expect(markedLines(["a"], null)).toStrictEqual([{ changed: false, text: "a" }]);
        expect(commandLine("await", ["--post", "two words"])).toBe('npm run await -- --post "two words"');
        expect(appendLine("a note", "venue.md")).toBe('echo "a note" >> venue.md');
    });
});

describe("recordingsOf", () => {
    it("groups the frames by figure in order, opening each on the view before its first frame", () => {
        const frames: FigureFrame[] = [
            { before: ["first"], figure: "venue", frame: frameOf("one") },
            { before: ["other"], figure: "wait", frame: frameOf("two") },
            { before: ["later"], figure: "venue", frame: frameOf("three") },
        ];
        const recordings = recordingsOf(frames, "digest");
        expect(recordings.get("venue")?.frames.map((entry) => entry.command)).toStrictEqual(["one", "three"]);
        expect(recordings.get("venue")?.opening).toStrictEqual(["first"]);
        expect(recordings.get("wait")?.inputs).toBe("digest");
    });
});

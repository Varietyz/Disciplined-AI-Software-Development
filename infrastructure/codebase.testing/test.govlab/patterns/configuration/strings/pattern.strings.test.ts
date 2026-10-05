import {
    analyzeRefusal,
    analyzeWrote,
    faceCycle,
    faceRegistered,
    faceUnregistered,
    unknownCommand,
    windowWrote,
} from "@govlab/patterns/configuration/strings/pattern.strings.ts";
import { describe, expect, it } from "vitest";

describe("the pattern strings", () => {
    it("name the face each registry refusal concerns", () => {
        for (const line of [faceRegistered("f"), faceCycle("f"), faceUnregistered("f")]) {
            expect(line).toContain('"f"');
        }
    });

    it("name the refused operation and the operations that exist", () => {
        expect(unknownCommand("dance")).toContain('"dance"');
        expect(unknownCommand("dance")).toContain("synthesize");
    });

    it("list the unrepresentable fields and the two ways out", () => {
        const line = analyzeRefusal("a, b");
        expect(line).toContain("a, b");
        expect(line).toContain("--mapping");
    });

    it("report each written output on its own line", () => {
        expect(analyzeWrote("3", "out.json").endsWith("\n")).toBe(true);
        expect(windowWrote("2", "3", "snap.json")).toContain("window 2");
    });
});

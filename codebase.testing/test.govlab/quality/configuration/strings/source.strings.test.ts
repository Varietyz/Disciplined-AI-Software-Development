import {
    builtTargetFailed,
    declarationFailed,
    distImportFailed,
    jsConfigFailed,
    jsGlobFailed,
    jsSourceFailed,
    tsOnlyClean,
} from "@govlab/quality/configuration/strings/source.strings.ts";
import { describe, expect, it } from "vitest";

const COUNT = 2;
const SCANNED = 40;

describe("source strings", () => {
    it("carry the count of each ts-only finding class", () => {
        for (const line of [
            jsSourceFailed(COUNT),
            declarationFailed(COUNT),
            builtTargetFailed(COUNT),
            jsGlobFailed(COUNT),
            jsConfigFailed(COUNT),
            distImportFailed(COUNT),
        ]) {
            expect(line.startsWith("ts-only: 2 ")).toBe(true);
        }
        expect(tsOnlyClean(SCANNED)).toContain("40 files scanned");
    });
});

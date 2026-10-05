import {
    GENERATED_NAME_MARKER,
    GENERATED_SEGMENT_MARKER,
    HEAD_BYTES,
    HEAD_MARKERS,
    LOCKFILES,
    MANIFEST_FILE,
    README_FILE,
    SNIFF_BYTES,
    TEST_FOLDER,
    TEST_NAME_MARKERS,
    TEST_NAME_SUFFIX,
} from "@govlab/stats/configuration/constants/source.constants.ts";
import { afterAll, describe, expect, it } from "vitest";
import {
    isBinaryBuffer,
    isGeneratedHead,
    isGeneratedPath,
    isTestFile,
} from "@govlab/stats/core/predicates/source.predicate.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "source-predicate-"));

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("isGeneratedPath", () => {
    it("detects the generated marker in the filename and a generated folder", () => {
        expect(isGeneratedPath(join(root, `a${GENERATED_NAME_MARKER}ts`), `a${GENERATED_NAME_MARKER}ts`)).toBe(true);
        expect(isGeneratedPath(join(root, "x.ts"), join(GENERATED_SEGMENT_MARKER, "x.ts"))).toBe(true);
        expect(isGeneratedPath(join(root, "generated.ts"), "generated.ts")).toBe(false);
    });

    it("treats every lockfile as generated", () => {
        for (const lockfile of LOCKFILES) {
            expect(isGeneratedPath(join(root, lockfile), lockfile)).toBe(true);
        }
    });

    it("treats a README beside a module manifest as generated, and one without as authored", () => {
        const governed = join(root, "governed");
        const plain = join(root, "plain");
        mkdirSync(governed, { recursive: true });
        mkdirSync(plain, { recursive: true });
        writeVerbatim(join(governed, MANIFEST_FILE), "{}");
        expect(isGeneratedPath(join(governed, README_FILE), join("governed", README_FILE))).toBe(true);
        expect(isGeneratedPath(join(plain, README_FILE), join("plain", README_FILE))).toBe(false);
    });
});

describe("isGeneratedHead", () => {
    it("detects each marker in the head regardless of case", () => {
        for (const marker of HEAD_MARKERS) {
            expect(isGeneratedHead(`// ${marker.toUpperCase()}\n`)).toBe(true);
        }
    });

    it("reads the head only, so a later mention does not misclassify a file", () => {
        expect(isGeneratedHead(`${"x".repeat(HEAD_BYTES)}do not edit`)).toBe(false);
    });
});

describe("isBinaryBuffer", () => {
    it("finds a null byte inside the sniffed head and ignores one past it", () => {
        expect(isBinaryBuffer(Buffer.from([1, 0, 2]))).toBe(true);
        expect(isBinaryBuffer(Buffer.from("text"))).toBe(false);
        const pastHead = Buffer.concat([Buffer.alloc(SNIFF_BYTES, 1), Buffer.from([0])]);
        expect(isBinaryBuffer(pastHead)).toBe(false);
    });
});

describe("isTestFile", () => {
    it("recognizes a test by its name marker, its suffix, its folder or the test member", () => {
        for (const marker of TEST_NAME_MARKERS) {
            expect(isTestFile(`a${marker}ts`, "a", "tests")).toBe(true);
        }
        expect(isTestFile(`main${TEST_NAME_SUFFIX}`, "main", "tests")).toBe(true);
        expect(isTestFile("a.ts", join(TEST_FOLDER, "a.ts"), "tests")).toBe(true);
        expect(isTestFile("a.ts", join("tests", "a.ts"), "tests")).toBe(true);
        expect(isTestFile("a.ts", join("src", "a.ts"), "tests")).toBe(false);
    });
});

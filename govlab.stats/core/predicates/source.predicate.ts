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
} from "#configuration/constants/source.constants";
import { existsSync } from "node:fs";
import path from "node:path";

const hasGeneratedSegment = function hasGeneratedSegment(rel: string): boolean {
    return rel
        .split(path.sep)
        .slice(0, -1)
        .some((segment) => segment.toLowerCase().includes(GENERATED_SEGMENT_MARKER));
};

export const isGeneratedHead = function isGeneratedHead(text: string): boolean {
    const head = text.slice(0, HEAD_BYTES).toLowerCase();
    return HEAD_MARKERS.some((marker) => head.includes(marker));
};

export const isGeneratedPath = function isGeneratedPath(abs: string, rel: string): boolean {
    const base = path.basename(rel).toLowerCase();
    if (base.includes(GENERATED_NAME_MARKER) || LOCKFILES.has(base) || hasGeneratedSegment(rel)) {
        return true;
    }
    return base === README_FILE && existsSync(path.join(path.dirname(abs), MANIFEST_FILE));
};

export const isBinaryBuffer = function isBinaryBuffer(buffer: Buffer): boolean {
    return buffer.subarray(0, SNIFF_BYTES).includes(0);
};

export const isTestFile = function isTestFile(name: string, rel: string, testMember: string): boolean {
    const lower = name.toLowerCase();
    if (TEST_NAME_MARKERS.some((marker) => lower.includes(marker)) || lower.endsWith(TEST_NAME_SUFFIX)) {
        return true;
    }
    const segments = rel.split(path.sep);
    return segments.includes(TEST_FOLDER) || segments.join("/").startsWith(`${testMember}/`);
};

import { describe, expect, it } from "vitest";
import {
    digestOf,
    digestedFileName,
    extensionOf,
    stripCompression,
    toPosix,
} from "@banes-lab/build-scripts/core/resolvers/asset.resolver.ts";

const SCRIPT = "assets/a.js";

describe("digestOf and digestedFileName", () => {
    it("places the content digest between the stem and the extension", () => {
        expect(digestedFileName("a.", "x", ".b")).toBe(`a.${digestOf("x")}.b`);
        expect(digestOf("x")).not.toBe(digestOf("y"));
    });
});

describe("toPosix, extensionOf and stripCompression", () => {
    it("normalizes separators, reads the last extension and drops a precompressed suffix", () => {
        expect(toPosix(String.raw`assets\a.js`)).toBe(SCRIPT);
        expect(extensionOf(`${SCRIPT}.gz`)).toBe(".gz");
        expect(extensionOf("README")).toBe("");
        expect(stripCompression(`${SCRIPT}.gz`)).toBe(SCRIPT);
        expect(stripCompression(`${SCRIPT}.br`)).toBe(SCRIPT);
        expect(stripCompression(SCRIPT)).toBe(SCRIPT);
    });
});

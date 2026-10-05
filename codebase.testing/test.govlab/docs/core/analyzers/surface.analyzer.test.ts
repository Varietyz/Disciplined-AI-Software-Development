import { ROOT, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { readPublicSurface } from "@govlab/docs/core/analyzers/surface.analyzer.ts";
import { resolve } from "node:path";

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const surfaceOf = function surfaceOf(rel: string): ReturnType<typeof readPublicSurface> {
    const moduleDir = resolve(ROOT, rel);
    const parsed: unknown = JSON.parse(readFileSync(resolve(moduleDir, "package.json"), "utf8"));
    return readPublicSurface(moduleDir, isRecord(parsed) ? parsed : {});
};

describe("readPublicSurface", () => {
    it("reads a leaf module from source and tells functions from constants", () => {
        const { surface } = surfaceOf(relativePath("govlab.utils.contentFingerprint"));
        const byName = new Map(surface.map((entry) => [entry.name, entry]));
        expect(byName.get("fingerprint")?.kind).toBe("fn");
        expect(byName.get("fingerprint")?.signature.startsWith("function fingerprint(")).toBe(true);
        expect(byName.get("ABSENT_SENTINEL")?.kind).toBe("const");
        expect(surface.every((entry) => !entry.signature.includes("\n"))).toBe(true);
    });

    it("yields an empty surface for a folder with no resolvable barrel", () => {
        expect(readPublicSurface(resolve(ROOT, "nope-does-not-exist"), {}).surface).toStrictEqual([]);
    });
});

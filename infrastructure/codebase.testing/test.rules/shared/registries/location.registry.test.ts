import {
    LOCATION_TOKENS,
    MEMBER_ROOTS,
    keyForLocation,
    locationForKey,
    toPosix,
    tokenIn,
} from "@ssot/govlab/shared/registries/location.registry.ts";
import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { relativePath } from "@ssot/paths";

const SUITE_ROOT = "govlab.root";

describe("MEMBER_ROOTS", () => {
    it("names every workspace member the paths SSOT declares", () => {
        expect(MEMBER_ROOTS.length).toBeGreaterThan(0);
        expect(MEMBER_ROOTS).toContain(relativePath("app.member"));
        expect(MEMBER_ROOTS).toContain(relativePath("codebase.testing"));
    });
});

describe("LOCATION_TOKENS", () => {
    it("draws from the paths SSOT", () => {
        expect(LOCATION_TOKENS).toContain("doc-arch");
        expect(LOCATION_TOKENS).toContain(relativePath("app.member"));
    });

    it("also draws from the workspaces list, so a member with no paths key is still a location", () => {
        expect(LOCATION_TOKENS).toContain(".govlab");
        expect(LOCATION_TOKENS).toContain(SUITE_ROOT);
        expect(LOCATION_TOKENS).toContain("govlab.root/govlab.quality");
    });

    it("orders longest first so the most specific location wins", () => {
        const lengths = LOCATION_TOKENS.map((token) => token.length);
        expect(lengths).toEqual([...lengths].sort((a, b) => b - a));
    });

    it("holds no empty entry, since an empty token would match every path", () => {
        expect(LOCATION_TOKENS.every((token) => token.length > 0)).toBe(true);
    });
});

describe("keyForLocation and locationForKey", () => {
    it("round-trips a declared location back to the key that owns it", () => {
        const location = relativePath("app.member");
        const key = keyForLocation(location);
        expect(key).not.toBeNull();
        expect(key === null ? null : locationForKey(key)).toBe(location);
    });

    it("resolves a platform-separated location too", () => {
        const location = relativePath("app.member");
        expect(keyForLocation(location.split("/").join("\\"))).toBe(keyForLocation(location));
    });

    it("returns null for a location the SSOT does not declare", () => {
        expect(keyForLocation(["not", "a", "declared", "location"].join("/"))).toBeNull();
    });

    it("returns null for a key the SSOT does not declare", () => {
        expect(locationForKey("govlab.nope")).toBeNull();
    });
});

describe("tokenIn", () => {
    it("matches a value that is exactly a location", () => {
        expect(tokenIn(SUITE_ROOT)).toBe(SUITE_ROOT);
    });

    it("matches a location at the start of a path", () => {
        expect(tokenIn("govlab.root/some-folder")).toBe(SUITE_ROOT);
    });

    it("matches a location in the middle of a path", () => {
        expect(tokenIn("/repo/govlab.root/some-folder")).toBe(SUITE_ROOT);
    });

    it("prefers the most specific declared location", () => {
        expect(tokenIn("govlab.root/govlab.utils/code-parse/index.ts")).toBe("govlab.root/govlab.utils/code-parse");
        expect(tokenIn("govlab.root/govlab.quality")).toBe("govlab.root/govlab.quality");
        expect(tokenIn("govlab.root/undeclared-sibling")).toBe(SUITE_ROOT);
    });

    it("matches a location at the end of a path", () => {
        expect(tokenIn("/repo/govlab.root")).toBe(SUITE_ROOT);
        expect(tokenIn("some/path/.govlab")).toBe(".govlab");
    });

    it("normalizes windows separators before matching", () => {
        expect(tokenIn(String.raw`repo\govlab.root\some-folder`)).toBe(SUITE_ROOT);
    });

    it("does not match a value that merely shares a prefix", () => {
        expect(tokenIn("govlab.rootsite/src")).toBeNull();
    });

    it("returns null for a value naming no workspace location", () => {
        expect(tokenIn("some/unrelated/folder")).toBeNull();
        expect(tokenIn("")).toBeNull();
    });
});

describe("toPosix", () => {
    it("rewrites backslashes so every comparison is on one separator", () => {
        expect(toPosix(String.raw`a\b\c`)).toBe("a/b/c");
        expect(toPosix("a/b")).toBe("a/b");
        expect(toPosix(join("a", "b"))).toBe(["a", "b"].join("/"));
    });
});

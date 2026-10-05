import {
    cacheForced,
    createDocIndex,
    moduleKey,
    selectStaleModules,
    workspaceMapKey,
} from "@govlab/docs/core/caches/readme.cache.ts";
import { describe, expect, it } from "vitest";
import { relativePath } from "@ssot/paths";

const QUALITY = relativePath("govlab.quality");
const DOCS = relativePath("govlab.docs");
const PATTERNS = relativePath("govlab.patterns");
const CODE_PARSE = relativePath("govlab.utils.codeParse");
const MODULES = [QUALITY, DOCS];

describe("moduleKey and workspaceMapKey", () => {
    it("derive stable keys that differ by member and by member set", () => {
        expect(moduleKey(QUALITY, MODULES)).toBe(moduleKey(QUALITY, MODULES));
        expect(moduleKey(QUALITY, MODULES)).not.toBe(moduleKey(DOCS, MODULES));
        expect(moduleKey("no-such-member", MODULES).length).toBeGreaterThan(0);
        expect(workspaceMapKey([QUALITY, DOCS])).toBe(workspaceMapKey([QUALITY, DOCS]));
        expect(workspaceMapKey([QUALITY])).not.toBe(workspaceMapKey([QUALITY, DOCS]));
    });

    it("covers the source of every workspace member the module depends on, because its charts follow them", () => {
        expect(moduleKey(PATTERNS, [PATTERNS, CODE_PARSE])).not.toBe(moduleKey(PATTERNS, [PATTERNS]));
    });
});

describe("selectStaleModules", () => {
    it("selects an unseen or unkeyed module, and nothing from an empty list", () => {
        const keyed = new Map([[QUALITY, moduleKey(QUALITY, MODULES)]]);
        expect(selectStaleModules(createDocIndex(true), [QUALITY], keyed)).toStrictEqual([QUALITY]);
        expect(selectStaleModules(createDocIndex(true), [QUALITY], new Map())).toStrictEqual([QUALITY]);
        expect(selectStaleModules(createDocIndex(true), [], new Map())).toStrictEqual([]);
    });
});

describe("cacheForced", () => {
    it("answers whether the given environment forces a fresh generation", () => {
        expect(cacheForced({ GOVLAB_NO_CACHE: "1" })).toBe(true);
        expect(cacheForced({})).toBe(false);
    });
});

import {
    DEPENDENCY_FIELDS,
    PACKAGE_MANIFEST,
    WILDCARD,
    WORKSPACES_KEY,
} from "@govlab/stats/configuration/constants/package.constants.ts";
import { ROOT, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { memberIndex, ownerOf, workspaceMembers } from "@govlab/stats/core/resolvers/package.resolver.ts";
import { BARE } from "../loaders/stats.fixture.ts";

describe("the package resolver", () => {
    it("finds the members the root manifest's workspaces globs declare, and none for a bare root", () => {
        expect(workspaceMembers(ROOT).length).toBeGreaterThan(0);
        expect(workspaceMembers(BARE)).toStrictEqual([]);
        expect(WORKSPACES_KEY).toBe("workspaces");
        expect(PACKAGE_MANIFEST).toBe("package.json");
        expect(WILDCARD).toHaveLength(1);
        expect(DEPENDENCY_FIELDS).toContain("dependencies");
    });

    it("orders the index longest first, so the most specific member owns a path", () => {
        const index = memberIndex(ROOT);
        const lengths = index.map((entry) => entry.length);
        expect(lengths).toStrictEqual(lengths.toSorted((a, b) => b - a));
        const quality = relativePath("govlab.quality");
        expect(ownerOf(index, `${quality}/src/probe.ts`)).toBe(quality);
        expect(ownerOf(index, "not-a-member/probe.ts")).toBeNull();
    });
});

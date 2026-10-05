import {
    INSIDE_WORK_TREE,
    SHORTLOG_SEPARATOR,
    VCS_BINARY,
    VCS_QUERIES,
    WORKSPACE_LABEL,
} from "@govlab/stats/configuration/constants/vcs.constants.ts";
import { describe, expect, it } from "vitest";
import { BARE } from "../loaders/stats.fixture.ts";
import { collectGit } from "@govlab/stats/core/adapters/vcs.adapter.ts";

describe("collectGit", () => {
    it("reports no repository for a folder outside every work tree", () => {
        expect(collectGit(BARE)).toBeNull();
    });

    it("reads its commands from declared queries", () => {
        expect(Object.keys(VCS_QUERIES)).toContain("inside");
        expect(new Set([VCS_BINARY, INSIDE_WORK_TREE, SHORTLOG_SEPARATOR, WORKSPACE_LABEL]).size).toBe(4);
    });
});

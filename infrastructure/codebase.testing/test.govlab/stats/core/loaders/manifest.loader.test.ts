import { BARE, INPUT } from "./stats.fixture.ts";
import { describe, expect, it } from "vitest";
import { collectWorkspace } from "@govlab/stats/core/loaders/manifest.loader.ts";

describe("collectWorkspace", () => {
    it("counts the governed modules and never more with docs than in total", () => {
        expect(INPUT.workspace.total).toBeGreaterThan(0);
        expect(INPUT.workspace.withDocs + INPUT.workspace.missingDocs.length).toBe(INPUT.workspace.total);
        expect(INPUT.workspace.withReadme + INPUT.workspace.missingReadme.length).toBe(INPUT.workspace.total);
    });

    it("counts nothing for a root with no workspace", () => {
        expect(collectWorkspace(BARE).total).toBe(0);
    });
});

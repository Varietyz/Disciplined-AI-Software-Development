import {
    activeVenues,
    authoredSurfaces,
    planningSurfaces,
} from "coordination-surface/tools/core/filters/checklist.filter.ts";
import { describe, it } from "vitest";
import { PLANNING_ROOTS } from "coordination-surface/tools/core/constants/checklist.constants.ts";
import { VENUE_ARCHIVE } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import assert from "node:assert/strict";
import { surfacePath } from "coordination-surface/config/surface.config.ts";

describe("planningSurfaces and activeVenues", () => {
    it("keep the Markdown files directly in a planning root, and the venues outside the archive, by name", () => {
        const planning = PLANNING_ROOTS.at(-1) ?? "";
        assert.deepEqual(
            planningSurfaces([`${planning}/b.md`, `${planning}/a.md`, `${planning}/deeper/c.md`, `${planning}/d.txt`]),
            [`${planning}/a.md`, `${planning}/b.md`],
        );
        assert.deepEqual(activeVenues(["z.blocking.md", `${VENUE_ARCHIVE}y.blocking.md`, "a.blocking.md", "x.md"]), [
            "a.blocking.md",
            "z.blocking.md",
        ]);
    });
});

describe("authoredSurfaces", () => {
    it("keeps the rewritable Markdown files and drops the frozen archive", () => {
        const archived = `${surfacePath("archive")}/old.md`;
        assert.deepEqual(authoredSurfaces(["notes/b.md", archived, "notes/a.md", "notes/c.txt"]), [
            "notes/a.md",
            "notes/b.md",
        ]);
    });
});

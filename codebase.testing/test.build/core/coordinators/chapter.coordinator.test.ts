import { describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { renderSurfaces, surfacesKey } from "@banes-lab/build-scripts/core/coordinators/chapter.coordinator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const mocks = vi.hoisted(() => ({ inputs: [] as string[], rendered: [] as string[] }));

vi.mock("@banes-lab/content/core/coordinators/chapter.coordinator.ts", () => ({
    renderSurface: async (shape: string) => {
        await Promise.resolve();
        mocks.rendered.push(shape);
        return { chapters: [{ file: "a.md" }], ok: true, out: `/out/${shape}`, removed: [] };
    },
}));

vi.mock("@banes-lab/content/core/loaders/chapter.loader.ts", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    surfaceInputFiles: () => mocks.inputs,
}));

describe("renderSurfaces", () => {
    it("renders every shape in this process, repository first, and reports each", async () => {
        mocks.rendered.length = 0;
        const line = await renderSurfaces();
        expect(mocks.rendered).toStrictEqual(["repository", "wiki"]);
        expect(line).toContain("1 repository chapter(s) into /out/repository");
        expect(line).toContain("1 wiki chapter(s) into /out/wiki");
    });
});

describe("surfacesKey", () => {
    it("stays the same while the inputs hold and moves when one changes", () => {
        const folder = mkdtempSync(join(tmpdir(), "surfaces-"));
        const input = join(folder, "page.md");
        writeVerbatim(input, "one");
        mocks.inputs.splice(0, mocks.inputs.length, input);
        const first = surfacesKey();
        expect(surfacesKey()).toBe(first);
        writeVerbatim(input, "two");
        const moved = surfacesKey();
        rmSync(folder, { force: true, recursive: true });
        expect(moved).not.toBe(first);
    });
});

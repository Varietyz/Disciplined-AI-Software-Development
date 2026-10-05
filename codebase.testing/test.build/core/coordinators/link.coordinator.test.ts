import {
    bakedTabsOf,
    createRelinker,
    writeLinkedPages,
} from "@banes-lab/build-scripts/core/coordinators/link.coordinator.ts";
import { describe, expect, it, vi } from "vitest";
import { join } from "node:path";

vi.mock("@banes-lab/build-scripts/core/factories/server.factory.ts", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    moduleServer: vi.fn(async () => {
        await Promise.resolve();
        throw new Error("no server in this test");
    }),
}));

const ROOT = join("probe", "web");
const LINKED = { stem: "methodology.page", tabs: [] };
const INDEX = { nodes: {} };

const MODULES: ReadonlyMap<string, unknown> = new Map<string, unknown>([
    ["site.strings", { ANATOMY_INDEX: INDEX, BAKED_TABS: [], CHAPTER_PAGES: [], LINKED_PAGES: [] }],
    ["vocabulary.generated", { VOCABULARY: [] }],
    ["link.vocabulary.converter", { linkPages: () => [LINKED] }],
]);

const isModule = function isModule<T>(value: unknown): value is T {
    return typeof value === "object" && value !== null;
};

const importer = {
    import: async <T>(url: string): Promise<T> => {
        await Promise.resolve();
        const found = [...MODULES].find(([marker]) => url.includes(marker));
        const module: unknown = found?.[1];
        if (!isModule<T>(module)) {
            throw new TypeError(url);
        }
        return module;
    },
};

const settled = async function settled(): Promise<void> {
    await new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
};

describe("bakedTabsOf", () => {
    it("links the chapter pages through the member's own linker and counts the pages it linked", async () => {
        const baked = await bakedTabsOf(importer);
        expect(baked.pages).toBe(1);
        expect(baked.entries).toStrictEqual([LINKED]);
        expect(baked.index).toBe(INDEX);
    });
});

describe("writeLinkedPages", () => {
    it("fails with the server's own error when no module server starts", async () => {
        await expect(writeLinkedPages(ROOT)).rejects.toThrow("no server in this test");
    });
});

describe("createRelinker", () => {
    it("relinks only for a source file inside the member, one run for a burst of changes, and reports a failed run", async () => {
        const report = vi.fn<(error: unknown) => void>();
        const relink = createRelinker(ROOT, report);
        relink(join("probe", "elsewhere", "a.ts"));
        relink(join(ROOT, "core", "assets", "methodology.page.generated.ts"));
        relink(ROOT);
        await settled();
        expect(report).not.toHaveBeenCalled();
        relink(join(ROOT, "configuration", "strings", "site.strings.ts"));
        relink(join(ROOT, "configuration", "strings", "loop.strings.ts"));
        await settled();
        expect(report).toHaveBeenCalledTimes(1);
        relink(join(ROOT, "configuration", "strings", "loop.strings.ts"));
        await settled();
        expect(report).toHaveBeenCalledTimes(2);
    });
});

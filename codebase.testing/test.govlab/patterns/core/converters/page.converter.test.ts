import { describe, expect, it } from "vitest";
import { pageBaseName, planNode } from "@govlab/patterns/core/converters/page.converter.ts";
import { INLINE_THRESHOLD } from "@govlab/patterns/configuration/constants/report.constants.ts";
import { buildGroup } from "@govlab/patterns/core/converters/folder.converter.ts";
import { entry } from "./package.fixture.ts";

const SMALL = 20;
const FILES = 8;
const PER_FILE = Math.ceil(INLINE_THRESHOLD / FILES) + 1;

describe("the page planner", () => {
    it("names the root page and joins nested folders into one page name", () => {
        expect(pageBaseName("")).toBe("code");
        expect(pageBaseName("core/deep")).toBe("core__deep");
    });

    it("inlines a small module into one page", () => {
        const pages = planNode(buildGroup([entry("index.ts", SMALL)], "", "mod"), []);
        expect(pages.map((page) => page.page)).toStrictEqual(["code"]);
    });

    it("drills an oversized folder into its own page with a crumb back", () => {
        const entries = Array.from({ length: FILES }, (_, index) => entry(`core/rule-${index}.ts`, PER_FILE));
        const pages = planNode(buildGroup(entries, "", "mod"), []);
        expect(pages.map((page) => page.page)).toStrictEqual(["code", "core"]);
        expect(pages[1]?.crumbs).toStrictEqual([{ label: "mod", page: "code" }]);
    });
});

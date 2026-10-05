import { describe, expect, it } from "vitest";
import { packageSections, readSections, sitePages } from "@banes-lab/content/core/loaders/section.loader.ts";
import { absolutePath } from "@ssot/paths";

const PACKAGE_PAGE = "coordination-surface";

describe("sitePages", () => {
    it("lists every page id the site declares", async () => {
        const pages = await sitePages();
        expect(pages).toContain("home");
        expect(pages).toContain("disciplined-methodology");
    });
});

describe("readSections", () => {
    it("names a page without a built payload as missing instead of reading it as empty", () => {
        const { missing, sections } = readSections(["no-such-page"]);
        expect(missing).toStrictEqual(["no-such-page"]);
        expect(sections).toStrictEqual([]);
    });
});

describe("packageSections", () => {
    it("reads the Coordination Surface's README sections and every shipped strings module", async () => {
        const sections = await packageSections(absolutePath("app.coordination"));
        const keys = sections.map((section) => section.key);
        expect(sections.every((section) => section.page === PACKAGE_PAGE)).toBe(true);
        expect(keys).toContain(`${PACKAGE_PAGE}#README.md`);
        expect(keys).toContain(`${PACKAGE_PAGE}#tools/core/strings/board.strings.ts`);
        expect(new Set(keys).size).toBe(keys.length);
    });
});

import { describe, expect, it } from "vitest";
import { GENERIC_LINK_TEXT } from "@banes-lab/web/configuration/constants/link.constants.ts";
import { checkLinkNames } from "@banes-lab/build-scripts/core/validators/element.validator.ts";

const FILE = "index.html";

describe("checkLinkNames", () => {
    it("accepts a link named by its text, its aria-label, an image's alt or its title", () => {
        const html = `<a href="/a">The methodology</a><a href="/b" aria-label="Methodology"><i></i></a><a href="/c"><img alt="PAG" src="/x.png"></a><a href="/d" title="Terms"><i></i></a>`;
        expect(checkLinkNames(FILE, html)).toStrictEqual([]);
    });

    it("reports a link with no discernible name", () => {
        const findings = checkLinkNames(FILE, `<a href="/methodology"><i class="bi-cpu"></i></a>`);
        expect(findings).toHaveLength(1);
        expect(findings[0]?.message).toContain("/methodology");
    });

    it("reports a link whose whole text is a generic phrase, whatever its case and spacing", () => {
        expect(checkLinkNames(FILE, `<a href="/m">  Start </a><a href="/n">Read   More</a>`)).toHaveLength(2);
        expect(GENERIC_LINK_TEXT.has("start")).toBe(true);
    });

    it("accepts a generic word once the link text carries its context", () => {
        const html = `<a href="/m">Start<span class="visually-hidden"> — Methodology</span></a>`;
        expect(checkLinkNames(FILE, html)).toStrictEqual([]);
    });
});

import {
    CONTACT_CLOSING,
    CREATIVE_COMMONS_LICENSE,
    GRAMMAR_LICENSE,
    MODEL_CLOSING,
    USE_CLOSING,
} from "@banes-lab/web/configuration/strings/page.strings.ts";
import { LICENSE_PAGE, TERMS_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { describe, expect, it } from "vitest";
import { PROFILE_LINKS } from "@banes-lab/web/configuration/icons/company.icons.ts";
import { pagePath } from "@banes-lab/web/core/assets/link.assets.ts";
import { renderSiteFooter } from "@banes-lab/web/presentation/renderers/site.renderer.ts";

const CLOSING_SELECTOR = ".site-closing";
const LICENSE_SELECTOR = ".site-license";
const BADGE_SELECTOR = ".license-badge";
const COPYRIGHT_SELECTOR = ".site-copyright";

describe("renderSiteFooter", () => {
    it("is one grid of the model, use and contact cells, in that order", () => {
        const footer = renderSiteFooter();
        expect(footer.children).toHaveLength(1);
        const cells = [...(footer.querySelector(CLOSING_SELECTOR)?.children ?? [])];
        expect(cells.map((cell) => cell.querySelector("h3")?.textContent)).toStrictEqual([
            MODEL_CLOSING.title,
            USE_CLOSING.title,
            CONTACT_CLOSING.title,
        ]);
    });

    it("leaves the copyright out of the grid", () => {
        expect(renderSiteFooter().querySelector(COPYRIGHT_SELECTOR)).toBeNull();
    });

    it("stacks the contact terms and ends on the profile links, the mail link first", () => {
        const contact = renderSiteFooter().querySelector(CLOSING_SELECTOR)?.lastElementChild;
        expect(contact?.querySelectorAll(".closing-line")).toHaveLength(CONTACT_CLOSING.terms.length);
        expect(contact?.querySelector("a")?.getAttribute("href")).toContain("mailto:");
        const profiles = [...(contact?.querySelectorAll(".profile-link") ?? [])].map((link) =>
            link.getAttribute("href"),
        );
        expect(profiles).toStrictEqual(PROFILE_LINKS.map((link) => link.href));
    });

    it("links the platform pages inside the use cell", () => {
        const use = renderSiteFooter().querySelector(CLOSING_SELECTOR)?.children[1];
        const hrefs = [...(use?.querySelectorAll("a") ?? [])].map((link) => link.getAttribute("href"));
        expect(hrefs).toContain(pagePath(TERMS_PAGE));
    });

    it("carries no license notice for a page that declares none", () => {
        expect(renderSiteFooter().querySelector(LICENSE_SELECTOR)).toBeNull();
    });

    it("renders a declared license as one line of its lead, its name and its badges", () => {
        const notice = renderSiteFooter(CREATIVE_COMMONS_LICENSE).querySelector(LICENSE_SELECTOR);
        expect(notice?.textContent).toContain(CREATIVE_COMMONS_LICENSE.lead + CREATIVE_COMMONS_LICENSE.name);
        expect(notice?.querySelectorAll(BADGE_SELECTOR)).toHaveLength(CREATIVE_COMMONS_LICENSE.badges.length);
    });

    it("links a license held on this site to its page and shows no badges for it", () => {
        const notice = renderSiteFooter(GRAMMAR_LICENSE).querySelector(LICENSE_SELECTOR);
        const hrefs = [...(notice?.querySelectorAll("a") ?? [])].map((link) => link.getAttribute("href"));
        expect(hrefs).toContain(pagePath(LICENSE_PAGE));
        expect(notice?.querySelectorAll(BADGE_SELECTOR)).toHaveLength(0);
    });
});

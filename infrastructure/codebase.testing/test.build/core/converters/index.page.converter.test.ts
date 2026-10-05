import { DISCOVERY, METHOD, SITE, entry } from "./index.fixture.ts";
import { describe, expect, it } from "vitest";
import { pageIndexPlans, tabIndexPlans } from "@banes-lab/build-scripts/core/converters/index.page.converter.ts";
import { indexLeaves } from "@banes-lab/build-scripts/core/converters/index.converter.ts";
import { sectionPlans } from "@banes-lab/build-scripts/core/converters/section.converter.ts";

describe("tabIndexPlans and pageIndexPlans", () => {
    it("lists a tab's sections under the tab and the tabs under a tabbed page", () => {
        const plans = sectionPlans(DISCOVERY, () => null);
        const entries = new Map([
            ["chapter:/method#loop", entry("chapter:/method#loop", "loop")],
            ["chapter:/method/build#gate", entry("chapter:/method/build#gate", "gate")],
            ["api:/method/start", entry("api:/method/start", "start")],
            ["api:/method/build", entry("api:/method/build", "build")],
        ]);
        const tabs = indexLeaves(tabIndexPlans(DISCOVERY, plans), entries, SITE);
        expect(tabs.map((leaf) => leaf.identity.address.json)).toStrictEqual([
            "/json/api/pages/method/start",
            "/json/api/pages/method/build",
        ]);
        expect(tabs[1]?.data).toMatchObject({
            entries: [{ ref: "chapter:/method/build#gate" }],
            title: "Method · Build",
        });
        const [page] = indexLeaves(pageIndexPlans(DISCOVERY, plans), entries, SITE);
        expect(page?.data).toMatchObject({
            entries: [{ ref: "api:/method/start" }, { ref: "api:/method/build" }],
            tabbed: true,
        });
        expect(page?.markdown).toContain(`Page as Markdown: ${SITE}/method.md`);
    });

    it("lists every other page under the home page, and refuses an index that lists nothing", () => {
        const home = { ...METHOD, content: {}, id: "home", label: "Home", page: "home", path: "/" };
        const discovery = { ...DISCOVERY, pages: [home, METHOD], routes: [home, ...DISCOVERY.routes] };
        const plans = pageIndexPlans(
            discovery,
            sectionPlans(discovery, () => null),
        );
        expect(plans.find((plan) => plan.identity.ref === "api:/home")?.refs).toStrictEqual(["api:/method"]);
        const homePlan = plans.filter((plan) => plan.identity.ref === "api:/home");
        expect(() => indexLeaves(homePlan, new Map(), SITE)).toThrow("api:/home");
        const listed = indexLeaves(homePlan, new Map([["api:/method", entry("api:/method", "method")]]), SITE);
        expect(listed[0]?.data).toMatchObject({ entries: [{ ref: "api:/method" }] });
    });
});

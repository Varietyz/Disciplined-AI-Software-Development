import { afterEach, describe, expect, it } from "vitest";
import { CITED_PANEL_CLASS } from "@banes-lab/web/configuration/constants/chapter.constants.ts";
import { mountCite } from "@banes-lab/web/presentation/widgets/citation.widget.ts";

const setUp = function setUp(): { readonly cite: HTMLElement; readonly panel: HTMLElement } {
    document.body.innerHTML =
        '<p><a class="chapter-cite" href="#loop-panel-a"><span class="chapter-mark">A1·a</span>ten nodes</a></p><div id="loop-panel-a" class="chapter-panel"></div>';
    const cite = document.querySelector<HTMLElement>(".chapter-cite");
    const panel = document.getElementById("loop-panel-a");
    if (cite === null || panel === null) {
        throw new Error("fixture missing");
    }
    return { cite, panel };
};

describe("mountCite", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("highlights the cited panel while the citation is hovered, and releases it on leave", () => {
        const dispose = mountCite();
        const { cite, panel } = setUp();
        cite.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        expect(panel.classList.contains(CITED_PANEL_CLASS)).toBe(true);
        cite.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
        expect(panel.classList.contains(CITED_PANEL_CLASS)).toBe(false);
        dispose();
    });

    it("highlights through keyboard focus as well as the pointer", () => {
        const dispose = mountCite();
        const { cite, panel } = setUp();
        cite.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
        expect(panel.classList.contains(CITED_PANEL_CLASS)).toBe(true);
        dispose();
    });

    it("stops highlighting once disposed", () => {
        mountCite()();
        const { cite, panel } = setUp();
        cite.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        expect(panel.classList.contains(CITED_PANEL_CLASS)).toBe(false);
    });
});

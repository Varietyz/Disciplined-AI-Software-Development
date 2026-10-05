import "@banes-lab/web/presentation/records/grammar.record.ts";
import { afterEach, describe, expect, it } from "vitest";
import { mountTabSwitching, renderTabbedPage } from "@banes-lab/web/presentation/widgets/tab.widget.ts";
import { ACTIVE_CLASS } from "@banes-lab/web/configuration/constants/element.constants.ts";
import { GRAMMAR_META } from "@banes-lab/web/configuration/strings/tab.strings.ts";
import { GRAMMAR_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { GRAMMAR_TABS } from "@banes-lab/web/core/generated/grammar.page.generated.ts";
import { GRAMMAR_TONE } from "@banes-lab/web/configuration/constants/tab.constants.ts";
import { TAB_SELECTED } from "@banes-lab/web/core/ids/tab.ids.ts";
import type { TabbedPage } from "@banes-lab/web/types/tab.types.ts";
import { emitEvent } from "@banes-lab/web/core/buses/base.bus.ts";
import { loadPage } from "@banes-lab/web/domain/registries/page.registry.ts";
import { tabLink } from "@banes-lab/web/core/assets/link.assets.ts";

await loadPage(GRAMMAR_PAGE);

const BUTTON_CLASS = "tab-button";
const DEFINITION: TabbedPage = {
    layout: "grid",
    meta: GRAMMAR_META,
    page: GRAMMAR_PAGE,
    tabs: GRAMMAR_TABS,
    tone: GRAMMAR_TONE,
};

const [, SECOND] = GRAMMAR_TABS;

const activeButtons = function activeButtons(root: Element): readonly Element[] {
    return [...root.querySelectorAll(`.${BUTTON_CLASS}.${ACTIVE_CLASS}`)];
};

afterEach(() => {
    document.body.replaceChildren();
    window.history.replaceState({}, "", "/");
});

describe("renderTabbedPage", () => {
    it("renders the first tab as active and carries the tone class", () => {
        const root = renderTabbedPage(DEFINITION);
        expect(root.classList.contains(GRAMMAR_TONE)).toBe(true);
        expect(activeButtons(root)[0]?.textContent.includes(GRAMMAR_TABS[0]?.label ?? "")).toBe(true);
    });

    it("opens the tab named in the path", () => {
        window.history.replaceState({}, "", tabLink(GRAMMAR_PAGE, SECOND?.id ?? ""));
        const root = renderTabbedPage(DEFINITION);
        expect(activeButtons(root)[0]?.textContent).toContain(SECOND?.label ?? "");
    });
});

describe("mountTabSwitching", () => {
    it("re-renders the mounted page, pushes the tab path and retitles the document when its tab is selected", () => {
        const root = renderTabbedPage(DEFINITION);
        document.body.append(root);
        const dispose = mountTabSwitching(DEFINITION);
        emitEvent({ name: TAB_SELECTED, page: GRAMMAR_PAGE, tab: SECOND?.id ?? "" });
        dispose();
        expect(activeButtons(root)[0]?.textContent).toContain(SECOND?.label ?? "");
        expect(window.location.pathname).toBe(tabLink(GRAMMAR_PAGE, SECOND?.id ?? ""));
        expect(document.title).toContain(SECOND?.label ?? "");
    });
});

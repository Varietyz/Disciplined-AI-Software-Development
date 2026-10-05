import "@banes-lab/web/presentation/records/home.record.ts";
import { afterEach, describe, expect, it } from "vitest";
import { ACTIVE_CLASS } from "@banes-lab/web/configuration/constants/element.constants.ts";
import { HOME_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { PAGE_ATTRIBUTE } from "@banes-lab/web/presentation/components/menu.component.ts";
import { ROUTE_CHANGED } from "@banes-lab/web/core/ids/route.ids.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { emitEvent } from "@banes-lab/web/core/buses/base.bus.ts";
import { mountMenu } from "@banes-lab/web/presentation/widgets/menu.widget.ts";

const BAR_CLASS = "tab-bar";

const mount = function mount(): { readonly container: HTMLElement; readonly dispose: () => void } {
    const container = createElement("header");
    document.body.append(container);
    return { container, dispose: mountMenu(container) };
};

afterEach(() => {
    document.body.replaceChildren();
});

describe("mountMenu", () => {
    it("fills the header with a tab bar of the listed pages and empties it on dispose", () => {
        const { container, dispose } = mount();
        expect(container.querySelector(`.${BAR_CLASS} [${PAGE_ATTRIBUTE}="${HOME_PAGE}"]`)).not.toBeNull();
        dispose();
        expect(container.childElementCount).toBe(0);
    });

    it("marks the current page active when the route changes", () => {
        const { container, dispose } = mount();
        emitEvent({ name: ROUTE_CHANGED, page: HOME_PAGE });
        const home = container.querySelector(`[${PAGE_ATTRIBUTE}="${HOME_PAGE}"]`);
        expect(home?.classList.contains(ACTIVE_CLASS)).toBe(true);
        dispose();
    });
});

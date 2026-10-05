import { describe, expect, it } from "vitest";
import { MAIN_ID } from "@banes-lab/web/core/ids/site.ids.ts";
import { attachHome } from "@banes-lab/web/presentation/components/home.component.ts";
import { declaredStyle } from "@banes-lab/web/core/registries/style.registry.ts";
import { mountHome } from "@banes-lab/web/presentation/widgets/home.widget.ts";

class IdleObserver {
    public observe(): void {}

    public unobserve(): void {}

    public disconnect(): void {}
}

Reflect.set(globalThis, "IntersectionObserver", IdleObserver);
Reflect.set(globalThis, "ResizeObserver", IdleObserver);

const mounted = function mounted(markup: string): HTMLElement {
    const main = document.createElement("div");
    main.id = MAIN_ID;
    main.innerHTML = markup;
    document.body.replaceChildren(main);
    return main;
};

describe("attachHome", () => {
    it("disposes cleanly when the page carries no rail and no counters", () => {
        const dispose = attachHome(mounted(""));
        expect(() => {
            dispose();
        }).not.toThrow();
    });

    it("leaves a counter at zero until it is seen", () => {
        const main = mounted('<div class="home-stats"><b data-settled-text="7">0</b></div>');
        const dispose = attachHome(main);
        expect(main.querySelector("b")?.textContent).toBe("0");
        dispose();
    });

    it("sizes the rail between the first and the last row icon", () => {
        const main = mounted(
            '<div class="home-rows"><div id="home-rail"></div>' +
                '<article class="home-row"><span class="page-icon"></span></article>' +
                '<article class="home-row"><span class="page-icon"></span></article></div>',
        );
        const dispose = attachHome(main);
        const rail = main.querySelector("#home-rail");
        expect(rail?.getAttribute("style")).toBeNull();
        expect(declaredStyle(rail ?? main, "height")).toContain("px");
        dispose();
    });
});

describe("mountHome", () => {
    it("wires nothing until a route change names the home page, and disposes cleanly", () => {
        const dispose = mountHome(mounted(""));
        expect(() => {
            dispose();
        }).not.toThrow();
    });
});

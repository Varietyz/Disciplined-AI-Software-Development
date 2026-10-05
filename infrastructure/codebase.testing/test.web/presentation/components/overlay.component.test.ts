import { OVERLAY_DISMISSED, OVERLAY_REQUESTED } from "@banes-lab/web/core/ids/overlay.ids.ts";
import { createCloseButton, createExpandButton } from "@banes-lab/web/presentation/components/overlay.component.ts";
import { describe, expect, it } from "vitest";
import { CLOSE_TITLE } from "@banes-lab/web/configuration/strings/code.strings.ts";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";

const EXPAND_CLASS = "diagram-expand";
const TOOLTIP = "View the whole thing";
const TITLE = "The whole thing";
const LABEL = "one line";

describe("createCloseButton", () => {
    it("is titled and dismisses the overlay on click", () => {
        let dismissed = 0;
        const dispose = subscribeEvent(OVERLAY_DISMISSED, () => {
            dismissed += 1;
        });
        const button = createCloseButton();
        expect(button.title).toBe(CLOSE_TITLE);
        button.click();
        dispose();
        expect(dismissed).toBe(1);
    });
});

describe("createExpandButton", () => {
    it("carries its class, tooltip and label, and requests an overlay with the built content on click", () => {
        const requested: string[] = [];
        const dispose = subscribeEvent(OVERLAY_REQUESTED, (event) => {
            requested.push(`${event.title}:${event.content.className}`);
        });
        const button = createExpandButton(
            EXPAND_CLASS,
            TOOLTIP,
            TITLE,
            () => createElement("div", { className: "full" }),
            [createElement("span", { text: LABEL })],
        );
        expect(button.className).toBe(EXPAND_CLASS);
        expect(button.title).toBe(TOOLTIP);
        expect(button.textContent.includes(LABEL)).toBe(true);
        button.click();
        dispose();
        expect(requested).toStrictEqual([`${TITLE}:full`]);
    });
});

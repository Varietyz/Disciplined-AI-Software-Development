import {
    COLLAPSED_LINE_LIMIT,
    EXPANDABLE_CLASS,
    LINE_BREAK,
    PAG_LANGUAGE,
} from "@banes-lab/web/configuration/constants/code.constants.ts";
import { describe, expect, it } from "vitest";
import { OVERLAY_REQUESTED } from "@banes-lab/web/core/ids/overlay.ids.ts";
import { createCodeBlock } from "@banes-lab/web/presentation/components/code.component.ts";
import { subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";

const TITLE = "Sample";
const SHORT = "READ a";
const LONG = Array.from({ length: COLLAPSED_LINE_LIMIT + 1 }, () => SHORT).join(LINE_BREAK);
const EXPAND_CLASS = "code-expand";

describe("createCodeBlock", () => {
    it("renders the title and code without an expand control when short", () => {
        const block = createCodeBlock(SHORT, TITLE, PAG_LANGUAGE);
        expect(block.classList.contains(EXPANDABLE_CLASS)).toBe(false);
        expect(block.querySelector(`.${EXPAND_CLASS}`)).toBeNull();
        expect(block.textContent.includes(TITLE)).toBe(true);
        expect(block.textContent.includes(SHORT)).toBe(true);
    });

    it("marks long code expandable and requests an overlay on expand", () => {
        const titles: string[] = [];
        const dispose = subscribeEvent(OVERLAY_REQUESTED, (event) => {
            titles.push(event.title);
        });
        const block = createCodeBlock(LONG, TITLE, PAG_LANGUAGE);
        expect(block.classList.contains(EXPANDABLE_CLASS)).toBe(true);
        block.querySelector<HTMLButtonElement>(`.${EXPAND_CLASS}`)?.click();
        dispose();
        expect(titles).toStrictEqual([TITLE]);
    });
});

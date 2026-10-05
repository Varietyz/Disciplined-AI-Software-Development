import {
    VIEWPORT_PROBE,
    auditPage,
    clippedEntry,
    controlFindings,
    countedEntries,
    describeElement,
    escapesScreen,
    isAuditable,
    layoutFindings,
    pixelsOf,
    scrollThrough,
    smallTextEntry,
    widestDescendant,
} from "@project/scripts/core/probes/viewport.probe.ts";
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import type { ProbePage } from "@project/scripts/types/viewport.types.ts";
import { VIEWPORT_RULES } from "@project/scripts/configuration/configs/viewport.config.ts";

const pageOf = function pageOf(body: string): ProbePage {
    return new JSDOM(`<!doctype html><body>${body}</body>`).window;
};

describe("the probe's helpers", () => {
    it("read a pixel size and refuse any other unit", () => {
        expect(pixelsOf("11.2px")).toBeCloseTo(11.2);
        expect(Number.isNaN(pixelsOf("1rem"))).toBe(true);
    });

    it("name an element by its tag, id and first classes", () => {
        const page = pageOf('<input id="find" class="filter-box wide dense extra">');
        const field = page.document.getElementById("find");
        expect(field === null ? "" : describeElement(field)).toBe("input#find.filter-box.wide.dense");
    });

    it("count repeated entries once each", () => {
        expect(countedEntries(["a", "b", "a"])).toStrictEqual(["a x2", "b"]);
    });

    it("skip an element with no layout box and one inside a hidden part", () => {
        const page = pageOf('<p id="plain">text</p><span class="visually-hidden"><b id="unseen">x</b></span>');
        const plain = page.document.getElementById("plain");
        const unseen = page.document.getElementById("unseen");
        expect(plain === null ? true : isAuditable(page, VIEWPORT_RULES, plain)).toBe(false);
        expect(unseen === null ? true : isAuditable(page, VIEWPORT_RULES, unseen)).toBe(false);
        expect(plain === null ? true : escapesScreen(page, VIEWPORT_RULES, plain)).toBe(false);
        expect(plain === null ? plain : widestDescendant(plain)).toBeNull();
        expect(plain === null ? plain : clippedEntry(page, VIEWPORT_RULES, VIEWPORT_PROBE, plain)).toBeNull();
        expect(plain === null ? plain : smallTextEntry(page, VIEWPORT_RULES, VIEWPORT_PROBE, plain)).toBeNull();
    });
});

describe("scrollThrough", () => {
    it("visits nothing on a page with no scroll height and rests at the top", async () => {
        const page = pageOf('<main id="app"></main>');
        await expect(scrollThrough(page, { ...VIEWPORT_RULES, scrollPauseMs: 0 })).resolves.toBe(0);
        expect(page.document.getElementById("app")?.scrollTop).toBe(0);
    });
});

describe("auditPage", () => {
    it("reports nothing for a page with no laid-out element and names the viewport width", () => {
        const page = pageOf('<main id="app"><input style="font-size: 11px"><a href="/">home</a></main>');
        const audit = auditPage(page, VIEWPORT_RULES, VIEWPORT_PROBE);
        expect(audit.viewport).toBe(page.innerWidth);
        expect(audit.scrollsSideways).toBe(false);
        expect(layoutFindings(page, VIEWPORT_RULES, VIEWPORT_PROBE)).toStrictEqual({
            clipped: [],
            overflow: [],
            text: [],
        });
        expect(controlFindings(page, VIEWPORT_RULES, VIEWPORT_PROBE)).toStrictEqual({ inputs: [], targets: [] });
    });
});

import { describe, expect, it } from "vitest";
import { renderBakedTabs, renderTabs } from "@banes-lab/build-scripts/core/formatters/tab.formatter.ts";

describe("renderTabs", () => {
    it("writes a typed module whose one export parses back to the page tabs", () => {
        const pages = [{ page: "terms", tabs: [{ id: "intro", label: "Intro", path: "/terms" }] }];
        const source = renderTabs(pages);
        expect(source.startsWith('import type { PageTabs } from "#types/tab.types";')).toBe(true);
        const start = source.indexOf("JSON.parse(") + "JSON.parse(".length;
        const literal: unknown = JSON.parse(source.slice(start, source.lastIndexOf(");")));
        const parsed: unknown = JSON.parse(String(literal));
        expect(parsed).toStrictEqual(pages);
    });
});

describe("renderBakedTabs", () => {
    it("writes one typed export per entry under one type import, each parsing back to its tabs", () => {
        const source = renderBakedTabs([
            { name: "METHODOLOGY_TABS", stem: "methodology.page", tabs: [] },
            { name: "GRAMMAR_TABS", stem: "grammar.page", tabs: [] },
        ]);
        expect(source.startsWith('import type { Tab } from "#types/document.types";')).toBe(true);
        expect(source.includes('export const METHODOLOGY_TABS: readonly Tab[] = JSON.parse("[]");')).toBe(true);
        expect(source.includes('export const GRAMMAR_TABS: readonly Tab[] = JSON.parse("[]");')).toBe(true);
    });
});

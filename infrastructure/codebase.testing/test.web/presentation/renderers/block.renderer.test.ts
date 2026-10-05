import { describe, expect, it } from "vitest";
import type { Block } from "@banes-lab/web/types/block.types.ts";
import { PAG_LANGUAGE } from "@banes-lab/web/configuration/constants/code.constants.ts";
import { renderBlock } from "@banes-lab/web/presentation/renderers/block.renderer.ts";
import { renderGlossary } from "@banes-lab/web/presentation/renderers/glossary.block.renderer.ts";
import { renderLinks } from "@banes-lab/web/presentation/renderers/link.renderer.ts";

const TEXT = "Some <strong>bold</strong> copy";
const ITEM = "item";
const TERM = "Term";
const ICON = "bi-x";
const HREF = "https://example.com/";
const TITLE = "Title";

interface Expectation {
    readonly block: Block;
    readonly className: string;
}

const EXPECTATIONS: readonly Expectation[] = [
    { block: { kind: "text", text: TEXT }, className: "block-text" },
    { block: { kind: "text", note: true, text: TEXT }, className: "block-note" },
    { block: { items: [ITEM], kind: "list" }, className: "block-list" },
    { block: { entries: [{ description: TEXT, term: TERM }], kind: "glossary" }, className: "block-glossary" },
    { block: { entries: [{ description: TEXT, icon: ICON, term: TERM }], kind: "glossary" }, className: "block-icons" },
    { block: { groups: [{ items: [ITEM], title: TITLE }], kind: "group" }, className: "block-groups" },
    { block: { kind: "link", links: [{ href: HREF, text: TITLE }] }, className: "block-links" },
    { block: { headers: [TITLE], kind: "table", rows: [[ITEM]] }, className: "block-table" },
    { block: { code: ITEM, kind: "code", language: PAG_LANGUAGE, title: TITLE }, className: "code-block" },
    { block: { items: [ITEM], kind: "check" }, className: "check-grid" },
    { block: { keywords: [ITEM], kind: "keyword" }, className: "keyword-grid" },
];

describe("renderBlock", () => {
    it.each(EXPECTATIONS)("renders a $block.kind block as .$className", ({ block, className }) => {
        expect(renderBlock(block).classList.contains(className)).toBe(true);
    });

    it("renders inline markup inside a text block", () => {
        expect(renderBlock({ kind: "text", text: TEXT }).querySelector("strong")).not.toBeNull();
    });
});

describe("renderLinks and renderGlossary", () => {
    it("renders a linked glossary term, an icon button link and a navigation card", () => {
        const glossary = renderGlossary({ entries: [{ description: TEXT, href: HREF, term: TERM }], kind: "glossary" });
        expect(glossary.querySelector("dt a")?.getAttribute("href")).toBe(HREF);
        const buttons = renderLinks({ button: true, kind: "link", links: [{ href: HREF, icon: ICON, text: TITLE }] });
        expect(buttons.querySelector("a.block-button")).not.toBeNull();
        const navigation = renderLinks({
            kind: "link",
            links: [{ description: TEXT, href: HREF, icon: ICON, text: TITLE }],
        });
        expect(navigation.querySelector("a.block-nav .block-nav-description")?.textContent).toBe(TEXT);
    });
});

import { CODE_LINE_CLASS, CODE_LINE_MARKED_CLASS } from "@banes-lab/web/configuration/constants/syntax.constants.ts";
import {
    NODE_ATTRIBUTE,
    NODE_CLASS,
    REFERENCE_NAME_ATTRIBUTE,
    REFERENCE_SELECTOR,
} from "@banes-lab/web/configuration/constants/anatomy.constants.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    createCodeBlock,
    createPlainCodeBlock,
    revealLine,
} from "@banes-lab/web/presentation/components/code.component.ts";
import { enableSourceNavigation, markReferences } from "@banes-lab/web/presentation/components/source.component.ts";
import { renderMetricGrid, renderMetrics } from "@banes-lab/web/presentation/renderers/metric.renderer.ts";
import type { Tab } from "@banes-lab/web/types/document.types.ts";
import { TREE_TAB } from "@banes-lab/web/core/ids/anatomy.ids.ts";
import { loadTreeTab } from "@banes-lab/web/core/loaders/tree.loader.ts";
import { PANEL_REVEAL_EVENT } from "@banes-lab/web/configuration/constants/panel.constants.ts";
import { STATIC_RENDER_ATTRIBUTE } from "@banes-lab/web/configuration/constants/document.constants.ts";
import type { SourceReferences } from "@banes-lab/web/types/code.types.ts";
import { renderFields } from "@banes-lab/web/presentation/renderers/ontology.renderer.ts";
import { renderFilesystem } from "@banes-lab/web/presentation/renderers/anatomy.renderer.ts";
import { renderNode } from "@banes-lab/web/presentation/renderers/folder.renderer.ts";
import { renderSource } from "@banes-lab/web/presentation/renderers/source.renderer.ts";
import { treeNodesOf } from "@banes-lab/web/presentation/components/folder.component.ts";

const LOADED_TREE_TAB = await loadTreeTab(TREE_TAB);

const treeTab = function treeTab(): Tab {
    if (LOADED_TREE_TAB === undefined) {
        throw new Error(NODE_CLASS);
    }
    return LOADED_TREE_TAB;
};

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.removeAttribute(STATIC_RENDER_ATTRIBUTE);
    vi.unstubAllGlobals();
});

describe("renderFilesystem", () => {
    it("renders the sidebar tree beside a view that shows the root folder, and swaps the view on a tree click", () => {
        vi.stubGlobal("fetch", async () => {
            await Promise.resolve();
            throw new Error("offline");
        });
        const article = renderFilesystem(treeTab());
        document.body.append(article);
        expect(article.querySelector(".filesystem-tree")).not.toBeNull();
        const shown = article.querySelectorAll(`.${NODE_CLASS}`);
        expect(shown).toHaveLength(1);
        expect(shown[0]?.id).toBe("folder-root");
        const link = article.querySelector<HTMLAnchorElement>(`.filesystem-tree a[${NODE_ATTRIBUTE}^="file-"]`);
        link?.click();
        expect(article.querySelector(`.${NODE_CLASS}`)?.id).toBe(link?.getAttribute(NODE_ATTRIBUTE));
    });

    it("renders every node in the static render so the alternates carry the whole tree", () => {
        document.documentElement.setAttribute(STATIC_RENDER_ATTRIBUTE, "");
        const article = renderFilesystem(treeTab());
        const expected = treeTab().sections.reduce((sum, section) => sum + 1 + section.subsections.length, 0);
        expect(article.querySelectorAll(`.${NODE_CLASS}`)).toHaveLength(expected);
    });
});

describe("renderNode", () => {
    it("renders a folder with its crumbs, stats and listings, and a file with its chips and blocks", () => {
        vi.stubGlobal("fetch", async () => {
            await Promise.resolve();
            throw new Error("offline");
        });
        const tab = treeTab();
        const root = treeNodesOf(tab.sections, tab.folders ?? {});
        if (root === null) {
            throw new Error(NODE_CLASS);
        }
        const folder = renderNode(root, root);
        expect(folder.querySelector(".filesystem-node-title")?.textContent).toBe(root.name);
        expect(folder.querySelector(".filesystem-listing")).not.toBeNull();
        const [file] = root.files;
        if (file === undefined) {
            throw new Error(NODE_CLASS);
        }
        const rendered = renderNode(root, file);
        expect(rendered.querySelector(".filesystem-crumbs a")).not.toBeNull();
        expect(rendered.querySelector(".record-chips")).not.toBeNull();
    });
});

describe("renderMetrics, renderMetricGrid and renderFields", () => {
    it("lays metrics out as record fields, framed as a figure only when captioned as a panel", () => {
        const block = { caption: "Stats", kind: "metric" as const, metrics: [{ label: "Files", value: "3" }] };
        const grid = renderMetricGrid(block);
        expect(grid.querySelectorAll(".record-field")).toHaveLength(1);
        expect(grid.querySelector(".metric-value")?.textContent).toBe("3");
        const figure = renderMetrics(block);
        expect(figure.querySelector(".diagram-caption")?.textContent).toBe("Stats");
        const fields = renderFields({
            entries: [{ description: "<strong>relay</strong>", term: "a:1" }],
            kind: "glossary",
        });
        expect(fields.querySelector(".record-field-label")?.textContent).toBe("a:1");
        expect(fields.querySelector("strong")?.textContent).toBe("relay");
    });
});

const SOURCE_PATH = ["core", "a.ts"].join("/");
const FACTORY_PATH = ["core", "factories", "element.factory.ts"].join("/");

const REFERENCES: SourceReferences = {
    sites: [1, 9, 0],
    spans: {},
    strings: { "#core/factories/element.factory": { kind: "file", path: FACTORY_PATH } },
    targets: [{ kind: "definition", location: { file: FACTORY_PATH, line: 7, name: "createElement" } }],
    words: {
        createElement: { kind: "definition", location: { file: FACTORY_PATH, line: 3, name: "createElement" } },
        render: {
            kind: "candidates",
            locations: [
                { file: SOURCE_PATH, line: 1, name: "render" },
                { file: FACTORY_PATH, line: 9, name: "render" },
            ],
        },
    },
};

describe("renderSource, revealLine and enableSourceNavigation", () => {
    it("loads the source into a line-addressed code block and reveals a marked line through the panel", async () => {
        vi.stubGlobal("fetch", async () => new Response("const a = 1;\nconst b = a;\n", { status: 200 }));
        const holder = renderSource({
            kind: "source",
            language: "typescript",
            path: SOURCE_PATH,
            source: "s.txt",
            title: "the source",
        });
        document.body.append(holder);
        await new Promise((resolve) => {
            holder.addEventListener("source-loaded", resolve, { once: true });
        });
        expect(holder.querySelectorAll(`.${CODE_LINE_CLASS}`)).toHaveLength(3);
        expect(holder.querySelector(".panel")).toBeNull();
        const scrolled = vi.fn();
        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrolled });
        expect(revealLine(holder, 2)).toBe(true);
        expect(holder.querySelector<HTMLElement>(`.${CODE_LINE_MARKED_CLASS}`)?.dataset.line).toBe("2");
        expect(scrolled).toHaveBeenCalledOnce();
        expect(revealLine(holder, 40)).toBe(false);
        const block = createCodeBlock("x", "t", "text");
        const revealed: number[] = [];
        block.querySelector(".panel")?.addEventListener(PANEL_REVEAL_EVENT, (event) => {
            revealed.push(event instanceof CustomEvent ? Number(event.detail) : -1);
        });
        expect(revealLine(block, 1)).toBe(true);
        expect(revealed).toHaveLength(1);
        enableSourceNavigation(block);
        const plain = createPlainCodeBlock(
            'import { createElement, render } from "#core/factories/element.factory";',
            "t",
            "typescript",
        );
        markReferences(plain, REFERENCES);
        expect(plain.querySelector(`.${CODE_LINE_CLASS}`)).not.toBeNull();
        const references = [...plain.querySelectorAll(REFERENCE_SELECTOR)];
        const named = references.find((reference) => reference.textContent === "createElement");
        expect(named?.getAttribute("href")?.endsWith("#file-core-factories-element-factory-ts:7")).toBe(true);
        expect(
            references.some(
                (reference) =>
                    reference.getAttribute("href")?.endsWith("#file-core-factories-element-factory-ts") === true,
            ),
        ).toBe(true);
        expect(references.some((reference) => reference.textContent === "import")).toBe(false);
        const ambiguous = references.filter((reference) => reference.hasAttribute(REFERENCE_NAME_ATTRIBUTE));
        expect(ambiguous.map((reference) => reference.getAttribute(REFERENCE_NAME_ATTRIBUTE))).toStrictEqual([
            "render",
        ]);
    });
});

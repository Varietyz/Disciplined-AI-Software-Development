import { REFERENCE_SELECTOR, SOURCE_LOADED_EVENT } from "@banes-lab/web/configuration/constants/anatomy.constants.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { escaped, inlineMarkup } from "@banes-lab/web/core/normalizers/markdown.normalizer.ts";
import { renderDocument, renderMarkdown } from "@banes-lab/web/presentation/renderers/markdown.renderer.ts";
import { resolveFolder, resolvePath } from "@banes-lab/web/core/loaders/definition.loader.ts";
import { MARKDOWN_CLASS } from "@banes-lab/web/configuration/constants/markdown.constants.ts";
import type { SourceReferences } from "@banes-lab/web/types/code.types.ts";
import { markDocumentReferences } from "@banes-lab/web/presentation/components/source.component.ts";
import { parseMarkdown } from "@banes-lab/web/core/converters/markdown.converter.ts";

const FACTORY = ["core", "factories", "element.factory.ts"].join("/");
const IDS_FOLDER = ["core", "ids"].join("/");
const WIDGET_NAME = "tab.widget.ts";
const SOURCE = [
    "---",
    "name: sample",
    "---",
    "<!-- a banner",
    "nobody reads -->",
    "# Title <!-- inline -->",
    "",
    "A *plain* paragraph with **bold**, `code` and a [link](/anatomy).",
    "continued here.",
    "",
    "- one",
    "- two",
    "  still two",
    "",
    "1. first",
    "2. second",
    "",
    "> quoted",
    "",
    "| a | b |",
    "| --- | --- |",
    "| 1 | 2 |",
    "",
    "---",
    "",
    "```ts",
    "const x = 1;",
    "```",
].join("\n");

afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
});

describe("parseMarkdown", () => {
    it("skips the frontmatter and reads headings, paragraphs, lists, quotes, tables, rules and fences", () => {
        const nodes = parseMarkdown(SOURCE);
        expect(nodes.map((node) => node.kind)).toStrictEqual([
            "heading",
            "paragraph",
            "list",
            "list",
            "quote",
            "table",
            "rule",
            "code",
        ]);
        expect(nodes[0]?.kind === "heading" && nodes[0].text).toBe("Title");
        expect(nodes[1]?.kind === "paragraph" && nodes[1].text.endsWith("continued here.")).toBe(true);
        expect(nodes[2]?.kind === "list" && nodes[2].items).toStrictEqual(["one", "two still two"]);
        expect(nodes[3]?.kind === "list" && nodes[3].ordered).toBe(true);
        expect(nodes[5]?.kind === "table" && nodes[5].rows).toStrictEqual([["1", "2"]]);
        expect(nodes[7]?.kind === "code" && nodes[7].language).toBe("ts");
    });
});

describe("inlineMarkup and escaped", () => {
    it("turns inline marks into the site's markup and escapes raw angle brackets", () => {
        expect(inlineMarkup("a *b* **c** `d<e>` [f](g)")).toBe(
            'a <em>b</em> <strong>c</strong> <code>d&lt;e&gt;</code> <a href="g">f</a>',
        );
        expect(escaped("<&>")).toBe("&lt;&amp;&gt;");
    });
});

describe("renderMarkdown and markDocumentReferences", () => {
    it("renders the document with headings, lists, a table and a code block, and links code that names a file or a definition", () => {
        const article = renderMarkdown(SOURCE);
        expect(article.classList.contains(MARKDOWN_CLASS)).toBe(true);
        expect(article.querySelector("h1")?.textContent).toBe("Title");
        expect(article.querySelectorAll("li")).toHaveLength(4);
        expect(article.querySelector("table")).not.toBeNull();
        expect(article.querySelector(".code-block")).not.toBeNull();
        const rendered = renderMarkdown(
            `See \`${FACTORY}\`, \`createElement\`, \`nothing-here\`, \`${IDS_FOLDER}/\` and \`${WIDGET_NAME}\`.`,
        );
        const widget = ["presentation", "widgets", WIDGET_NAME].join("/");
        const references: SourceReferences = {
            sites: [],
            spans: {
                [`${IDS_FOLDER}/`]: { kind: "folder", path: IDS_FOLDER },
                [FACTORY]: { kind: "file", path: FACTORY },
                [WIDGET_NAME]: { kind: "file", path: widget },
                createElement: { kind: "definition", location: { file: FACTORY, line: 3, name: "createElement" } },
            },
            strings: {},
            targets: [],
            words: {},
        };
        markDocumentReferences(rendered, references);
        const linked = [...rendered.querySelectorAll(REFERENCE_SELECTOR)];
        expect(linked.map((link) => link.textContent)).toStrictEqual([
            FACTORY,
            "createElement",
            `${IDS_FOLDER}/`,
            WIDGET_NAME,
        ]);
        expect(resolvePath(`./${FACTORY}`)).toBe(FACTORY);
        expect(resolvePath(WIDGET_NAME)).toBe(widget);
        expect(resolvePath("nope.ts")).toBeNull();
        expect(resolveFolder(`${IDS_FOLDER}/`)).toBe(IDS_FOLDER);
        expect(resolveFolder("nowhere")).toBeNull();
    });

    it("loads the document text and renders it in place of the loading block", async () => {
        vi.stubGlobal("fetch", async () => new Response("# Loaded\n\ntext", { status: 200 }));
        const holder = renderDocument({ kind: "markdown", path: "README.md", source: "r.txt", title: "the document" });
        document.body.append(holder);
        await new Promise((resolve) => {
            holder.addEventListener(SOURCE_LOADED_EVENT, resolve, { once: true });
        });
        expect(holder.querySelector("h1")?.textContent).toBe("Loaded");
        expect(holder.querySelector(".document-title")?.textContent).toBe("the document");
    });
});

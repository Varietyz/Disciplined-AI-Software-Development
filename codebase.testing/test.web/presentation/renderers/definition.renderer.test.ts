import {
    CODE_LINE_ATTRIBUTE,
    CODE_LINE_MARKED_CLASS,
} from "@banes-lab/web/configuration/constants/syntax.constants.ts";
import {
    DEFINITION_CITED_LEAD,
    DEFINITION_MISSING,
    SOURCE_SERVED_LEAD,
} from "@banes-lab/web/configuration/strings/walk.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { definitionBlock, definitionHref } from "@banes-lab/web/domain/converters/source.link.converter.ts";
import { renderServedSource, renderSource } from "@banes-lab/web/presentation/renderers/source.renderer.ts";
import { SOURCE_LOADED_EVENT } from "@banes-lab/web/configuration/constants/anatomy.constants.ts";
import { STATIC_RENDER_ATTRIBUTE } from "@banes-lab/web/configuration/constants/document.constants.ts";
import { renderChapterPanel } from "@banes-lab/web/presentation/renderers/panel.renderer.ts";
import { renderDefinition } from "@banes-lab/web/presentation/renderers/definition.renderer.ts";
import { sourceLocation } from "@banes-lab/web/core/assets/walk.assets.ts";

const FACTORY = ["core", "factories", "element.factory.ts"].join("/");
const CREATE = "createElement";
const TITLE = "the factory";
const SECTION = "section";
const LABEL = "1";

const settled = async function settled(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
};

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.removeAttribute(STATIC_RENDER_ATTRIBUTE);
    vi.unstubAllGlobals();
});

describe("renderDefinition", () => {
    it("shows the cited file whole, marks and scrolls to the definition's line, and reports a citation that resolves to nothing", async () => {
        const block = definitionBlock(CREATE, TITLE);
        expect(block.file).toBe(FACTORY);
        const line = block.line ?? 0;
        const text = "const held = 1;\n".repeat(line + 1);
        vi.stubGlobal("fetch", async () => new Response(text, { status: 200 }));
        const holder = renderDefinition(block);
        document.body.append(holder);
        await new Promise((resolve) => {
            holder.addEventListener(SOURCE_LOADED_EVENT, resolve, { once: true });
        });
        expect(holder.querySelector(".code-title")?.textContent).toBe(TITLE);
        expect(holder.querySelector(`.${CODE_LINE_MARKED_CLASS}`)?.getAttribute(CODE_LINE_ATTRIBUTE)).toBe(
            String(line),
        );
        const missing = renderDefinition(definitionBlock("noSuchDefinitionAnywhere", TITLE));
        document.body.append(missing);
        await settled();
        expect(missing.textContent).toContain(DEFINITION_MISSING);
    });

    it("renders as a wide chapter panel tagged by its title", () => {
        const panel = renderChapterPanel(definitionBlock(CREATE, TITLE), SECTION, LABEL, 0);
        expect(panel.wide).toBe(true);
        expect(panel.tag).toBe(TITLE);
    });

    it("links the cited definition and the served source in the static render instead of a loading placeholder", () => {
        document.documentElement.setAttribute(STATIC_RENDER_ATTRIBUTE, "");
        const cited = renderDefinition(definitionBlock(CREATE, TITLE));
        expect(cited.textContent).toBe(DEFINITION_CITED_LEAD + TITLE);
        expect(cited.querySelector("a")?.getAttribute("href")).toBe(definitionHref(CREATE));
        const served = renderServedSource(SOURCE_SERVED_LEAD, sourceLocation("source.abc.generated.txt"), FACTORY);
        expect(served.textContent).toBe(SOURCE_SERVED_LEAD + FACTORY);
        expect(served.querySelector("a")?.getAttribute("href")).toBe(
            "/static/source/generated/source.abc.generated.txt",
        );
        expect(
            renderSource({
                kind: "source",
                language: "ts",
                path: FACTORY,
                source: "source.abc.generated.txt",
                title: FACTORY,
            }).textContent,
        ).toBe(SOURCE_SERVED_LEAD + FACTORY);
    });
});

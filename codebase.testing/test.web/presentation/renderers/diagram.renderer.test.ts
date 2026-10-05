import { DIAGRAM_MISSING, VIEW_FULL_DIAGRAM_TITLE } from "@banes-lab/web/configuration/strings/diagram.strings.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DIAGRAM_FILLED } from "@banes-lab/web/core/ids/diagram.ids.ts";
import { DIAGRAM_RATIO_PROPERTY } from "@banes-lab/web/configuration/constants/diagram.constants.ts";
import { MERMAID_LANGUAGE } from "@banes-lab/web/configuration/constants/code.constants.ts";
import type { MermaidBlock } from "@banes-lab/web/types/block.types.ts";
import { OVERLAY_REQUESTED } from "@banes-lab/web/core/ids/overlay.ids.ts";
import { STATIC_RENDER_ATTRIBUTE } from "@banes-lab/web/configuration/constants/document.constants.ts";
import { declaredStyle } from "@banes-lab/web/core/registries/style.registry.ts";
import { diagramDigest } from "@banes-lab/web/core/analyzers/diagram.analyzer.ts";
import { diagramLocation } from "@banes-lab/web/core/assets/diagram.assets.ts";
import { renderBlock } from "@banes-lab/web/presentation/renderers/block.renderer.ts";
import { renderDiagram } from "@banes-lab/web/presentation/renderers/diagram.renderer.ts";
import { subscribeEvent } from "@banes-lab/web/core/buses/base.bus.ts";

const SOURCE = "flowchart LR\n    a --> b";
const UNKNOWN = "flowchart LR\n    c --> d";
const MARKUP = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 800 200"><g class="rendered"></g></svg>';
const FALLBACK_PAGE = "<!doctype html><html></html>";
const VECTOR_TYPE = "image/svg+xml";
const PAGE_TYPE = "text/html";

const filled = async function filled(figure: Element): Promise<void> {
    return new Promise((resolve) => {
        figure.querySelector(".diagram-canvas")?.addEventListener(
            DIAGRAM_FILLED,
            () => {
                resolve();
            },
            { once: true },
        );
    });
};

const settled = async function settled(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
};

const stubFetch = async function stubFetch(): Promise<string> {
    const location = diagramLocation(await diagramDigest(SOURCE));
    vi.stubGlobal("fetch", async (url: string) =>
        url === location
            ? new Response(MARKUP, { headers: { "content-type": VECTOR_TYPE }, status: 200 })
            : new Response(FALLBACK_PAGE, { headers: { "content-type": PAGE_TYPE }, status: 200 }),
    );
    return location;
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("renderDiagram", () => {
    it("fetches the rendered vector by the source digest, keeps the source as a mermaid fence and leads with the caption", async () => {
        await stubFetch();
        const block: MermaidBlock = { caption: "The caption", kind: "mermaid", text: SOURCE };
        const figure = renderDiagram(block);
        expect(figure.tagName).toBe("FIGURE");
        expect(figure.firstElementChild?.className).toBe("diagram-header");
        expect(figure.querySelector(".diagram-caption")?.textContent).toBe(block.caption);
        await filled(figure);
        expect(figure.querySelector(".diagram-canvas svg .rendered")).not.toBeNull();
        expect(declaredStyle(figure.querySelector(".diagram-canvas") ?? figure, DIAGRAM_RATIO_PROPERTY)).toBe("4");
        const source = figure.querySelector<HTMLElement>("pre.diagram-source");
        expect(source?.dataset.language).toBe(MERMAID_LANGUAGE);
        expect(source?.textContent).toBe(block.text);
    });

    it("opens the full diagram in the overlay from the header button", async () => {
        await stubFetch();
        const heard: string[] = [];
        const stop = subscribeEvent(OVERLAY_REQUESTED, (event) => {
            heard.push(event.title, event.content.className);
        });
        const figure = renderDiagram({ kind: "mermaid", text: SOURCE });
        figure.querySelector<HTMLButtonElement>("button.diagram-expand")?.click();
        stop();
        expect(heard).toStrictEqual([VIEW_FULL_DIAGRAM_TITLE, "panel diagram-full"]);
    });

    it("notes a diagram whose vector was never rendered, even when the server answers a page instead", async () => {
        await stubFetch();
        const figure = renderDiagram({ kind: "mermaid", text: UNKNOWN });
        await filled(figure);
        expect(figure.querySelector(".diagram-canvas .diagram-missing")?.textContent).toBe(DIAGRAM_MISSING);
    });

    it("leaves the canvas empty for a static render", async () => {
        const fetched = vi.fn();
        vi.stubGlobal("fetch", fetched);
        document.documentElement.setAttribute(STATIC_RENDER_ATTRIBUTE, "");
        const figure = renderDiagram({ kind: "mermaid", text: SOURCE });
        document.documentElement.removeAttribute(STATIC_RENDER_ATTRIBUTE);
        await settled();
        expect(figure.querySelector(".diagram-canvas .panel-zoom > div")?.childElementCount).toBe(0);
        expect(fetched).not.toHaveBeenCalled();
    });
});

describe("renderBlock with a mermaid block", () => {
    it("dispatches to the diagram renderer rather than the composite fallback", async () => {
        await stubFetch();
        const element = renderBlock({ kind: "mermaid", text: SOURCE });
        expect(element.classList.contains("diagram-figure")).toBe(true);
    });
});

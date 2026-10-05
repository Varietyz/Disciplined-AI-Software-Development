import { DIAGRAM_ROOT, DIAGRAM_STYLESHEET, diagramLocation } from "@banes-lab/web/core/assets/diagram.assets.ts";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DIAGRAM_UNAVAILABLE } from "@banes-lab/web/configuration/strings/report.strings.ts";
import { diagramDigest } from "@banes-lab/web/core/analyzers/diagram.analyzer.ts";
import { loadDiagram } from "@banes-lab/web/core/loaders/diagram.loader.ts";

const SOURCE = "flowchart TB\n    x --> y";
const MISSING = "flowchart TB\n    y --> z";
const MARKUP = "<svg></svg>";
const VECTOR_TYPE = "image/svg+xml";
const ABC_DIGEST = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
const STYLESHEET_SELECTOR = "link[rel=stylesheet]";

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("diagramDigest and diagramLocation", () => {
    it("digests a source with the standard hash and places the vector under the diagram root by that digest", async () => {
        expect(await diagramDigest("abc")).toBe(ABC_DIGEST);
        expect(diagramLocation(ABC_DIGEST)).toBe(`${DIAGRAM_ROOT}diagram.${ABC_DIGEST}.generated.svg`);
    });
});

describe("loadDiagram", () => {
    it("fetches a rendered vector once and shares the result, and answers null for a missing one without caching it", async () => {
        const location = diagramLocation(await diagramDigest(SOURCE));
        const fetched = vi.fn(async (url: string) =>
            url === location
                ? new Response(MARKUP, { headers: { "content-type": VECTOR_TYPE }, status: 200 })
                : new Response("", { status: 404 }),
        );
        vi.stubGlobal("fetch", fetched);
        const [first, second] = await Promise.all([loadDiagram(SOURCE), loadDiagram(SOURCE)]);
        expect(first).toBe(MARKUP);
        expect(second).toBe(MARKUP);
        expect(await loadDiagram(SOURCE)).toBe(MARKUP);
        expect(fetched).toHaveBeenCalledOnce();
        const logged = vi.spyOn(console, "error").mockReturnValue();
        expect(await loadDiagram(MISSING)).toBeNull();
        expect(await loadDiagram(MISSING)).toBeNull();
        expect(fetched).toHaveBeenCalledTimes(3);
        expect(logged).toHaveBeenCalledWith(DIAGRAM_UNAVAILABLE, diagramLocation(await diagramDigest(MISSING)));
    });

    it("attaches the diagram stylesheet to the head once, on the first vector that arrives", () => {
        const links = [...document.head.querySelectorAll(STYLESHEET_SELECTOR)].filter(
            (link) => link.getAttribute("href") === DIAGRAM_STYLESHEET,
        );
        expect(links).toHaveLength(1);
    });

    it("reports the error and answers null when the network refuses", async () => {
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const offline = new Error("offline");
        vi.stubGlobal("fetch", async () => {
            await Promise.resolve();
            throw offline;
        });
        expect(await loadDiagram(`${SOURCE}\n    y --> x`)).toBeNull();
        expect(logged).toHaveBeenCalledWith(DIAGRAM_UNAVAILABLE, offline);
    });
});

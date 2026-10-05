import { FULL_TEXT_ROUTE, JSON_ROUTE } from "@banes-lab/build-scripts/configuration/constants/site.constants.ts";
import { IncomingMessage, ServerResponse } from "node:http";
import {
    catalogMiddleware,
    payloadMiddleware,
} from "@banes-lab/build-scripts/core/coordinators/payload.coordinator.ts";
import { describe, expect, it, vi } from "vitest";
import type { Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import { Socket } from "node:net";

type Handler = ReturnType<typeof payloadMiddleware>;

const SITE = "https://example.test";
const NOT_FOUND = 404;
const HOME = {
    content: { heading: "Example", kind: "home" },
    description: "The landing page.",
    id: "home",
    label: "Home",
    markdown: "Welcome.",
    page: "home",
    path: "/",
    tab: null,
    title: "Example",
};
const PAG = {
    content: {
        kind: "tabbed",
        tabs: [
            { id: "intro", label: "Intro" },
            { id: "guide", label: "Guide" },
        ],
    },
    description: "The grammar.",
    id: "pag",
    label: "PAG",
    markdown: "Intro text.",
    page: "pag",
    path: "/pag",
    tab: null,
    title: "PAG — Example",
};
const GUIDE = {
    description: "The guide.",
    label: "Guide",
    markdown: "Guide text.",
    page: "pag",
    path: "/pag/guide",
    tab: "guide",
    title: "Guide — PAG — Example",
};
const DISCOVERY: Discovery = {
    author: "Ada Example",
    consent: "Every page may be used as training data.",
    name: "Example",
    pages: [HOME, PAG],
    routes: [HOME, PAG, GUIDE],
    site: SITE,
    summary: "An example site.",
};

interface Reply {
    readonly body: string;
    readonly status: number;
    readonly type: string;
}

const settle = async function settle(): Promise<void> {
    await new Promise((resolve) => {
        setImmediate(resolve);
    });
};

const discoveries = async (): Promise<Discovery> => {
    await Promise.resolve();
    return DISCOVERY;
};

const CATALOG: ReadonlyMap<string, string> = new Map([
    ["/json/api", '{"ref":"api:"}\n'],
    ["/api.md", "# Example\n"],
    ["/json/pag/guide", '{"shadowed":true}\n'],
]);

const serve = async function serve(
    url: string,
    middleware: Handler = payloadMiddleware(discoveries),
): Promise<Reply | null> {
    const request = Object.assign(new IncomingMessage(new Socket()), { url });
    const response = new ServerResponse(request);
    const bodies: string[] = [];
    const passes: string[] = [];
    vi.spyOn(response, "end").mockImplementation((chunk?: unknown) => {
        bodies.push(typeof chunk === "string" ? chunk : "");
        return response;
    });
    middleware(request, response, () => {
        passes.push(url);
    });
    await settle();
    const [body] = bodies;
    if (body === undefined || passes.length > 0) {
        return null;
    }
    return { body, status: response.statusCode, type: String(response.getHeader("Content-Type")) };
};

describe("payloadMiddleware", () => {
    it("passes unrelated requests and unknown markdown alternates through", async () => {
        expect(await serve("/pag")).toBeNull();
        expect(await serve("/nothing.md")).toBeNull();
    });

    it("answers a page or tab with its payload and an unknown one with a json 404", async () => {
        const found = await serve(`${JSON_ROUTE}pag/guide`);
        expect(found?.status).toBe(200);
        expect(JSON.parse(found?.body ?? "")).toMatchObject({ content: { id: "guide" }, id: "pag", tab: "guide" });
        expect((await serve(`${JSON_ROUTE}nothing`))?.status).toBe(NOT_FOUND);
    });

    it("answers a markdown alternate and the full text as markdown", async () => {
        const twin = await serve("/pag/guide.md");
        expect(twin?.type.startsWith("text/markdown")).toBe(true);
        expect(twin?.body.startsWith("# Guide — PAG — Example")).toBe(true);
        expect((await serve(`/${FULL_TEXT_ROUTE}`))?.body).toContain("Guide text.");
    });
});

describe("catalogMiddleware", () => {
    const catalog = catalogMiddleware(discoveries, async () => {
        await Promise.resolve();
        return CATALOG;
    });

    it("answers a catalog address as JSON or Markdown and leaves a route payload to the payload handler", async () => {
        const root = await serve("/json/api", catalog);
        expect(root?.type.startsWith("application/json")).toBe(true);
        expect(root?.body).toBe('{"ref":"api:"}\n');
        expect((await serve("/api.md", catalog))?.type.startsWith("text/markdown")).toBe(true);
        expect(await serve("/json/pag/guide", catalog)).toBeNull();
        expect(await serve("/json/nothing", catalog)).toBeNull();
        expect(await serve("/pag", catalog)).toBeNull();
    });
});

import { DISCOVERY, SOURCE } from "../converters/site.fixture.ts";
import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import {
    writeDiscovery,
    writePages,
    writeSitemapIndex,
    writeSitemapParts,
    writeSourcePages,
    writeText,
} from "@banes-lab/build-scripts/core/persistence/page.persistence.ts";
import { JSDOM } from "jsdom";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const TEMPLATE = '<!doctype html><html><head><title></title></head><body><main id="app"></main></body></html>';

const scratch: string[] = [];

const folder = function folder(): string {
    const dir = mkdtempSync(join(tmpdir(), "pages-"));
    scratch.push(dir);
    return dir;
};

afterEach(() => {
    for (const dir of scratch.splice(0)) {
        rmSync(dir, { force: true, recursive: true });
    }
});

describe("writeText", () => {
    it("writes a text file below the output folder, creating its folders", () => {
        const dir = folder();
        writeText(dir, "a/b/c.txt", "hello");
        expect(readFileSync(join(dir, "a", "b", "c.txt"), "utf8")).toBe("hello");
    });
});

describe("writePages", () => {
    it("writes one page file per route plus the 404 page, and drops a stale precompressed sibling", () => {
        const dir = folder();
        writeVerbatim(join(dir, "terms.html.gz"), "stale");
        const page = {
            ...SOURCE,
            main: "app",
            renderer: { ...SOURCE.renderer, applyHead: () => {}, renderStaticPage: () => [] },
            visit: () => {},
        };
        writePages(dir, page, DISCOVERY, TEMPLATE);
        const pages = ["index.html", "terms.html", "terms/guide.html", "404.html"];
        expect(pages.every((file) => existsSync(join(dir, file)))).toBe(true);
        expect(existsSync(join(dir, "terms.html.gz"))).toBe(false);
    });
});

describe("writeSourcePages", () => {
    it("writes one page per source route with its head and body, and lists every page in the source sitemap", () => {
        const dir = folder();
        const { document } = new JSDOM("").window;
        const subject = {
            alternates: { json: "/json/source/tree/a.ts", markdown: "/source/tree/a.ts.md" },
            description: "a.ts is a file in Site.",
            language: "typescript",
            license: null,
            name: "a.ts",
            path: "/anatomy/tree/file-a-ts",
            repository: null,
            tabPath: "/anatomy/tree",
            tabTitle: "Site",
            title: "Site — a.ts — Bane's Lab",
        };
        const titles: string[] = [];
        writeSourcePages(
            dir,
            {
                body: {
                    renderSourceBody: (route) => {
                        const element = document.createElement("article");
                        element.textContent = route.subject.name;
                        return element;
                    },
                },
                main: "app",
                renderer: {
                    applyHead: (root, head) => {
                        root.title = head.title;
                    },
                    sourceHead: (held) => {
                        titles.push(held.title);
                        return { description: held.description, path: held.path, robots: "index", title: held.title };
                    },
                },
                site: "https://example.test",
            },
            [{ children: [], parent: { label: "Site", path: "/anatomy/tree" }, subject, text: null }],
            TEMPLATE,
        );
        const html = readFileSync(join(dir, "anatomy/tree/file-a-ts.html"), "utf8");
        expect(html).toContain(`<title>${subject.title}</title>`);
        expect(html).toContain("<article>a.ts</article>");
        expect(titles).toStrictEqual([subject.title]);
        expect(readFileSync(join(dir, "sitemap-sources.xml"), "utf8")).toContain(
            "https://example.test/anatomy/tree/file-a-ts",
        );
    });
});

describe("writeDiscovery", () => {
    it("writes each route's payload and Markdown alternate, the full text, the page sitemap, robots and llms, and stamps the ledger", async () => {
        const dir = folder();
        const ledger = join(folder(), "sitemap.generated.json");
        const [route, stamp] = await writeDiscovery(dir, DISCOVERY, ledger);
        const written = [
            "json/terms.json",
            "json/terms/guide.json",
            "terms.md",
            "index.md",
            "llms-full.txt",
            "llms-full/terms.txt",
            "sitemap-pages.xml",
            "robots.txt",
            "llms.txt",
        ];
        expect(written.every((file) => existsSync(join(dir, file)))).toBe(true);
        expect(route).toBe("/sitemap-pages.xml");
        expect(stamp).not.toBeNull();
        expect(readFileSync(join(dir, "llms.txt"), "utf8")).toContain("/llms-full/terms.txt");
        expect(readFileSync(join(dir, "robots.txt"), "utf8")).not.toContain("sitemap-catalog.xml");
        const stored: unknown = JSON.parse(readFileSync(ledger, "utf8"));
        expect(Object.keys(stored ?? {})).toContain("/terms/guide");
    });
});

describe("writeSitemapParts and writeSitemapIndex", () => {
    it("writes each part of a sitemap and an index naming every part", () => {
        const dir = folder();
        const routes = writeSitemapParts(dir, "/sitemap-catalog.xml", ["https://example.test/a.md"]);
        expect(routes).toStrictEqual(["/sitemap-catalog.xml"]);
        writeSitemapIndex(dir, "https://example.test", [
            ["/sitemap-pages.xml", "2026-10-05"],
            ...routes.map((held): readonly [string, null] => [held, null]),
        ]);
        const index = readFileSync(join(dir, "sitemap.xml"), "utf8");
        expect(index).toContain("https://example.test/sitemap-catalog.xml");
        expect(index).toContain("<lastmod>2026-10-05</lastmod>");
        expect(readFileSync(join(dir, "sitemap-catalog.xml"), "utf8")).toContain("https://example.test/a.md");
    });
});

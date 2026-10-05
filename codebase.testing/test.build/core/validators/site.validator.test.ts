import { ADDRESS, EMPTY, PAGE } from "../converters/site.fixture.ts";
import {
    checkAlternates,
    checkEncodings,
    checkIndexable,
    checkLinks,
    checkPage,
    checkSchema,
    checkSitemap,
    checkText,
} from "@banes-lab/build-scripts/core/validators/site.validator.ts";
import { describe, expect, it } from "vitest";
import {
    missingSchemaField,
    unknownSchemaProperty,
    unknownSchemaType,
} from "@banes-lab/build-scripts/configuration/strings/site.strings.ts";
import type { Seen } from "@banes-lab/build-scripts/types/validation.types.ts";
import { readArtifact } from "@banes-lab/build-scripts/core/converters/build.converter.ts";

const TERMS_FILE = "terms.html";
const EMPTY_FILE = "empty.html";
const SITEMAP_FILE = "sitemap.xml";
const EMPTY_FINDINGS = 4;

const fresh = function fresh(): Seen {
    return { descriptions: new Set(), titles: new Set() };
};

const isServed = function isServed(url: string): boolean {
    return url.endsWith("/json/terms");
};

const schemaPageOf = function schemaPageOf(entity: Record<string, unknown>): string {
    const graph = { "@graph": [{ "@type": "Organization" }, { "@type": "WebPage", url: ADDRESS }, entity] };
    return `<!doctype html><html><head><script type="application/ld+json">${JSON.stringify(graph)}</script></head><body></body></html>`;
};

describe("checkSchema", () => {
    it("wants an organization and a web page entity for the route's address in the structured data", () => {
        const artifact = readArtifact(PAGE);
        expect(checkSchema(TERMS_FILE, artifact, ADDRESS)).toStrictEqual([]);
        expect(checkSchema(TERMS_FILE, artifact, "https://example.test/other")).toHaveLength(1);
        expect(checkSchema(EMPTY_FILE, readArtifact(EMPTY), ADDRESS)).toHaveLength(2);
    });

    it("reports each field a declared schema type expects that its entity leaves out", () => {
        const dataset = { "@type": "Dataset", description: "d", license: "l", name: "n" };
        const lacking = readArtifact(schemaPageOf(dataset));
        expect(checkSchema(TERMS_FILE, lacking, ADDRESS)).toStrictEqual([
            { file: TERMS_FILE, message: missingSchemaField("Dataset", "creator") },
        ]);
        const whole = readArtifact(schemaPageOf({ ...dataset, creator: "c" }));
        expect(checkSchema(TERMS_FILE, whole, ADDRESS)).toStrictEqual([]);
    });

    it("reports a property its type does not register and a type with no registered properties, nested ones included", () => {
        const graph = {
            "@graph": [
                { "@type": "Organization" },
                { "@type": "WebPage", url: ADDRESS },
                { "@type": "CreativeWork", codeRepository: "r", creator: { "@type": "Robot", name: "n" }, name: "n" },
            ],
        };
        const html = `<!doctype html><html><head><script type="application/ld+json">${JSON.stringify(graph)}</script></head><body></body></html>`;
        expect(checkSchema(TERMS_FILE, readArtifact(html), ADDRESS)).toStrictEqual([
            { file: TERMS_FILE, message: unknownSchemaProperty("CreativeWork", "codeRepository") },
            { file: TERMS_FILE, message: unknownSchemaType("Robot") },
        ]);
    });
});

describe("checkEncodings", () => {
    it("reports every encoding the structured data names that the build does not serve", () => {
        const graph = {
            "@graph": [
                {
                    "@type": "WebPage",
                    encoding: [{ contentUrl: "https://example.test/json/terms" }],
                    hasPart: [{ encoding: [{ contentUrl: "https://example.test/json/terms/gone" }] }],
                },
            ],
        };
        const html = `<!doctype html><html><head><script type="application/ld+json">${JSON.stringify(graph)}</script></head><body></body></html>`;
        expect(checkEncodings(TERMS_FILE, readArtifact(html), isServed)).toStrictEqual([
            {
                file: TERMS_FILE,
                message:
                    "The structured data names https://example.test/json/terms/gone as an encoding of the page, and the build does not serve it.",
            },
        ]);
    });
});

describe("checkAlternates", () => {
    it("wants the Markdown and JSON alternate links to name the route's own alternates", () => {
        const twins = { json: "https://example.test/json/terms", markdown: `${ADDRESS}.md` };
        const linked = `<!doctype html><html><head><link rel="alternate" type="text/markdown" href="${twins.markdown}"><link rel="alternate" type="application/json" href="${twins.json}"></head><body></body></html>`;
        expect(checkAlternates(TERMS_FILE, readArtifact(linked), twins)).toStrictEqual([]);
        expect(checkAlternates(TERMS_FILE, readArtifact(PAGE), twins)).toHaveLength(2);
    });
});

describe("checkIndexable", () => {
    it("wants a served route indexable and an error page excluded", () => {
        const served = readArtifact(PAGE);
        const excluded = { ...served, robots: "noindex, nofollow" };
        expect(checkIndexable(TERMS_FILE, served, true)).toStrictEqual([]);
        expect(checkIndexable(TERMS_FILE, excluded, true)).toHaveLength(1);
        expect(checkIndexable("404.html", excluded, false)).toStrictEqual([]);
        expect(checkIndexable("404.html", served, false)).toHaveLength(1);
    });
});

describe("checkPage", () => {
    it("accepts a page with text, a unique title and description and the right canonical", () => {
        expect(checkPage(TERMS_FILE, readArtifact(PAGE), ADDRESS, fresh())).toStrictEqual([]);
    });

    it("reports an empty shell, a blank title, a missing description and a wrong canonical", () => {
        const findings = checkPage(EMPTY_FILE, readArtifact(EMPTY), ADDRESS, fresh());
        expect(findings).toHaveLength(EMPTY_FINDINGS);
        expect(findings.every((finding) => finding.file === EMPTY_FILE)).toBe(true);
    });

    it("reports a title or description another page already used", () => {
        const seen = fresh();
        checkPage(TERMS_FILE, readArtifact(PAGE), ADDRESS, seen);
        expect(checkPage("copy.html", readArtifact(PAGE), ADDRESS, seen)).toHaveLength(2);
    });
});

describe("checkSitemap", () => {
    it("wants every page listed and nothing else", () => {
        const stray = `<urlset><url><loc>${ADDRESS}</loc></url><url><loc>https://example.test/stray</loc></url></urlset>`;
        expect(checkSitemap(SITEMAP_FILE, stray, [ADDRESS, "https://example.test/"])).toHaveLength(2);
        expect(
            checkSitemap(SITEMAP_FILE, `<urlset><url><loc>${ADDRESS}</loc></url></urlset>`, [ADDRESS]),
        ).toStrictEqual([]);
    });
});

describe("checkText", () => {
    it("reports each required fragment the text lacks", () => {
        expect(checkText("llms.txt", "one two", ["one", "three"])).toHaveLength(1);
    });
});

describe("checkLinks", () => {
    it("reports internal links to routes nothing serves, ignoring assets, payloads, fragments and external links", () => {
        const html = `<a href="/terms">ok</a><a href="/terms/guide#setup">ok</a><a href="/gone">bad</a><a href="#top">frag</a><a href="/assets/x.png">asset</a><a href="/json/terms">payload</a><a href="https://example.test/">ext</a>`;
        expect(checkLinks("terms.html", readArtifact(html), new Set(["/", "/terms", "/terms/guide"]))).toStrictEqual([
            { file: "terms.html", message: "Links to /gone, which no pre-rendered route serves." },
        ]);
    });
});

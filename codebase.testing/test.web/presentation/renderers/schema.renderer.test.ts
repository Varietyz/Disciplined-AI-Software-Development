import "@banes-lab/web/presentation/records/grammar.record.ts";
import { AUTHOR_GITHUB, AUTHOR_PROFILE, SITE_URL, pagePath, tabLink } from "@banes-lab/web/core/assets/link.assets.ts";
import {
    COMPANY_CITY,
    COMPANY_COUNTRY,
    COMPANY_FOUNDED,
    COMPANY_NAME,
    COMPANY_NUMBER,
    COMPANY_OWNER,
} from "@banes-lab/web/configuration/strings/company.strings.ts";
import { GRAMMAR_PAGE, HOME_PAGE } from "@banes-lab/web/core/ids/page.ids.ts";
import { describe, expect, it } from "vitest";
import { schemaOf, sourceSchemaOf } from "@banes-lab/web/presentation/renderers/schema.renderer.ts";
import { GRAMMAR_TABS } from "@banes-lab/web/core/generated/grammar.page.generated.ts";
import { loadPage } from "@banes-lab/web/domain/registries/page.registry.ts";

const GRAMMAR = await loadPage(GRAMMAR_PAGE);
const TITLE = "Grammar — Bane's Lab";
const DESCRIPTION = "The grammar.";
const CRUMBS_FOR_TAB = 3;

const typesOf = function typesOf(graph: readonly Readonly<Record<string, unknown>>[]): string[] {
    return graph.map((entity) => String(entity["@type"]));
};

describe("sourceSchemaOf", () => {
    const subject = {
        alternates: { json: "/json/source/tree/a.ts", markdown: "/source/tree/a.ts.md" },
        description: "a.ts is a file in Site.",
        language: "typescript",
        license: "CC-BY-SA-4.0",
        name: "a.ts",
        path: "/anatomy/tree/file-a-ts",
        repository: "https://code.x.test/a.ts",
        tabPath: "/anatomy/tree",
        tabTitle: "Site",
        title: "Site · a.ts · Bane's Lab",
    };

    it("names the page's source code with its language, repository, license and tree", () => {
        const page = sourceSchemaOf(subject)["@graph"].at(-1);
        expect(page?.["@type"]).toBe("WebPage");
        expect(page?.["url"]).toBe(SITE_URL + subject.path);
        expect(page?.["mainEntity"]).toStrictEqual({
            "@type": "SoftwareSourceCode",
            codeRepository: subject.repository,
            isPartOf: { "@id": SITE_URL + subject.tabPath },
            license: subject.license,
            name: subject.name,
            programmingLanguage: subject.language,
        });
    });

    it("leaves out what a folder or an unlicensed tree does not have", () => {
        const page = sourceSchemaOf({ ...subject, language: null, license: null, repository: null })["@graph"].at(-1);
        expect(page?.["mainEntity"]).toStrictEqual({
            "@type": "SoftwareSourceCode",
            isPartOf: { "@id": SITE_URL + subject.tabPath },
            name: subject.name,
        });
    });
});

describe("schemaOf", () => {
    it("always carries the organization, the person, the site and the page, linked by id", () => {
        const graph = schemaOf({ description: DESCRIPTION, path: pagePath(HOME_PAGE), title: TITLE })["@graph"];
        expect(typesOf(graph)).toStrictEqual(["Organization", "Person", "WebSite", "WebPage"]);
        const [organization, person, , page] = graph;
        expect(organization?.["name"]).toBe(COMPANY_NAME);
        expect(organization?.["sameAs"]).toStrictEqual([AUTHOR_GITHUB, AUTHOR_PROFILE]);
        expect(organization?.["vatID"]).toBe(COMPANY_COUNTRY + COMPANY_NUMBER.split(".").join(""));
        expect(organization?.["foundingDate"]).toBe(COMPANY_FOUNDED);
        expect(organization?.["address"]).toMatchObject({
            addressCountry: COMPANY_COUNTRY,
            addressLocality: COMPANY_CITY,
        });
        expect(person?.["name"]).toBe(COMPANY_OWNER);
        expect(page?.["url"]).toBe(SITE_URL + pagePath(HOME_PAGE));
        expect(page?.["breadcrumb"]).toBeUndefined();
    });

    it("adds a breadcrumb trail and the page's own entities for a registered page and its tab", () => {
        const grammar = GRAMMAR;
        const [, second] = GRAMMAR_TABS;
        if (grammar === undefined || second === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        const path = tabLink(GRAMMAR_PAGE, second.id);
        const graph = schemaOf({ definition: grammar, description: DESCRIPTION, path, tab: second, title: TITLE })[
            "@graph"
        ];
        expect(typesOf(graph)).toContain("CreativeWork");
        const page = graph.find((entity) => entity["@type"] === "WebPage");
        const trail: unknown = page?.["breadcrumb"];
        expect(typeof trail === "object" && trail !== null && "itemListElement" in trail).toBe(true);
        const items: unknown = typeof trail === "object" && trail !== null ? Reflect.get(trail, "itemListElement") : [];
        expect(Array.isArray(items) ? items.length : 0).toBe(CRUMBS_FOR_TAB);
    });

    it("lists the tab's sections as parts of the page, each at its own fragment", () => {
        const grammar = GRAMMAR;
        const [, second] = GRAMMAR_TABS;
        if (grammar === undefined || second === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        const path = tabLink(GRAMMAR_PAGE, second.id);
        const graph = schemaOf({ definition: grammar, description: DESCRIPTION, path, tab: second, title: TITLE })[
            "@graph"
        ];
        const parts: unknown = graph.find((entity) => entity["@type"] === "WebPage")?.["hasPart"];
        expect(parts).toStrictEqual(
            second.sections.map((section) => ({
                "@id": `${SITE_URL}${path}#${section.id}`,
                "@type": "WebPageElement",
                encoding: [
                    {
                        "@type": "MediaObject",
                        contentUrl: `${SITE_URL}/json/${GRAMMAR_PAGE}/${second.id}/${section.id}`,
                        encodingFormat: "application/json",
                    },
                    {
                        "@type": "MediaObject",
                        contentUrl: `${SITE_URL}${path}/${section.id}.md`,
                        encodingFormat: "text/markdown",
                    },
                ],
                name: section.title,
                url: `${SITE_URL}${path}#${section.id}`,
            })),
        );
    });

    it("names the page's JSON payload, its Markdown version and its catalog index", () => {
        const grammar = GRAMMAR;
        if (grammar === undefined) {
            throw new Error(GRAMMAR_PAGE);
        }
        const path = pagePath(GRAMMAR_PAGE);
        const graph = schemaOf({ definition: grammar, description: DESCRIPTION, path, title: TITLE })["@graph"];
        const encoding: unknown = graph.find((entity) => entity["@type"] === "WebPage")?.["encoding"];
        const urls: unknown[] = Array.isArray(encoding)
            ? encoding.map((item: unknown) =>
                  typeof item === "object" && item !== null && "contentUrl" in item ? item.contentUrl : undefined,
              )
            : [];
        expect(urls).toStrictEqual([
            `${SITE_URL}/json/${GRAMMAR_PAGE}`,
            `${SITE_URL}${path}.md`,
            `${SITE_URL}/json/api/pages/${GRAMMAR_PAGE}`,
        ]);
    });
});

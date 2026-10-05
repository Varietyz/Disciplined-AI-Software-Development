import { CONTENT_ATTRIBUTE, HREF_ATTRIBUTE } from "#core/ids/element.ids";
import type { PageArtifact, ValidationRoute } from "#types/validation.types";
import { contentOf, tabsIn, textAt } from "@banes-lab/content/core/selectors/payload.selector.ts";
import { pagePath, tabLink } from "@banes-lab/web/core/assets/link.assets.ts";
import { PAYLOAD_ID_KEY } from "@banes-lab/content/configuration/constants/leak.constants.ts";
import { readDocument } from "#core/adapters/document.adapter";

const MAIN_SELECTOR = "main";
const CANONICAL_SELECTOR = 'link[rel="canonical"]';
const MARKDOWN_ALTERNATE_SELECTOR = 'link[rel="alternate"][type="text/markdown"]';
const JSON_ALTERNATE_SELECTOR = 'link[rel="alternate"][type="application/json"]';
const DESCRIPTION_SELECTOR = 'meta[name="description"]';
const ROBOTS_SELECTOR = 'meta[name="robots"]';
const SCHEMA_SELECTOR = 'script[type="application/ld+json"]';
const LINK_SELECTOR = "a[href]";
const LOC_OPEN = "<loc>";
const LOC_CLOSE = "</loc>";

const artifactOf = function artifactOf(document: Document): PageArtifact {
    return {
        alternates: {
            json: document.querySelector(JSON_ALTERNATE_SELECTOR)?.getAttribute(HREF_ATTRIBUTE) ?? null,
            markdown: document.querySelector(MARKDOWN_ALTERNATE_SELECTOR)?.getAttribute(HREF_ATTRIBUTE) ?? null,
        },
        canonical: document.querySelector(CANONICAL_SELECTOR)?.getAttribute(HREF_ATTRIBUTE) ?? null,
        description: document.querySelector(DESCRIPTION_SELECTOR)?.getAttribute(CONTENT_ATTRIBUTE) ?? null,
        links: [...document.querySelectorAll(LINK_SELECTOR)].map((anchor) => anchor.getAttribute(HREF_ATTRIBUTE) ?? ""),
        robots: document.querySelector(ROBOTS_SELECTOR)?.getAttribute(CONTENT_ATTRIBUTE) ?? null,
        schema: document.querySelector(SCHEMA_SELECTOR)?.textContent ?? null,
        text: document.querySelector(MAIN_SELECTOR)?.textContent.trim() ?? "",
        title: document.title,
    };
};

export const readArtifact = function readArtifact(html: string): PageArtifact {
    return readDocument(html, artifactOf);
};

export const locationsOf = function locationsOf(xml: string): string[] {
    const found: string[] = [];
    let cursor = xml.indexOf(LOC_OPEN);
    while (cursor !== -1) {
        const start = cursor + LOC_OPEN.length;
        const end = xml.indexOf(LOC_CLOSE, start);
        if (end === -1) {
            break;
        }
        found.push(xml.slice(start, end));
        cursor = xml.indexOf(LOC_OPEN, end);
    }
    return found;
};

export const tabIdsOf = function tabIdsOf(raw: string): string[] {
    return tabsIn(contentOf(JSON.parse(raw))).flatMap((tab) => {
        const id = textAt(tab, PAYLOAD_ID_KEY);
        return id === null ? [] : [id];
    });
};

export const buildRoutesOf = function buildRoutesOf(
    ids: readonly string[],
    payloadOf: (page: string) => string | null,
): ValidationRoute[] {
    return ids.flatMap((page) => {
        const payload = payloadOf(page);
        const tabs = payload === null ? [] : tabIdsOf(payload).slice(1);
        return [
            { page, path: pagePath(page), tab: null },
            ...tabs.map((tab) => ({ page, path: tabLink(page, tab), tab })),
        ];
    });
};

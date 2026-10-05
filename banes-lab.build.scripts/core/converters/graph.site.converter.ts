import {
    CHAPTER_PREFIX,
    PAGE_KIND,
    PART_KIND,
    ROUTE_PREFIX,
    SECTION_KIND,
    SITE_LAYER,
    TAB_KIND,
} from "#configuration/constants/graph.constants";
import type { Graph, SiteCodes } from "#types/graph.types";
import type { GraphEdge, GraphNode } from "@banes-lab/web/types/graph.types.js";
import type { DiscoveredRoute } from "#types/site.types";
import type { SectionPlan } from "#types/section.types";
import { TAG_FIELD_BY_KIND } from "@banes-lab/content/configuration/constants/panel.constants.ts";
import { citationOf } from "#core/converters/graph.code.converter";
import { isRecord } from "#core/selectors/base.selector";

const PART_PREFIX = "part:";
const PART_MARK = "/";
const NUMBER_MARK = ".";
const KIND_KEY = "kind";
const CAPTION_KEY = "caption";

const listOf = function listOf(value: unknown, key: string): readonly unknown[] {
    const held = isRecord(value) ? value[key] : null;
    return Array.isArray(held) ? held : [];
};

const captionOf = function captionOf(block: unknown): string | null {
    if (!isRecord(block)) {
        return null;
    }
    const kind = typeof block[KIND_KEY] === "string" ? block[KIND_KEY] : "";
    const tag = block[TAG_FIELD_BY_KIND.get(kind) ?? CAPTION_KEY];
    return typeof tag === "string" && tag.length > 0 ? tag : null;
};

export const captionsOf = function captionsOf(section: unknown): readonly string[] {
    const blocks = [
        ...listOf(section, "blocks"),
        ...listOf(section, "subsections").flatMap((subsection) => listOf(subsection, "blocks")),
    ];
    return blocks.flatMap((block) => {
        const caption = captionOf(block);
        return caption === null ? [] : [caption];
    });
};

const refOf = function refOf(path: string): string {
    return ROUTE_PREFIX + path;
};

export const routeGraph = function routeGraph(
    routes: readonly DiscoveredRoute[],
    plans: readonly SectionPlan[],
    codes: SiteCodes,
    contains: string,
): Graph {
    const pages = new Map(routes.filter((route) => route.tab === null).map((route) => [route.page, route.path]));
    const nodes: GraphNode[] = routes.map((route) => ({
        address: null,
        citation: null,
        fields: {},
        href: route.path,
        kind: route.tab === null ? PAGE_KIND : TAB_KIND,
        layer: SITE_LAYER,
        number: (route.tab === null ? codes.pages.get(route.page) : codes.tabs.get(route.path)) ?? null,
        ref: refOf(route.path),
        title: route.label,
    }));
    const tabs = routes.flatMap((route) => {
        const page = pages.get(route.page);
        return route.tab === null || page === undefined
            ? []
            : [{ from: refOf(page), relation: contains, to: refOf(route.path) }];
    });
    const sections = plans.map((plan) => ({ from: refOf(plan.tab.path), relation: contains, to: plan.identity.ref }));
    return { edges: [...tabs, ...sections], nodes };
};

export const siteNodes = function siteNodes(
    plans: readonly SectionPlan[],
    numbers: ReadonlyMap<string, string>,
    codes: SiteCodes,
): readonly GraphNode[] {
    return plans.map((plan) => ({
        address: plan.identity.address,
        citation: citationOf(plan, numbers, codes),
        fields: {},
        href: plan.identity.href,
        kind: SECTION_KIND,
        layer: SITE_LAYER,
        number: numbers.get(plan.identity.ref) ?? null,
        ref: plan.identity.ref,
        title: plan.identity.title,
    }));
};

export const partGraph = function partGraph(
    plans: readonly SectionPlan[],
    numbers: ReadonlyMap<string, string>,
    codes: SiteCodes,
    contains: string,
): Graph {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    for (const plan of plans) {
        const section = plan.identity.ref;
        const number = numbers.get(section) ?? null;
        const citation = citationOf(plan, numbers, codes);
        captionsOf(plan.section).forEach((caption, index) => {
            const ordinal = String(index + 1);
            const ref = PART_PREFIX + section.slice(CHAPTER_PREFIX.length) + PART_MARK + ordinal;
            nodes.push({
                address: null,
                citation: citation === null ? null : citation + NUMBER_MARK + ordinal,
                fields: {},
                href: plan.identity.href,
                kind: PART_KIND,
                layer: SITE_LAYER,
                number: number === null ? null : number + NUMBER_MARK + ordinal,
                ref,
                title: caption,
            });
            edges.push({ from: section, relation: contains, to: ref });
        });
    }
    return { edges, nodes };
};

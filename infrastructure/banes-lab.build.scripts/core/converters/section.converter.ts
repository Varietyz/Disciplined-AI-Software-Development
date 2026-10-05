import {
    CONTAINED_IN_RELATION,
    CONTAINS_RELATION,
    EVIDENCE_FOR_RELATION,
    EVIDENCE_RELATION_ID,
    LINKED_FROM_RELATION,
    LINKS_TO_RELATION,
} from "@banes-lab/web/constants/graph.constants";
import type { DiscoveredPage, Discovery } from "#types/site.types";
import type { Identity, Leaf, Link, Linker, Relation } from "#types/catalog.types";
import { PAYLOAD_ID_KEY, PAYLOAD_LABEL_KEY } from "@banes-lab/content/configuration/constants/leak.constants.ts";
import type { SectionEdges, SectionPlan, SectionShape, SectionSources, TabShape } from "#types/section.types";
import { linkTargetsOf, stringsOf } from "@banes-lab/content/core/converters/section.converter.ts";
import { tabsIn, textAt } from "@banes-lab/content/core/selectors/payload.selector.ts";
import { CHAPTER_PREFIX } from "#configuration/constants/graph.constants";
import type { ContentGraph } from "@banes-lab/web/types/methodology.types.js";
import { isRecord } from "#core/selectors/base.selector";
import { noRoute } from "#configuration/strings/catalog.strings";
import { partedSection } from "#core/converters/section.segment.converter";
import { placedOf } from "#core/converters/location.converter";
import { relationGroups } from "#core/converters/link.converter";
import { renderSectionLeaf } from "#core/formatters/section.formatter";
import { sectionLeaf } from "#core/resolvers/catalog.resolver";

const FRAGMENT = "#";
const SECTION_KIND = "section";
const HEADING_MARK = "#";
const LINE_END = "\n";

const isSection = function isSection(value: unknown): value is SectionShape {
    return isRecord(value) && typeof value["id"] === "string" && typeof value["title"] === "string";
};

const sectionList = function sectionList(value: unknown): readonly SectionShape[] {
    return isRecord(value) && Array.isArray(value["sections"]) ? value["sections"].filter(isSection) : [];
};

const routePath = function routePath(discovery: Discovery, page: string, tab: string | null): string {
    const route = discovery.routes.find((candidate) => candidate.page === page && candidate.tab === tab);
    if (route === undefined) {
        throw new Error(noRoute(page, String(tab)));
    }
    return route.path;
};

export const tabsOf = function tabsOf(discovery: Discovery, page: DiscoveredPage): readonly TabShape[] {
    const { content } = page;
    const tabs = tabsIn(content);
    if (tabs.length > 0) {
        return tabs.map((tab, index) => {
            const id = textAt(tab, PAYLOAD_ID_KEY) ?? "";
            const label = textAt(tab, PAYLOAD_LABEL_KEY) ?? id;
            return {
                id,
                label,
                path: routePath(discovery, page.id, index === 0 ? null : id),
                sections: sectionList(tab),
            };
        });
    }
    const sections = sectionList(content);
    return sections.length === 0 ? [] : [{ id: null, label: page.label, path: page.path, sections }];
};

export const documentPages = function documentPages(discovery: Discovery): readonly DiscoveredPage[] {
    return discovery.pages.filter((page) => tabsOf(discovery, page).some((tab) => tab.id === null));
};

export const sectionPlans = function sectionPlans(
    discovery: Discovery,
    summarize: (markdown: string) => string | null,
): readonly SectionPlan[] {
    return discovery.pages.flatMap((page) =>
        tabsOf(discovery, page).flatMap((tab) =>
            tab.sections.map((section) => {
                const href = tab.path + FRAGMENT + section.id;
                const identity: Identity = {
                    address: sectionLeaf(page.id, tab.id, section.id),
                    href,
                    kind: SECTION_KIND,
                    ref: CHAPTER_PREFIX + href,
                    summary: section.intro === undefined ? null : summarize(section.intro),
                    title: section.title,
                };
                return { identity, page, section, tab };
            }),
        ),
    );
};

export const withoutHeading = function withoutHeading(markdown: string): string {
    const trimmed = markdown.trim();
    const end = trimmed.indexOf(LINE_END);
    const first = end === -1 ? trimmed : trimmed.slice(0, end);
    return first.startsWith(HEADING_MARK) ? trimmed.slice(first.length).trim() : trimmed;
};

const targetsOf = function targetsOf(value: unknown): readonly string[] {
    return stringsOf(value).flatMap(linkTargetsOf);
};

const linksOf = function linksOf(plan: SectionPlan, linker: Linker): readonly Link[] {
    const held = new Map<string, Link>();
    for (const target of targetsOf(plan.section)) {
        const href = target.startsWith(FRAGMENT) ? null : target;
        const identity = href === null ? null : linker.byHref(href);
        if (identity !== null && identity.ref !== plan.identity.ref && !held.has(identity.ref)) {
            held.set(identity.ref, linker.link(identity.title, identity.ref));
        }
    }
    return [...held.values()];
};

const graphOf = function graphOf(graphs: readonly ContentGraph[], plan: SectionPlan): object | null {
    const graph = graphs.find((candidate) => candidate.page === plan.page.id);
    return graph?.sections[plan.section.id] ?? null;
};

export const sectionEdges = function sectionEdges(plans: readonly SectionPlan[], linker: Linker): SectionEdges {
    const outgoing = new Map(plans.map((plan) => [plan.identity.ref, linksOf(plan, linker)]));
    const incoming = new Map<string, Link[]>();
    for (const plan of plans) {
        for (const link of outgoing.get(plan.identity.ref) ?? []) {
            const held = incoming.get(link.ref ?? "") ?? [];
            incoming.set(link.ref ?? "", [...held, linker.link(plan.identity.title, plan.identity.ref)]);
        }
    }
    return { incoming, outgoing };
};

const sectionRelations = function sectionRelations(
    sources: SectionSources,
    ref: string,
    href: string,
): readonly Relation[] {
    const folder = sources.folder(ref);
    return relationGroups([
        { links: sources.links(ref), relation: LINKS_TO_RELATION },
        { links: folder?.contains ?? [], relation: CONTAINS_RELATION },
        { links: folder?.containedIn ? [folder.containedIn] : [], relation: CONTAINED_IN_RELATION },
        { links: sources.linkedBy(ref), relation: LINKED_FROM_RELATION },
        { links: sources.evidence(href), relation: EVIDENCE_RELATION_ID },
        { links: sources.grounds(ref), relation: EVIDENCE_FOR_RELATION },
    ]);
};

export const sectionLeaves = function sectionLeaves(
    plans: readonly SectionPlan[],
    sources: SectionSources,
): readonly Leaf[] {
    const tabs = new Map(plans.map((plan) => [plan.tab.path, plan.tab]));
    const bodies = new Map(
        [...tabs.values()].map((tab) => [
            tab.path,
            sources
                .bodies(
                    tab.path,
                    tab.sections.map((section) => section.id),
                )
                .map(withoutHeading),
        ]),
    );
    return plans.flatMap((plan) => {
        const { identity } = plan;
        const href = identity.href ?? "";
        const data = {
            content: plan.section,
            graph: graphOf(sources.graphs, plan),
            href: sources.linker.site + href,
            number: sources.numbers.get(identity.ref) ?? null,
            page: plan.page.id,
            ref: identity.ref,
            relations: sectionRelations(sources, identity.ref, href),
            route: sources.navigation(href),
            section: plan.section.id,
            summary: identity.summary,
            tab: plan.tab.id,
            title: identity.title,
            ...placedOf(sources.placement(identity.ref)),
        };
        const at = plan.tab.sections.indexOf(plan.section);
        const body = sources.linker.relink(bodies.get(plan.tab.path)?.[at] ?? "", plan.tab.path);
        const leaf = { data, identity, markdown: renderSectionLeaf(data, plan.page.label, plan.tab.label, body) };
        return partedSection(leaf, plan.section, sources.linker.site);
    });
};

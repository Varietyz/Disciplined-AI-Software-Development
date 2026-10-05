import { API_PREFIX, INDEX_KIND } from "#configuration/constants/catalog.constants";
import type { Alternate, IndexPlan } from "#types/index.types";
import type { DiscoveredPage, DiscoveredRoute, Discovery } from "#types/site.types";
import { jsonPath, markdownPathOf } from "#core/resolvers/route.resolver";
import type { Identity } from "#types/catalog.types";
import type { SectionPlan } from "#types/section.types";
import { pageIndex } from "#core/resolvers/catalog.resolver";
import { tabsOf } from "#core/converters/section.converter";

const SLASH = "/";
const TITLE_JOINER = " · ";

const alternateOf = function alternateOf(site: string, route: DiscoveredRoute | undefined): Alternate | null {
    return route === undefined ? null : { json: site + jsonPath(route), markdown: site + markdownPathOf(route.path) };
};

const pageRef = function pageRef(page: string, tab: string | null): string {
    return API_PREFIX + SLASH + (tab === null ? page : page + SLASH + tab);
};

const sectionRefs = function sectionRefs(plans: readonly SectionPlan[], page: string, tab: string | null): string[] {
    return plans.filter((plan) => plan.page.id === page && plan.tab.id === tab).map((plan) => plan.identity.ref);
};

const isTabbed = function isTabbed(discovery: Discovery, page: DiscoveredPage): boolean {
    return tabsOf(discovery, page).some((tab) => tab.id !== null);
};

export const tabIndexPlans = function tabIndexPlans(
    discovery: Discovery,
    plans: readonly SectionPlan[],
): readonly IndexPlan[] {
    return discovery.pages.flatMap((page) =>
        tabsOf(discovery, page).flatMap((tab) => {
            if (tab.id === null) {
                return [];
            }
            const route = discovery.routes.find((candidate) => candidate.path === tab.path);
            const identity: Identity = {
                address: pageIndex(page.id, tab.id),
                href: tab.path,
                kind: INDEX_KIND,
                ref: pageRef(page.id, tab.id),
                summary: route?.description ?? null,
                title: page.label + TITLE_JOINER + tab.label,
            };
            const data = {
                alternate: alternateOf(discovery.site, route),
                page: page.id,
                ref: identity.ref,
                tab: tab.id,
                title: identity.title,
            };
            return [{ data, identity, refs: sectionRefs(plans, page.id, tab.id) }];
        }),
    );
};

const pageRefsOf = function pageRefsOf(
    discovery: Discovery,
    plans: readonly SectionPlan[],
    page: DiscoveredPage,
    tabbed: boolean,
): readonly string[] {
    if (page.path === SLASH) {
        return discovery.pages.filter((other) => other.path !== SLASH).map((other) => pageRef(other.id, null));
    }
    return tabbed ? tabsOf(discovery, page).map((tab) => pageRef(page.id, tab.id)) : sectionRefs(plans, page.id, null);
};

export const pageIndexPlans = function pageIndexPlans(
    discovery: Discovery,
    plans: readonly SectionPlan[],
): readonly IndexPlan[] {
    return discovery.pages.map((page) => {
        const tabbed = isTabbed(discovery, page);
        const identity: Identity = {
            address: pageIndex(page.id),
            href: page.path,
            kind: INDEX_KIND,
            ref: pageRef(page.id, null),
            summary: page.description,
            title: page.label,
        };
        const refs = pageRefsOf(discovery, plans, page, tabbed);
        const data = {
            alternate: alternateOf(discovery.site, page),
            page: page.id,
            ref: identity.ref,
            tabbed,
            title: page.label,
        };
        return { data, identity, refs };
    });
};

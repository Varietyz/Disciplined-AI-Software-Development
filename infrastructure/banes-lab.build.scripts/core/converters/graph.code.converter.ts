import { CHAPTER_PREFIX } from "#configuration/constants/graph.constants";
import type { DiscoveredRoute } from "#types/site.types";
import type { RouteStop } from "#types/learning.types";
import type { SectionPlan } from "#types/section.types";
import type { SiteCodes } from "#types/graph.types";
import { chunkCode } from "#core/converters/learning.converter";
import { isRecord } from "#core/selectors/base.selector";

const PAGE_LETTERS = "abcdefghijklmnopqrstuvwxyz";

export const numbersIn = function numbersIn(report: unknown): ReadonlyMap<string, string> {
    const graph = isRecord(report) ? report["graph"] : null;
    const nodes = isRecord(graph) && Array.isArray(graph["nodes"]) ? graph["nodes"] : [];
    return new Map(
        nodes.flatMap((node: unknown) =>
            isRecord(node) && typeof node["ref"] === "string" && typeof node["number"] === "string"
                ? [[node["ref"], node["number"]] as const]
                : [],
        ),
    );
};

export const sectionNumbers = function sectionNumbers(
    plans: readonly SectionPlan[],
    stops: readonly RouteStop[],
): ReadonlyMap<string, string> {
    const onRoute = new Map(stops.map((stop) => [CHAPTER_PREFIX + stop.path, stop.position]));
    const numbers = new Map<string, string>();
    let next = stops.length;
    for (const plan of plans) {
        const position = onRoute.get(plan.identity.ref);
        if (position === undefined) {
            next += 1;
        }
        numbers.set(plan.identity.ref, String(position ?? next));
    }
    return numbers;
};

const tabOrder = function tabOrder(
    routes: readonly DiscoveredRoute[],
    plans: readonly SectionPlan[],
    stops: readonly RouteStop[],
): ReadonlyMap<string, string> {
    const tabOf = new Map(plans.map((plan) => [plan.identity.ref, plan.tab.path]));
    const codes = new Map<string, string>();
    for (const stop of stops) {
        const tab = tabOf.get(CHAPTER_PREFIX + stop.path);
        if (tab !== undefined && !codes.has(tab)) {
            codes.set(tab, stop.code);
        }
    }
    const taken = new Set(codes.values());
    let next = 0;
    const unrouted = [
        ...new Set([
            ...routes.flatMap((route) => (route.tab === null ? [] : [route.path])),
            ...plans.map((plan) => plan.tab.path),
        ]),
    ].filter((tab) => !codes.has(tab));
    for (const tab of unrouted) {
        while (taken.has(chunkCode(next))) {
            next += 1;
        }
        codes.set(tab, chunkCode(next));
        taken.add(chunkCode(next));
    }
    return codes;
};

export const siteCodes = function siteCodes(
    routes: readonly DiscoveredRoute[],
    plans: readonly SectionPlan[],
    stops: readonly RouteStop[],
): SiteCodes {
    const tabs = tabOrder(routes, plans, stops);
    const pageOfTab = new Map([
        ...routes.flatMap((route) => (route.tab === null ? [] : [[route.path, route.page] as const])),
        ...plans.map((plan) => [plan.tab.path, plan.page.page] as const),
    ]);
    const ordered = [
        ...new Set([
            ...[...tabs.keys()].flatMap((tab) => {
                const page = pageOfTab.get(tab);
                return page === undefined ? [] : [page];
            }),
            ...routes.map((route) => route.page),
        ]),
    ];
    return { pages: new Map(ordered.map((page, at) => [page, PAGE_LETTERS.charAt(at) || chunkCode(at)])), tabs };
};

export const citationOf = function citationOf(
    plan: SectionPlan,
    numbers: ReadonlyMap<string, string>,
    codes: SiteCodes,
): string | null {
    const number = numbers.get(plan.identity.ref);
    const code = codes.tabs.get(plan.tab.path);
    return number === undefined || code === undefined ? null : code + number;
};

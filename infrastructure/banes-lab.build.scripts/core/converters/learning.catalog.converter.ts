import { CATALOG_FILE_BUDGET, INDEX_PART_BUDGET, INDEX_PART_KIND } from "#configuration/constants/catalog.constants";
import {
    CHAPTER_PREFIX,
    GRAPH_VOCABULARY,
    PAGE_KIND,
    PART_KIND,
    ROUTE_PREFIX,
    SECTION_KIND,
    SITE_LAYER,
    TAB_KIND,
} from "#configuration/constants/graph.constants";
import type { Leaf, Link, Linker, Navigation, NumberRow } from "#types/catalog.types";
import { indexPart, numbersIndex, pageIndex, routeIndex } from "#core/resolvers/catalog.resolver";
import { packedParts, serialize } from "#core/stores/catalog.store";
import { renderNumbers, renderRoute } from "#core/formatters/route.formatter";
import { Buffer } from "node:buffer";
import type { DiscoveredRoute } from "#types/site.types";
import type { Graph } from "#types/graph.types";
import type { GraphNode } from "@banes-lab/web/types/graph.types.js";
import type { LearningBlock } from "@banes-lab/web/types/learning.types.js";
import type { RouteStop } from "#types/learning.types";
import { indexPartTitle } from "#configuration/strings/catalog.strings";
import { renderIndex } from "#core/formatters/index.formatter";

const ROUTE_REF = "api:route";
const ROUTE_KIND = "route";
const NUMBERS_REF = "api:numbers";
const NUMBERS_KIND = "numbers";
const PART_REF_MARK = "/";
const ROUTE_KINDS: ReadonlySet<string> = new Set([PAGE_KIND, TAB_KIND]);

export const routeStops = function routeStops(blocks: readonly LearningBlock[]): readonly RouteStop[] {
    return blocks
        .flatMap((block) => block.stops.map((stop) => ({ block: block.label, code: block.code, stop })))
        .map(({ block, code, stop }, position) => ({
            block,
            code,
            id: stop.id,
            label: stop.label,
            path: stop.path,
            position: position + 1,
            requires: stop.requires,
        }));
};

const stopLink = function stopLink(linker: Linker, stop: RouteStop | undefined): Link | null {
    return stop === undefined ? null : linker.link(stop.label, CHAPTER_PREFIX + stop.path);
};

export const navigationOf = function navigationOf(
    stops: readonly RouteStop[],
    linker: Linker,
): (href: string) => Navigation | null {
    const byPath = new Map(stops.map((stop) => [stop.path, stop]));
    const byId = new Map(stops.map((stop) => [stop.id, stop]));
    return (href) => {
        const stop = byPath.get(href);
        if (stop === undefined) {
            return null;
        }
        return {
            next: stopLink(linker, stops[stop.position]),
            position: stop.position,
            previous: stopLink(linker, stops[stop.position - 2]),
            requires: stop.requires.flatMap((id) => {
                const found = stopLink(linker, byId.get(id));
                return found === null ? [] : [found];
            }),
            stop: stop.id,
            total: stops.length,
        };
    };
};

const routeLinkOf = function routeLinkOf(node: GraphNode, route: DiscoveredRoute, linker: Linker): Link {
    const address = pageIndex(route.page, route.tab);
    return {
        href: linker.site + route.path,
        json: address.json,
        label: node.title,
        markdown: address.markdown,
        ref: node.ref,
    };
};

export const numberRows = function numberRows(
    graph: Graph,
    routes: readonly DiscoveredRoute[],
    linker: Linker,
): readonly NumberRow[] {
    const parents = new Map(
        graph.edges
            .filter((edge) => edge.relation === GRAPH_VOCABULARY.contains)
            .map((edge) => [edge.to, edge.from] as const),
    );
    const routeOf = new Map(routes.map((route) => [ROUTE_PREFIX + route.path, route]));
    const ordinals = new Map<string, number>();
    const rowOf = function rowOf(node: GraphNode, number: string): NumberRow | null {
        const route = routeOf.get(node.ref);
        if (ROUTE_KINDS.has(node.kind) && route !== undefined) {
            return { kind: node.kind, link: routeLinkOf(node, route, linker), number, part: null };
        }
        if (node.kind === SECTION_KIND) {
            return { kind: node.kind, link: linker.link(node.title, node.ref), number, part: null };
        }
        const section = parents.get(node.ref);
        if (node.kind !== PART_KIND || section === undefined) {
            return null;
        }
        const part = (ordinals.get(section) ?? 0) + 1;
        ordinals.set(section, part);
        return { kind: node.kind, link: linker.link(node.title, section), number, part };
    };
    return graph.nodes.flatMap((node) => {
        const row = node.layer === SITE_LAYER && node.number !== null ? rowOf(node, node.number) : null;
        return row === null ? [] : [row];
    });
};

const numberPart = function numberPart(rows: readonly NumberRow[], part: number, total: number, title: string): Leaf {
    const ref = NUMBERS_REF + PART_REF_MARK + String(part);
    const partTitle = indexPartTitle(title, part, total);
    return {
        data: { numbers: rows, part, ref, title: partTitle, total },
        identity: {
            address: indexPart(numbersIndex(), String(part)),
            href: null,
            kind: INDEX_PART_KIND,
            ref,
            summary: null,
            title: partTitle,
        },
        markdown: renderNumbers(partTitle, rows),
    };
};

export const numbersLeaves = function numbersLeaves(
    rows: readonly NumberRow[],
    site: string,
    title: string,
    budget = CATALOG_FILE_BUDGET,
    partBudget = INDEX_PART_BUDGET,
): readonly Leaf[] {
    const identity = {
        address: numbersIndex(),
        href: null,
        kind: NUMBERS_KIND,
        ref: NUMBERS_REF,
        summary: null,
        title,
    };
    const whole = { numbers: rows, ref: NUMBERS_REF, title, total: rows.length };
    if (Buffer.byteLength(serialize(whole)) <= budget) {
        return [{ data: whole, identity, markdown: renderNumbers(title, rows) }];
    }
    const parts = packedParts(rows, partBudget);
    const leaves = parts.map((part, index) => numberPart(part, index + 1, parts.length, title));
    const summaries = leaves.map((leaf, index) => ({
        count: parts[index]?.length ?? 0,
        first: parts[index]?.at(0)?.number ?? "",
        json: site + leaf.identity.address.json,
        last: parts[index]?.at(-1)?.number ?? "",
        markdown: leaf.identity.address.markdown === null ? null : site + leaf.identity.address.markdown,
    }));
    const data = { parts: summaries, ref: NUMBERS_REF, title, total: rows.length };
    return [...leaves, { data, identity, markdown: renderIndex(identity, data, [], site) }];
};

export const routeLeaf = function routeLeaf(stops: readonly RouteStop[], linker: Linker, title: string): Leaf {
    const entries = stops.map((stop) => ({
        block: stop.block,
        link: linker.link(stop.label, CHAPTER_PREFIX + stop.path),
        position: stop.position,
        requires: stop.requires.map((id) => stops.find((candidate) => candidate.id === id)?.position ?? null),
        stop: stop.id,
    }));
    const address = routeIndex();
    return {
        data: { ref: ROUTE_REF, stops: entries, title, total: stops.length },
        identity: { address, href: null, kind: ROUTE_KIND, ref: ROUTE_REF, summary: null, title },
        markdown: renderRoute(title, entries),
    };
};

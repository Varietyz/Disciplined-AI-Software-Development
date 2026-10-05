import type { Link, Linker, Relation } from "#types/catalog.types";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { GraphNode } from "@banes-lab/web/types/graph.types.js";

const FENCE = "```";
const LINE_END = "\n";
const TARGET_OPEN = "](";
const TARGET_CLOSE = ")";

const rewriteLine = function rewriteLine(line: string, rewrite: (target: string) => string): string {
    let out = "";
    let cursor = 0;
    for (;;) {
        const open = line.indexOf(TARGET_OPEN, cursor);
        const close = open === -1 ? -1 : line.indexOf(TARGET_CLOSE, open);
        if (close === -1) {
            return out + line.slice(cursor);
        }
        const start = open + TARGET_OPEN.length;
        out += line.slice(cursor, start) + rewrite(line.slice(start, close));
        cursor = close;
    }
};

export const rewriteTargets = function rewriteTargets(markdown: string, rewrite: (target: string) => string): string {
    let fenced = false;
    return markdown
        .split(LINE_END)
        .map((line) => {
            if (line.startsWith(FENCE)) {
                fenced = !fenced;
                return line;
            }
            return fenced ? line : rewriteLine(line, rewrite);
        })
        .join(LINE_END);
};

const linkKey = function linkKey(link: Link): string {
    return link.ref ?? link.href ?? link.label;
};

export const relationGroups = function relationGroups(groups: readonly Relation[]): readonly Relation[] {
    const merged = new Map<string, readonly Link[]>();
    for (const group of groups) {
        const held = merged.get(group.relation) ?? [];
        const seen = new Set(held.map(linkKey));
        merged.set(group.relation, [...held, ...group.links.filter((link) => !seen.has(linkKey(link)))]);
    }
    return [...merged.entries()]
        .filter(([, links]) => links.length > 0)
        .map(([relation, links]) => ({ links, relation }));
};

export const nodeLinks = function nodeLinks(
    linker: Linker,
    nodes: ReadonlyMap<string, GraphNode>,
    edges: readonly EdgeRef[],
): readonly Link[] {
    return edges.map((edge) => {
        const href = edge.ref === null ? null : (nodes.get(edge.ref)?.href ?? null);
        const identity = href === null ? null : linker.byHref(href);
        if (identity !== null) {
            return linker.link(edge.label, identity.ref);
        }
        return href === null
            ? linker.link(edge.label, edge.ref)
            : { href: linker.site + href, json: null, label: edge.label, markdown: null, ref: edge.ref };
    });
};

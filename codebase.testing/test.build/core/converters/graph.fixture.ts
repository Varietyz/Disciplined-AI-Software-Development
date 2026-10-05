import type { GraphNode } from "@banes-lab/web/types/graph.types.ts";
import type { RouteStop } from "@banes-lab/build-scripts/types/learning.types.ts";
import type { SectionPlan } from "@banes-lab/build-scripts/types/section.types.ts";
import type { Vocabulary } from "@banes-lab/build-scripts/types/graph.types.ts";

export const REFERENCED_BY = "referenced-by";
export const LINKS_TO = "links-to";

export const VOCABULARY: Vocabulary = {
    calls: "calls",
    contains: "contains",
    pairs: [
        { forward: "calls", reverse: "called-by" },
        { forward: "contains", reverse: "contained-in" },
        { forward: "term", reverse: "term-of" },
        { forward: "requires", reverse: REFERENCED_BY },
        { forward: "enables", reverse: REFERENCED_BY },
    ],
};

export const graphNode = function graphNode(ref: string, href: string | null): GraphNode {
    return { address: null, citation: null, fields: {}, href, kind: "k", layer: "site", number: null, ref, title: ref };
};

const plan = function plan(href: string, section: object): SectionPlan {
    return {
        identity: {
            address: { json: `/json${href}`, markdown: null },
            href,
            kind: "section",
            ref: `chapter:${href}`,
            summary: null,
            title: href,
        },
        page: {
            content: null,
            description: "",
            id: "p",
            label: "P",
            markdown: "",
            page: "p",
            path: "/p",
            tab: null,
            title: "P",
        },
        section: { id: href, title: href, ...section },
        tab: { id: null, label: "P", path: "/p", sections: [] },
    };
};

const stop = function stop(path: string, position: number): RouteStop {
    return { block: "b", code: "aa", id: path, label: path, path, position, requires: [] };
};

export const ROUTE = { description: "", label: "P", markdown: "", page: "p", path: "/p", tab: null, title: "P" };
export const BUILD_TAB = { ...ROUTE, label: "Build", path: "/p/build", tab: "build" };
export const STOPS: readonly RouteStop[] = [stop("/p#taught", 1)];

export const PLANS: readonly SectionPlan[] = [
    plan("/p#narrative", {}),
    plan("/p#taught", {
        blocks: [{ caption: "the model", kind: "mermaid" }],
        subsections: [
            {
                blocks: [
                    { kind: "text", text: "x" },
                    { code: "c", kind: "code", title: "a sample" },
                ],
            },
        ],
    }),
];

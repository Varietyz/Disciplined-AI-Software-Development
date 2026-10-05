import type { AnatomyFile, AnatomySnapshot } from "@banes-lab/web/types/anatomy.types.js";
import type { DiscoveredPage, Discovery } from "@banes-lab/build-scripts/types/site.types.ts";
import type { Entry, Identity } from "@banes-lab/build-scripts/types/catalog.types.ts";

export const SITE = "https://example.test";

export const METHOD: DiscoveredPage = {
    content: {
        tabs: [
            { id: "start", label: "Start", sections: [{ id: "loop", title: "The loop" }] },
            { id: "build", label: "Build", sections: [{ id: "gate", title: "The gate" }] },
        ],
    },
    description: "The method.",
    id: "method",
    label: "Method",
    markdown: "",
    page: "method",
    path: "/method",
    tab: null,
    title: "Method — Site",
};

export const DISCOVERY: Discovery = {
    author: "Ada",
    consent: "Yes.",
    name: "Site",
    pages: [METHOD],
    routes: [METHOD, { ...METHOD, description: "Building.", label: "Build", path: "/method/build", tab: "build" }],
    site: SITE,
    summary: "A site.",
};

const STATS = {
    bytes: 0,
    callable: 0,
    definitions: 0,
    edges: 0,
    exported: 0,
    files: 1,
    findings: {},
    flows: {},
    lines: { blank: 0, code: 0, total: 0 },
};

export const FILE: AnatomyFile = {
    definitions: [],
    distribution: { invariants: [], variants: [] },
    document: null,
    findings: [],
    generated: false,
    id: "a.ts",
    inherited: false,
    layer: null,
    name: "a.ts",
    path: "a.ts",
    slots: null,
    source: null,
    stats: STATS,
    walk: null,
};

export const EMPTY_SNAPSHOT: AnatomySnapshot = {
    charts: [],
    findings: [],
    imports: [],
    metrics: {
        callable: 0,
        definitions: 0,
        edges: 0,
        exported: 0,
        findings: {},
        flows: {},
        maxInDegree: 0,
        maxOutDegree: 0,
        resolutionRate: 1,
        unresolvedCalls: 0,
    },
    states: [],
    tree: {
        files: [FILE],
        findings: [],
        folders: [],
        id: "root",
        layer: null,
        name: "",
        path: "",
        role: "member",
        stats: STATS,
        walk: null,
    },
    unresolvedCalls: [],
};

export const FACET_GROUP = {
    collection: "architecture",
    field: "severity",
    ids: ["a"],
    slug: "mandatory",
    value: "mandatory",
};

export const entry = function entry(ref: string, title: string): Entry {
    return {
        bytes: 1,
        fingerprint: "f",
        href: null,
        json: `${SITE}/json/${title}`,
        kind: "section",
        markdown: null,
        ref,
        summary: null,
        title,
    };
};

export const fileIdentity = function fileIdentity(path: string): Identity {
    return {
        address: { json: `/json/source/build/${path}`, markdown: null },
        href: null,
        kind: "file",
        ref: `anatomy:file-${path}`,
        summary: null,
        title: path,
    };
};

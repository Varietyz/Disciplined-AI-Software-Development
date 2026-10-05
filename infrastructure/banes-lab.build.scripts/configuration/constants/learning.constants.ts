export const SPINE = "disciplined-methodology";

export const SITE_PAGES: readonly string[] = ["pag", SPINE, "software-architecture", "ontology", "anatomy"];

export const ROUTE_SECTIONS_POPULATION = "route sections";

export const ROUTE_SECTION_PARTS = {
    graphless: "on a page with no content graph",
    routed: "routed",
    silent: "in a tab that teaches nothing",
    unheld: "routed with no content graph entry",
    untitled: "untitled",
} as const;

export const UNSAFE_LABEL_CHARACTERS: ReadonlySet<string> = new Set(['"', "[", "]", "{", "}", "(", ")"]);

export const FOLDED_CHARACTERS: ReadonlyMap<string, string> = new Map([
    ["’", "'"],
    ["‘", "'"],
    ["“", "'"],
    ["”", "'"],
    ["—", "-"],
    ["–", "-"],
    ["·", "-"],
    [" ", " "],
]);

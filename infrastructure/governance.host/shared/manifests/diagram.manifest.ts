export const DIAGRAM_KEYWORDS: ReadonlySet<string> = new Set([
    "call",
    "class",
    "classDef",
    "click",
    "default",
    "direction",
    "end",
    "flowchart",
    "graph",
    "href",
    "interpolate",
    "linkStyle",
    "style",
    "subgraph",
]);

export const DIAGRAM_GROUP_KEYWORD = "subgraph";

export const DIAGRAM_HEADERS: ReadonlySet<string> = new Set(["flowchart", "graph"]);

export const DIAGRAM_SHAPE_OPENERS: ReadonlySet<string> = new Set(["[", "(", "{", ">"]);

export const DIAGRAM_EDGE_CHARACTERS: ReadonlySet<string> = new Set(["-", ".", "=", ">"]);

export const DIAGRAM_IDENTIFIER_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";

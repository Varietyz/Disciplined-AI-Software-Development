import type { RenderContext } from "@govlab/docs/types/readme.types.ts";

export const README_CONTEXT: RenderContext = {
    concepts: [],
    docs: {
        aiContext: "A leaf.",
        configuration: "None.",
        disposal: ["Remove it."],
        overview: "Does a thing.",
        quickStart: [{ code: "run();", intent: "Run", lang: "ts" }],
        "the-extra": "Extra section.",
        whenNotToUse: ["b"],
        whenToUse: ["a"],
    },
    domains: [],
    hasCharts: false,
    maturity: "stable",
    moduleDir: "module",
    name: "mod",
    pkg: { dependencies: { "@govlab/constants": "*" } },
    principles: [],
    repo: null,
    scoped: "@govlab/mod",
    summary: "A module.",
    surface: [{ axis: "main", kind: "fn", name: "run", signature: "function run(): void" }],
};

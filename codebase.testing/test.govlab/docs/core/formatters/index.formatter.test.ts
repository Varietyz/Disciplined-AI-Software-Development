import { describe, expect, it } from "vitest";
import { renderIndexMarkdown, roleOf } from "@govlab/docs/core/formatters/index.formatter.ts";
import type { PackageInfo } from "@govlab/docs/types/index.types.ts";
import { relativePath } from "@ssot/paths";

const packageOf = function packageOf(name: string, siblingDeps: string[], purpose: string | null): PackageInfo {
    return {
        barrelExports: 3,
        description: `${name} description`,
        externalDeps: [],
        group: "tools",
        hasReadme: true,
        name,
        path: name,
        purpose,
        siblingDeps,
        slug: name,
        sourceFiles: 2,
        sourceLoc: 40,
        version: "0.0.0",
    };
};

const PACKAGES = [
    packageOf("@x/leaf", [], "Does one thing. More."),
    packageOf("@x/frame", ["@x/leaf", "@x/other"], null),
];

describe("roleOf", () => {
    it("names the application and tooling groups and marks anything else unclassified", () => {
        expect(roleOf(relativePath("app.root"))).toContain("application");
        expect(roleOf(relativePath("govlab.root"))).toContain("tooling");
        expect(roleOf("elsewhere")).toBe("(unclassified group)");
    });
});

describe("renderIndexMarkdown", () => {
    it("renders the summary, tree, dependency, inventory, concern and composition sections", () => {
        const markdown = renderIndexMarkdown(PACKAGES, { tools: PACKAGES });
        expect(markdown.startsWith("# Workspace Index")).toBe(true);
        expect(markdown).toContain("**2 packages** — 1 leaves, 1 composers");
        expect(markdown).toContain("└── tools/");
        expect(markdown).toContain("@x/frame ← composes 2 peers");
        expect(markdown).toContain("| `@x/leaf` | tools | — | 3 exports | 2 | 40 |");
        expect(markdown).toContain("| Does one thing | `@x/leaf` |");
        expect(markdown).toContain("- Use `@x/frame` to get `@x/leaf` + `@x/other` already wired together.");
    });
});

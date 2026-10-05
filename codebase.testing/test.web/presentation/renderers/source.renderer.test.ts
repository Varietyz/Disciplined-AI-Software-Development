import { describe, expect, it } from "vitest";
import type { SourceBody } from "@banes-lab/web/types/page.types.ts";
import { renderSourceBody } from "@banes-lab/web/presentation/renderers/source.renderer.ts";

const BODY: SourceBody = {
    children: [{ label: "a.ts", path: "/anatomy/tree/file-a-ts" }],
    parent: { label: "Site", path: "/anatomy/tree" },
    subject: {
        alternates: { json: "/json/source/tree/core", markdown: "/source/tree/core.md" },
        description: "core is a folder in Site with 1 file.",
        language: null,
        license: null,
        name: "core",
        path: "/anatomy/tree/folder-core",
        repository: null,
        tabPath: "/anatomy/tree",
        tabTitle: "Site",
        title: "Site · core · Bane's Lab",
    },
};

describe("renderSourceBody", () => {
    it("lays out the parent link, the name, the description and the children", () => {
        const body = renderSourceBody(BODY, null);
        expect(body.querySelector("nav a")?.getAttribute("href")).toBe("/anatomy/tree");
        expect(body.querySelector("h1")?.textContent).toBe("core");
        expect(body.querySelector("p")?.textContent).toBe(BODY.subject.description);
        expect(body.querySelector("ul a")?.getAttribute("href")).toBe("/anatomy/tree/file-a-ts");
        expect(body.querySelector("pre")).toBeNull();
    });

    it("carries a file's source text in a code block", () => {
        const body = renderSourceBody({ ...BODY, children: [] }, "export const a = 1;\n");
        expect(body.querySelector("pre code")?.textContent).toContain("export const a = 1;");
        expect(body.querySelector("ul")).toBeNull();
    });
});

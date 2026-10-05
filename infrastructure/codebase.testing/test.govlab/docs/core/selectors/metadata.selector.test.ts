import { describe, expect, it } from "vitest";
import { docBasename, docStem, spineProfileFor, stemParts } from "@govlab/docs/core/selectors/metadata.selector.ts";

const PROFILE = { keys: ["name", "description"], prefix: "agents/", requireFrontmatter: true, requireTitle: false };

describe("spineProfileFor", () => {
    it("uses the harness profile under the harness root and the default spine elsewhere", () => {
        const context = { harnessProfiles: [PROFILE], harnessRoot: ".harness/" };
        expect(spineProfileFor(".harness/agents/a.md", context)).toStrictEqual({
            keys: ["name", "description"],
            requireFrontmatter: true,
            requireTitle: false,
        });
        expect(spineProfileFor("docs/a.md", context).requireTitle).toBe(true);
        expect(spineProfileFor("docs/a.md", { harnessProfiles: [], harnessRoot: null }).requireFrontmatter).toBe(true);
    });
});

describe("docBasename and docStem", () => {
    it("read the filename and its stem from a posix path", () => {
        expect(docBasename("a/b/c.guide.md")).toBe("c.guide.md");
        expect(docStem("a/b/c.guide.md")).toBe("c.guide");
        expect(docStem("LICENSE")).toBe("LICENSE");
    });
});

describe("stemParts", () => {
    it("strips the form tag, then splits the member from the name", () => {
        expect(stemParts("scale-docs.govlab.guide", "guide")).toStrictEqual({ member: "govlab", name: "scale-docs" });
        expect(stemParts("scale-docs.guide", "guide")).toStrictEqual({ name: "scale-docs" });
        expect(stemParts("notes")).toStrictEqual({ name: "notes" });
    });
});

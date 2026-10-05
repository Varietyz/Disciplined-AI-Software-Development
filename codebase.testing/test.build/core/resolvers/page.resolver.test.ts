import { describe, expect, it } from "vitest";
import { fileForPath, jsonFileOf } from "@banes-lab/build-scripts/core/resolvers/page.resolver.ts";

describe("fileForPath and jsonFileOf", () => {
    it("names the page file of a route and the payload file of a page or tab", () => {
        expect(fileForPath("/")).toBe("index.html");
        expect(fileForPath("/terms/guide")).toBe("terms/guide.html");
        expect(jsonFileOf("terms", null)).toBe("json/terms.json");
        expect(jsonFileOf("terms", "guide")).toBe("json/terms/guide.json");
    });
});

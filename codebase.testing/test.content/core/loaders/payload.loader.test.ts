import { describe, expect, it } from "vitest";
import { payloadFileOf, readPageContent, readPagePayload } from "@banes-lab/content/core/loaders/payload.loader.ts";

describe("payloadFileOf", () => {
    it("resolves the page payload under the build's json folder", () => {
        expect(payloadFileOf("page").split("\\").join("/")).toContain("/json/page.json");
    });
});

describe("readPagePayload", () => {
    it("returns null for a page that was never built", () => {
        expect(readPagePayload("no-such-page")).toBeNull();
    });
});

describe("readPageContent", () => {
    it("returns null for a page that was never built", () => {
        expect(readPageContent("no-such-page")).toBeNull();
    });
});

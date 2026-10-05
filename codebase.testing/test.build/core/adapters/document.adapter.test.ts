import { describe, expect, it } from "vitest";
import {
    installDocument,
    readDocument,
    rewriteDocument,
    rewriteEach,
} from "@banes-lab/build-scripts/core/adapters/document.adapter.ts";

const PAGE = "<!doctype html><html><head><title>Terms</title></head><body><main>Text</main></body></html>";

describe("rewriteEach", () => {
    it("rewrites one parsed document per item and hands each serialized page to the writer", () => {
        const written = new Map<string, string>();
        rewriteEach(
            PAGE,
            ["a", "b"],
            (document, item) => {
                document.title = item;
            },
            (item, html) => {
                written.set(item, html);
            },
        );
        expect(written.get("a")).toContain("<title>a</title>");
        expect(written.get("b")).toContain("<title>b</title>");
    });
});

describe("readDocument", () => {
    it("hands the parsed document to the reader and returns what it reads", () => {
        expect(readDocument(PAGE, (document) => document.title)).toBe("Terms");
    });

    it("releases the document even when the reader throws", () => {
        expect(() =>
            readDocument(PAGE, () => {
                throw new Error("reader");
            }),
        ).toThrow("reader");
    });
});

describe("rewriteDocument", () => {
    it("serializes the document after the edit", () => {
        const html = rewriteDocument(PAGE, (document) => {
            document.title = "Privacy";
        });
        expect(html).toContain("<title>Privacy</title>");
    });
});

describe("installDocument", () => {
    it("installs a document at the site's address and moves it to each path it is given", () => {
        const visit = installDocument("https://example.test");
        visit("/terms");
        expect(globalThis.document.location.href).toBe("https://example.test/terms");
    });
});

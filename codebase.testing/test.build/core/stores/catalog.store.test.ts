import {
    createStore,
    packedParts,
    prefixShards,
    serialize,
} from "@banes-lab/build-scripts/core/stores/catalog.store.ts";
import { describe, expect, it } from "vitest";
import { Buffer } from "node:buffer";
import type { Leaf } from "@banes-lab/build-scripts/types/catalog.types.ts";
import { createHash } from "node:crypto";
import { renderDataLeaf } from "@banes-lab/build-scripts/core/formatters/data.formatter.ts";

const SITE = "https://example.test";

const leaf = function leaf(ref: string, json: string, markdown: string | null): Leaf {
    return {
        data: { ref, title: "Tést" },
        identity: {
            address: { json, markdown },
            href: "/page#x",
            kind: "section",
            ref,
            summary: "A leaf.",
            title: "Tést",
        },
        markdown: markdown === null ? null : "# Tést\n",
    };
};

describe("createStore", () => {
    it("writes each leaf's JSON and Markdown and derives an entry with its real size and the sha256 of its bytes", () => {
        const store = createStore(SITE, renderDataLeaf);
        const [entry] = store.add([leaf("chapter:/page#x", "/json/page/x", "/page/x.md")]);
        const json = serialize({ ref: "chapter:/page#x", title: "Tést" });
        expect(store.files.get("/json/page/x")).toBe(json);
        expect(store.files.get("/page/x.md")).toBe("# Tést\n");
        expect(entry).toStrictEqual({
            bytes: Buffer.byteLength(json),
            fingerprint: createHash("sha256").update(json).digest("hex"),
            href: `${SITE}/page#x`,
            json: `${SITE}/json/page/x`,
            kind: "section",
            markdown: `${SITE}/page/x.md`,
            ref: "chapter:/page#x",
            summary: "A leaf.",
            title: "Tést",
        });
        expect(store.entries.get("chapter:/page#x")).toBe(entry);
    });

    it("renders the data of a leaf that declares a Markdown address and brings no Markdown of its own", () => {
        const store = createStore(SITE, renderDataLeaf);
        store.add([
            {
                data: { columns: ["ref", "title"], ref: "api:ids", rows: [["a:1", "One | two"]], title: "Ids" },
                identity: {
                    address: { json: "/json/api/ids", markdown: "/api/ids.md" },
                    href: null,
                    kind: "index",
                    ref: "api:ids",
                    summary: null,
                    title: "Ids",
                },
                markdown: null,
            },
        ]);
        const markdown = store.files.get("/api/ids.md") ?? "";
        expect(markdown).toContain("# Ids");
        expect(markdown).toContain(`This leaf as JSON: ${SITE}/json/api/ids`);
        expect(markdown).toContain(String.raw`| a:1 | One \| two |`);
    });

    it("refuses a second leaf at an address or a ref already taken", () => {
        const store = createStore(SITE, renderDataLeaf);
        store.add([leaf("a:1", "/json/a/1", null)]);
        expect(() => store.add([leaf("a:2", "/json/a/1", null)])).toThrow("/json/a/1");
        expect(() => store.add([leaf("a:1", "/json/a/3", null)])).toThrow("a:1");
    });
});

describe("packedParts", () => {
    it("keeps items in order and starts a new part before one would pass the budget", () => {
        const parts = packedParts([{ a: "1234" }, { a: "1234" }, { a: "1234" }], 40);
        expect(parts.map((part) => part.length)).toStrictEqual([2, 1]);
        expect(packedParts([], 40)).toStrictEqual([]);
    });
});

describe("prefixShards", () => {
    it("keeps a letter that fits whole, splits one over the budget by longer prefixes, and keeps a short key under itself", () => {
        const entries: readonly (readonly [string, string])[] = [
            ["a", "x"],
            ["ab", "x".repeat(30)],
            ["ac", "x".repeat(30)],
            ["b", "x"],
            ["", "dropped"],
        ];
        const shards = prefixShards(entries, 60);
        expect([...shards.keys()]).toStrictEqual(["a", "ab", "ac", "b"]);
        expect(shards.get("a")).toStrictEqual([["a", "x"]]);
        expect(shards.get("ab")).toStrictEqual([["ab", "x".repeat(30)]]);
        expect([...prefixShards(entries, 10_000).keys()]).toStrictEqual(["a", "b"]);
        expect([...prefixShards([["aa", "x".repeat(200)]], 10).keys()]).toStrictEqual(["aa"]);
    });
});

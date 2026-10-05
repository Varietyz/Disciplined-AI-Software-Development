import {
    definitionPhrases,
    identityPhrases,
    resolveLeaves,
    resolveTable,
} from "@banes-lab/build-scripts/core/converters/identifier.converter.ts";
import { describe, expect, it } from "vitest";
import type { Identity } from "@banes-lab/build-scripts/types/catalog.types.ts";
import { RESOLVE_PREFIX } from "@banes-lab/build-scripts/configuration/constants/catalog.constants.ts";
import { createLinker } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";

const SITE = "https://example.test";

const identity = function identity(ref: string, title: string): Identity {
    const id = ref.slice(ref.indexOf(":") + 1);
    return {
        address: { json: `/json/records/architecture/${id}`, markdown: `/records/architecture/${id}.md` },
        href: null,
        kind: "principle",
        ref,
        summary: null,
        title,
    };
};

const SRP = identity("architecture:single-responsibility", "Single Responsibility Principle (SRP)");
const AGGREGATE = identity("architecture:aggregate", "Aggregate");
const LINKER = createLinker([SRP, AGGREGATE], SITE, (href) => href);

describe("resolveTable", () => {
    it("slugs every phrase and gathers every distinct ref a slug names", () => {
        const table = resolveTable([
            { phrase: "SRP", ref: SRP.ref },
            { phrase: "srp", ref: SRP.ref },
            { phrase: "Aggregate", ref: AGGREGATE.ref },
            { phrase: "Aggregate", ref: SRP.ref },
            { phrase: "  ", ref: SRP.ref },
        ]);
        expect(table.get("srp")).toStrictEqual([SRP.ref]);
        expect(table.get("aggregate")).toStrictEqual([AGGREGATE.ref, SRP.ref]);
        expect(table.size).toBe(2);
    });
});

describe("resolveTable ordering", () => {
    it("puts a chapter before a principle, a principle before other collections, and a file last", () => {
        const table = resolveTable([
            { phrase: "loop", ref: "anatomy:site/loop.ts" },
            { phrase: "loop", ref: "stage:loop" },
            { phrase: "loop", ref: "architecture:loop" },
            { phrase: "loop", ref: "chapter:/methodology#loop" },
        ]);
        expect(table.get("loop")).toStrictEqual([
            "chapter:/methodology#loop",
            "architecture:loop",
            "stage:loop",
            "anatomy:site/loop.ts",
        ]);
    });
});

describe("the published slug rules", () => {
    it("turn a name with dots, spaces or capitals into the key the table holds", () => {
        const table = resolveTable([
            { phrase: "package.json", ref: SRP.ref },
            { phrase: "Single  Responsibility", ref: SRP.ref },
        ]);
        expect([...table.keys()]).toStrictEqual(["package-json", "single-responsibility"]);
    });
});

describe("resolveTable folding", () => {
    it("keys a phrase and its folded forms to one entry of the table", () => {
        const table = resolveTable([
            { phrase: "Bounded Contexts", ref: AGGREGATE.ref },
            { phrase: "bounded context", ref: AGGREGATE.ref },
        ]);
        expect([...table.entries()]).toStrictEqual([["bounded-context", [AGGREGATE.ref]]]);
    });
});

describe("definitionPhrases", () => {
    it("names a source file by each definition it holds", () => {
        const file = {
            file: { definitions: [{ name: "createLinker" }], path: "build/x.ts" },
            identity: identity("anatomy:build/x.ts", "x.ts"),
        };
        expect(definitionPhrases([file])).toStrictEqual([{ phrase: "createLinker", ref: "anatomy:build/x.ts" }]);
    });
});

describe("identityPhrases", () => {
    it("names an identity by its title, its id and its acronym", () => {
        expect(identityPhrases([SRP]).map((phrase) => phrase.phrase)).toContain("single-responsibility");
        expect(identityPhrases([SRP]).map((phrase) => phrase.phrase)).toContain("SRP");
        expect(identityPhrases([identity("chapter:/m#loop", "The loop")]).map((phrase) => phrase.phrase)).toContain(
            "loop",
        );
    });
});

describe("resolveLeaves", () => {
    it("answers every key with its candidates, one or several, and writes the whole map", () => {
        const table = new Map([
            ["srp", [SRP.ref]],
            ["aggregate", [AGGREGATE.ref]],
            ["both", [SRP.ref, AGGREGATE.ref]],
        ]);
        const leaves = resolveLeaves(table, LINKER);
        const byRef = new Map(leaves.map((leaf) => [leaf.identity.ref, leaf.data]));
        expect(byRef.get(`${RESOLVE_PREFIX}srp`)).toMatchObject({
            candidates: [{ markdown: `${SITE}/records/architecture/single-responsibility.md`, ref: SRP.ref }],
            slug: "srp",
        });
        expect(byRef.get(`${RESOLVE_PREFIX}aggregate`)).toMatchObject({ candidates: [{ ref: AGGREGATE.ref }] });
        expect(byRef.get(`${RESOLVE_PREFIX}both`)).toMatchObject({
            candidates: [{ ref: SRP.ref }, { ref: AGGREGATE.ref }],
        });
        expect(byRef.get("api:resolve")).toStrictEqual({
            count: 3,
            order: ["chapter", "architecture", "lexicon", "algorithms", "reasoning", "anatomy"],
            ref: "api:resolve",
            shards: { a: `${SITE}/json/api/slugs/a`, b: `${SITE}/json/api/slugs/b`, s: `${SITE}/json/api/slugs/s` },
            slugRules: {
                characters: "abcdefghijklmnopqrstuvwxyz0123456789",
                separator: "-",
                words: `${SITE}/json/api/search`,
            },
        });
        expect(byRef.get("api:slugs/a")).toMatchObject({ slugs: { aggregate: [AGGREGATE.ref] } });
        expect(byRef.get("api:slugs/b")).toMatchObject({ slugs: { both: [SRP.ref, AGGREGATE.ref] } });
        expect(byRef.get("api:slugs/s")).toMatchObject({ prefix: "s", slugs: { srp: [SRP.ref] } });
    });
});

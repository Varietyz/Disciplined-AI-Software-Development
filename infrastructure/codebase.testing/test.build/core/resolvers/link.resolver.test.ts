import { createLinker, linkOf } from "@banes-lab/build-scripts/core/resolvers/link.resolver.ts";
import { describe, expect, it } from "vitest";
import type { Identity } from "@banes-lab/build-scripts/types/catalog.types.ts";

const SITE = "https://example.test";
const GUIDE = "/pag/guide";

const SECTION: Identity = {
    address: { json: "/json/pag/guide/setup", markdown: "/pag/guide/setup.md" },
    href: "/pag/guide#setup",
    kind: "section",
    ref: "chapter:/pag/guide#setup",
    summary: null,
    title: "Setup",
};

const RECORD: Identity = {
    address: { json: "/json/records/architecture/x", markdown: "/records/architecture/x.md" },
    href: "/ontology#architecture-x",
    kind: "principle",
    ref: "architecture:x",
    summary: "An x.",
    title: "X",
};

describe("linkOf", () => {
    it("links an identity to its page and leaves under the label given, without a page when it has none", () => {
        expect(linkOf(SECTION, SITE, "Setup")).toStrictEqual({
            href: `${SITE}/pag/guide#setup`,
            json: `${SITE}/json/pag/guide/setup`,
            label: "Setup",
            markdown: `${SITE}/pag/guide/setup.md`,
            ref: "chapter:/pag/guide#setup",
        });
        expect(
            linkOf({ ...RECORD, address: { json: "/json/x", markdown: null }, href: null }, SITE, "X"),
        ).toStrictEqual({ href: null, json: `${SITE}/json/x`, label: "X", markdown: null, ref: RECORD.ref });
    });
});

describe("createLinker", () => {
    const linker = createLinker([SECTION, RECORD], SITE, (href) => href);

    it("links a known ref to its leaf addresses and leaves an unknown ref bare", () => {
        expect(linker.link("X", RECORD.ref)).toStrictEqual({
            href: `${SITE}/ontology#architecture-x`,
            json: `${SITE}/json/records/architecture/x`,
            label: "X",
            markdown: `${SITE}/records/architecture/x.md`,
            ref: RECORD.ref,
        });
        expect(linker.link("Gone", "architecture:gone")).toStrictEqual({
            href: null,
            json: null,
            label: "Gone",
            markdown: null,
            ref: "architecture:gone",
        });
    });

    it("finds an identity by its ref or by its page href", () => {
        expect(linker.byRef("chapter:/pag/guide#setup")).toBe(SECTION);
        expect(linker.byHref("/ontology#architecture-x")).toBe(RECORD);
        expect(linker.byHref("/nowhere")).toBeNull();
    });

    it("relinks a page link to its leaf, a fragment to the page it sits on, and anything else to the site", () => {
        const text = "[x](/ontology#architecture-x) [panel](#setup-panel-a) [other](/faq) [ext](https://other.test)";
        expect(linker.relink(text, GUIDE)).toBe(
            `[x](${SITE}/records/architecture/x.md) [panel](${SITE}/pag/guide#setup-panel-a) [other](${SITE}/faq) [ext](https://other.test)`,
        );
    });

    it("records an unknown ref and a cross-page anchor no identity carries, and nothing that resolves", () => {
        const fresh = createLinker([SECTION, RECORD], SITE, (href) => href);
        fresh.link("X", RECORD.ref);
        fresh.link("Gone", "architecture:gone");
        fresh.link("Plain", null);
        fresh.relink(
            "[x](/ontology#architecture-x) [panel](#setup-panel-a) [page](/faq) [lost](/pag/guide#gone)",
            GUIDE,
        );
        expect(fresh.unresolved()).toStrictEqual([
            { from: null, label: "Gone", target: "architecture:gone" },
            { from: GUIDE, label: "/pag/guide#gone", target: "/pag/guide#gone" },
        ]);
    });

    it("records a page link that names no route once the routes are known, and leaves a file link alone", () => {
        const routed = createLinker([SECTION, RECORD], SITE, (href) => href, new Set(["/faq", GUIDE]));
        routed.relink(`[page](/faq) [tab](${GUIDE}) [gone](/nowhere) [file](/llms.txt)`, GUIDE);
        expect(routed.unresolved()).toStrictEqual([{ from: GUIDE, label: "/nowhere", target: "/nowhere" }]);
    });
});

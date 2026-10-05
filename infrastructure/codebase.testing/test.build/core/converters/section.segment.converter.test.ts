import { describe, expect, it } from "vitest";
import type { Leaf } from "@banes-lab/build-scripts/types/catalog.types.ts";
import { partedSection } from "@banes-lab/build-scripts/core/converters/section.segment.converter.ts";

const SITE = "https://example.test";
const PART_ONE = "/json/method/start/big/_1";

const subsections = Array.from({ length: 700 }, (_unused, at) => ({
    body: "x".repeat(900),
    id: `s${String(at)}`,
    title: `Part ${String(at)}`,
}));

const section = { id: "big", subsections, title: "Big" };

const identity = {
    address: { json: "/json/method/start/big", markdown: "/method/start/big.md" },
    href: "/method#big",
    kind: "section",
    ref: "chapter:/method#big",
    summary: null,
    title: "Big",
};

const heldSubsections = function heldSubsections(part: Leaf): readonly unknown[] {
    const held: unknown = Reflect.get(part.data, "subsections");
    return Array.isArray(held) ? held.map((item: unknown) => item) : [];
};

describe("partedSection", () => {
    it("keeps a section that fits the file budget as one leaf", () => {
        const leaf = { data: { content: { id: "small", title: "Small" } }, identity, markdown: "# Small\n" };
        expect(partedSection(leaf, { id: "small", title: "Small" }, SITE)).toStrictEqual([leaf]);
    });

    it("moves the subsections of a section over the budget into ordered parts that its head names", () => {
        const leaves = partedSection({ data: { content: section }, identity, markdown: "# Big\n" }, section, SITE);
        const head = leaves.at(-1);
        const parts = leaves.slice(0, -1);
        expect(parts.length).toBeGreaterThan(1);
        expect(parts.every((part) => part.identity.kind === "index-part" && typeof part.markdown === "string")).toBe(
            true,
        );
        expect(parts[0]?.identity.address).toStrictEqual({ json: PART_ONE, markdown: "/method/start/big/_1.md" });
        expect(parts[0]?.markdown).toContain(SITE + PART_ONE);
        expect(parts.flatMap(heldSubsections)).toStrictEqual(subsections);
        expect(head?.markdown).toBe("# Big\n");
        expect(Reflect.get(head?.data ?? {}, "content")).toStrictEqual({ id: "big", title: "Big" });
        const listed: unknown = Reflect.get(head?.data ?? {}, "parts");
        expect(Array.isArray(listed) ? listed.at(0) : null).toMatchObject({ first: "Part 0", json: SITE + PART_ONE });
    });
});

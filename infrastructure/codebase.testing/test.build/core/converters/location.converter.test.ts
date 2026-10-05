import { describe, expect, it } from "vitest";
import { placedOf, placementsOf } from "@banes-lab/build-scripts/core/converters/location.converter.ts";
import type { Identity } from "@banes-lab/build-scripts/types/catalog.types.ts";

const SITE = "https://example.test";

const identity = function identity(ref: string, title: string): Identity {
    return {
        address: { json: `/json/${ref}`, markdown: `/${ref}.md` },
        href: null,
        kind: "record",
        ref,
        summary: null,
        title,
    };
};

const PARENT = identity("api:records/x", "Records");
const FIRST = identity("x:a", "A");
const SECOND = identity("x:b", "B");
const THIRD = identity("x:c", "C");

describe("placementsOf", () => {
    it("gives each member its index and the members listed before and after it", () => {
        const placements = placementsOf(
            [
                {
                    data: { ref: PARENT.ref, title: PARENT.title },
                    identity: PARENT,
                    refs: ["x:a", "x:missing", "x:b", "x:c"],
                },
            ],
            [FIRST, SECOND, THIRD],
            SITE,
        );
        expect(placements.get("x:a")).toStrictEqual({
            siblings: {
                next: { href: null, json: `${SITE}/json/x:b`, label: "B", markdown: `${SITE}/x:b.md`, ref: "x:b" },
                previous: null,
            },
            up: {
                href: null,
                json: `${SITE}/json/api:records/x`,
                label: "Records",
                markdown: `${SITE}/api:records/x.md`,
                ref: "api:records/x",
            },
        });
        expect(placements.get("x:b")?.siblings.previous?.ref).toBe("x:a");
        expect(placements.get("x:c")?.siblings.next).toBeNull();
        expect(placements.has("x:missing")).toBe(false);
    });

    it("keeps the first index that lists a member", () => {
        const other = identity("api:facets/x", "Facet");
        const placements = placementsOf(
            [
                { data: { ref: PARENT.ref, title: PARENT.title }, identity: PARENT, refs: ["x:a"] },
                { data: { ref: other.ref, title: other.title }, identity: other, refs: ["x:a"] },
            ],
            [FIRST],
            SITE,
        );
        expect(placements.get("x:a")?.up.ref).toBe("api:records/x");
    });
});

describe("placedOf", () => {
    it("writes an absent placement as null fields", () => {
        expect(placedOf(null)).toStrictEqual({ siblings: null, up: null });
    });
});

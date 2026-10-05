import {
    EMPTY_JOURNAL,
    movedLeaf,
    parseJournal,
    updateJournal,
} from "@banes-lab/build-scripts/core/converters/journal.converter.ts";
import { describe, expect, it } from "vitest";
import type { Entry } from "@banes-lab/build-scripts/types/catalog.types.ts";

const SITE = "https://example.test";
const DRY_REF = "architecture:dry";

const entry = function entry(ref: string, title: string, fingerprint: string): Entry {
    const id = ref.slice(ref.indexOf(":") + 1);
    return {
        bytes: 1,
        fingerprint,
        href: null,
        json: `${SITE}/json/records/architecture/${id}`,
        kind: "principle",
        markdown: null,
        ref,
        summary: null,
        title,
    };
};

describe("updateJournal", () => {
    it("records every current ref, and tombstones a vanished one with the ref that took its title", () => {
        const first = updateJournal(
            EMPTY_JOURNAL,
            [entry(DRY_REF, "DRY", "a"), entry("architecture:x", "X", "b")],
            SITE,
        );
        expect(Object.keys(first.refs)).toStrictEqual([DRY_REF, "architecture:x"]);
        const second = updateJournal(first, [entry("architecture:dont-repeat", "DRY", "c")], SITE);
        expect(second.moved).toStrictEqual({
            [DRY_REF]: { json: "/json/records/architecture/dry", to: "architecture:dont-repeat" },
            "architecture:x": { json: "/json/records/architecture/x", to: null },
        });
        const back = updateJournal(second, [entry("architecture:x", "X", "b")], SITE);
        expect(Object.keys(back.moved)).toStrictEqual([DRY_REF, "architecture:dont-repeat"]);
    });
});

const sourceEntry = function sourceEntry(ref: string, tab: string, path: string): Entry {
    return {
        bytes: 1,
        fingerprint: "a",
        href: null,
        json: `${SITE}/json/source/${tab}/${path}`,
        kind: "file",
        markdown: null,
        ref,
        summary: null,
        title: path,
    };
};

describe("updateJournal across a retired tab", () => {
    it("points every address of a retired tab at the same path under the tab that replaced it", () => {
        const first = updateJournal(
            EMPTY_JOURNAL,
            [
                sourceEntry("anatomy:file-build-a", "build", "package.json"),
                sourceEntry("anatomy:x", "tree", "package.json"),
            ],
            SITE,
        );
        const second = updateJournal(
            first,
            [
                sourceEntry("anatomy:file-content-a", "content", "package.json"),
                sourceEntry("anatomy:x", "tree", "package.json"),
            ],
            SITE,
        );
        expect(second.moved).toStrictEqual({
            "anatomy:file-build-a": { json: "/json/source/build/package.json", to: "anatomy:file-content-a" },
        });
    });

    it("settles a kept tombstone that had no target once the retired address has one", () => {
        const journal = { moved: { "anatomy:gone": { json: "/json/source/build/a.ts", to: null } }, refs: {} };
        const next = updateJournal(journal, [sourceEntry("anatomy:new", "content", "a.ts")], SITE);
        expect(next.moved).toStrictEqual({ "anatomy:gone": { json: "/json/source/build/a.ts", to: "anatomy:new" } });
    });
});

describe("parseJournal", () => {
    it("reads a well-formed journal and refuses a malformed entry", () => {
        const journal = updateJournal(EMPTY_JOURNAL, [entry(DRY_REF, "DRY", "a")], SITE);
        expect(parseJournal(JSON.stringify(journal))).toStrictEqual(journal);
        const malformed = JSON.stringify({ moved: {}, refs: { [DRY_REF]: { json: 3 } } });
        expect(() => parseJournal(malformed)).toThrow(DRY_REF);
        expect(() => parseJournal("[]")).toThrow("catalog journal");
    });
});

describe("movedLeaf", () => {
    it("lists each tombstone with its old address and the address that replaced it", () => {
        const first = updateJournal(EMPTY_JOURNAL, [entry(DRY_REF, "DRY", "a")], SITE);
        const second = updateJournal(first, [entry("architecture:dont-repeat", "DRY", "b")], SITE);
        const leaf = movedLeaf(second, SITE);
        expect(leaf.identity.address.json).toBe("/json/api/moved");
        expect(Reflect.get(leaf.data, "rows")).toStrictEqual([
            [DRY_REF, `${SITE}/json/records/architecture/dry`, `${SITE}/json/records/architecture/dont-repeat`],
        ]);
    });
});

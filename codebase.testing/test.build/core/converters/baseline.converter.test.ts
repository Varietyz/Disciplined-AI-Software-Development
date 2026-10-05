import {
    currentCandidates,
    exactReferencesOf,
    lostReferences,
    parseBaseline,
} from "@banes-lab/build-scripts/core/converters/baseline.converter.ts";
import { describe, expect, it } from "vitest";
import { lostReference, lostReferencesLine } from "@banes-lab/build-scripts/configuration/strings/anatomy.strings.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { persistBaseline, readBaseline } from "@banes-lab/build-scripts/core/persistence/baseline.persistence.ts";
import type { ReferenceSite } from "@banes-lab/build-scripts/types/anatomy.types.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

const LOCATION = { file: "b.ts", line: 1, name: "RULE" };

const siteOf = function siteOf(source: string, references: Partial<ReferenceSite["references"]>): ReferenceSite {
    return { references: { sites: [], spans: {}, strings: {}, targets: [], words: {}, ...references }, source };
};

describe("the reference baseline", () => {
    it("records only the references that resolve to one target", () => {
        const sites = new Map([
            [
                "a.ts",
                siteOf('RULE "b.ts" SLOT', {
                    strings: { "b.ts": { kind: "file", path: "b.ts" } },
                    words: {
                        RULE: { kind: "definition", location: LOCATION },
                        SLOT: { kind: "candidates", locations: [LOCATION, LOCATION] },
                    },
                }),
            ],
        ]);
        expect(exactReferencesOf(sites).map((entry) => `${entry.channel}:${entry.text}`)).toStrictEqual([
            "strings:b.ts",
            "words:RULE",
        ]);
    });

    it("reports a recorded reference that is still in its file and no longer resolves to one target", () => {
        const recorded = { channel: "words" as const, path: "a.ts", text: "RULE" };
        const baseline = [
            recorded,
            { channel: "words" as const, path: "a.ts", text: "GONE" },
            { channel: "words" as const, path: "deleted.ts", text: "RULE" },
        ];
        const sites = new Map([
            ["a.ts", siteOf("RULE", { words: { RULE: { kind: "candidates", locations: [LOCATION, LOCATION] } } })],
        ]);
        expect(lostReferences(baseline, sites)).toStrictEqual([recorded]);
        expect(currentCandidates(recorded, sites)).toStrictEqual(["b.ts:1", "b.ts:1"]);
        expect(lostReference("a.ts", "words", "RULE", ["b.ts:1"])).toBe('a.ts (words) "RULE" now resolves to b.ts:1');
        expect(lostReference("a.ts", "words", "RULE", [])).toBe('a.ts (words) "RULE" now resolves to nothing');
        expect(lostReferencesLine([lostReference("a.ts", "words", "RULE", [])])).toContain(
            "now resolve to several or to none",
        );
    });

    it("counts a string reference as still written only while it stands as a quoted literal", () => {
        const baseline = [{ channel: "strings" as const, path: "a.ts", text: "config/b.ts" }];
        const imported = new Map([["a.ts", siteOf('import { x } from "../../config/b.ts";', {})]]);
        const quoted = new Map([["a.ts", siteOf('const at = "config/b.ts";', {})]]);
        expect(lostReferences(baseline, imported)).toStrictEqual([]);
        expect(lostReferences(baseline, quoted)).toStrictEqual(baseline);
    });

    it("reads back only well-formed entries", () => {
        const text = JSON.stringify([{ channel: "words", path: "a.ts", text: "RULE" }, { channel: "other" }]);
        expect(parseBaseline(text)).toStrictEqual([{ channel: "words", path: "a.ts", text: "RULE" }]);
    });

    it("persists a baseline and reads it back, and reads a missing file as empty", async () => {
        const root = mkdtempSync(join(tmpdir(), "baseline-"));
        const file = join(root, "baseline.generated.json");
        expect(readBaseline(file)).toStrictEqual([]);
        const entries = [{ channel: "words" as const, path: "a.ts", text: "RULE" }];
        await persistBaseline(file, entries);
        expect(readBaseline(file)).toStrictEqual(entries);
        rmSync(root, { force: true, recursive: true });
    });
});

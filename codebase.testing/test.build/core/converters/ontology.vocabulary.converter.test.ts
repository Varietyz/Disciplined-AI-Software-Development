import { CLOSED_VOCABULARIES, createGovlabContext } from "@govlab/context";
import { describe, expect, it } from "vitest";
import { snapshotOf } from "@banes-lab/build-scripts/core/converters/ontology.converter.ts";
import { vocabulariesOf } from "@banes-lab/build-scripts/core/converters/ontology.vocabulary.converter.ts";

const snapshot = snapshotOf(createGovlabContext());

const recordsOf = function recordsOf(vocabulary: string, value: string): readonly string[] {
    const held = snapshot.vocabularies.find((entry) => entry.id === vocabulary);
    return held?.entries.find((entry) => entry.value === value)?.records.map((record) => record.label) ?? [];
};

describe("vocabulariesOf", () => {
    it("publishes every closed vocabulary with each entry's definition", () => {
        expect(snapshot.vocabularies.map((vocabulary) => vocabulary.id)).toStrictEqual(
            CLOSED_VOCABULARIES.map((vocabulary) => vocabulary.id),
        );
        expect(
            snapshot.vocabularies.every((vocabulary) =>
                vocabulary.entries.every((entry) => entry.definition.length > 0),
            ),
        ).toBe(true);
    });

    it("lists the lexicon categories whose terms carry each example shape", () => {
        expect(recordsOf("example-shape", "placed-file")).toContain("Domain Concerns");
        expect(recordsOf("example-shape", "renamed-file")).toStrictEqual(["Refused Tags"]);
    });

    it("lists no record for a vocabulary whose users are empty", () => {
        const empty = vocabulariesOf({
            contracts: [],
            principles: [],
            surfaces: [],
            tensions: [],
            terms: [],
            topology: [],
        });
        expect(empty.every((vocabulary) => vocabulary.entries.every((entry) => entry.records.length === 0))).toBe(true);
    });
});

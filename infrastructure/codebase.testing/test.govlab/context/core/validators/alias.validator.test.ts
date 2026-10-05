import { aliasDefectsOf, aliasHoldersOf } from "@govlab/context/core/validators/alias.validator.ts";
import { describe, expect, it } from "vitest";
import type { AliasHolder } from "@govlab/context/types/validation.types.ts";
import { createGovlabContext } from "@govlab/context";

const holder = function holder(
    ref: string,
    names: readonly string[],
    aliases: readonly string[],
    distinct: readonly string[] = [],
): AliasHolder {
    return { aliases, collection: "architecture", distinct: new Set(distinct), names, ref };
};

const reasonsOf = function reasonsOf(holders: readonly AliasHolder[]): readonly string[] {
    return aliasDefectsOf(holders).map((defect) => `${defect.ref} ${defect.alias}: ${defect.reason}`);
};

describe("aliasDefectsOf", () => {
    it("accepts an acronym and a synonym no other record holds", () => {
        expect(
            reasonsOf([holder("architecture:god-object", ["god-object", "God Object"], ["God Class", "Blob"])]),
        ).toStrictEqual([]);
    });

    it("refuses an alias that repeats the record's own name or id", () => {
        expect(
            reasonsOf([holder("architecture:god-object", ["god-object", "God Object"], ["god object"])]),
        ).toStrictEqual(["architecture:god-object god object: repeats the record's own name or id"]);
    });

    it("refuses an alias that only adds a plural or a British spelling a lookup folds already", () => {
        expect(
            reasonsOf([holder("architecture:normalization", ["normalization", "Normalization"], ["normalisations"])]),
        ).toStrictEqual([
            "architecture:normalization normalisations: differs from the record's name only by a plural or a spelling, which every lookup folds already",
        ]);
    });

    it("refuses an alias with no letter or digit", () => {
        expect(reasonsOf([holder("architecture:a", ["a"], ["--"])])).toStrictEqual([
            "architecture:a --: holds no letter or digit, so it keys nothing",
        ]);
    });

    it("refuses one alias on two records of a collection unless each lists the other in distinctFrom", () => {
        const injection = "architecture:dependency-injection";
        const inversion = "architecture:dependency-inversion";
        expect(
            reasonsOf([
                holder(injection, ["Dependency Injection"], ["DI"]),
                holder(inversion, ["Dependency Inversion"], ["DI"]),
            ]),
        ).toStrictEqual([
            `${injection} DI: is also a name or alias of ${inversion}, and the records do not list each other in distinctFrom`,
            `${inversion} DI: is also a name or alias of ${injection}, and the records do not list each other in distinctFrom`,
        ]);
        expect(
            reasonsOf([
                holder(injection, ["Dependency Injection"], ["DI"], [inversion]),
                holder(inversion, ["Dependency Inversion"], ["DI"], [injection]),
            ]),
        ).toStrictEqual([]);
    });

    it("refuses two records of a collection whose names fold to one key, unless each lists the other in distinctFrom", () => {
        const single = "lexicon:breaking-change";
        const plural = "lexicon:breaking-changes";
        expect(
            reasonsOf([
                holder(single, ["breaking-change", "Breaking Change"], []),
                holder(plural, ["Breaking Changes"], []),
            ]),
        ).toStrictEqual([
            `${single} Breaking Change: is also a name or alias of ${plural}, and the records do not list each other in distinctFrom`,
            `${plural} Breaking Changes: is also a name or alias of ${single}, and the records do not list each other in distinctFrom`,
        ]);
        expect(
            reasonsOf([
                holder(single, ["Breaking Change"], [], [plural]),
                holder(plural, ["Breaking Changes"], [], [single]),
            ]),
        ).toStrictEqual([]);
    });

    it("lets two collections share a name, since one concept can be a principle and a contract", () => {
        const principle = holder("architecture:queuing-theory", ["Queuing Theory"], ["queueing theory"]);
        const contract: AliasHolder = {
            ...holder("algorithms:queuing-theory", ["Queuing Theory"], ["queueing theory"]),
            collection: "algorithms",
        };
        expect(reasonsOf([principle, contract])).toStrictEqual([]);
    });
});

describe("aliasHoldersOf", () => {
    it("gathers every record kind that can hold an alias from the bundled ontology", () => {
        const holders = aliasHoldersOf(createGovlabContext());
        const collections = new Set(holders.map((entry) => entry.collection));
        expect(collections).toContain("architecture");
        expect(collections).toContain("lexicon");
        expect(collections).toContain("algorithms");
        expect(collections).toContain("keyword");
        expect(collections).toContain("node");
    });
});

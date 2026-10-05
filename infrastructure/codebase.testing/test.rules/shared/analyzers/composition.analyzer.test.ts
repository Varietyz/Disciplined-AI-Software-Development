import {
    commentOpenerOf,
    compositionFindingsOf,
    contentWordsOf,
    fieldRestates,
    fillerOf,
    overlapOf,
    partyOf,
    restates,
    withoutQuotes,
    withoutTags,
} from "@ssot/govlab/shared/analyzers/composition.analyzer.ts";
import { describe, expect, it } from "vitest";

describe("withoutTags and withoutQuotes", () => {
    it("drops markup but keeps its text, and drops quoted replies whole", () => {
        expect(withoutTags('the <a href="/x">loop</a> runs').split(" ").filter(Boolean)).toStrictEqual([
            "the",
            "loop",
            "runs",
        ]);
        expect(withoutQuotes("it reads <em>note that</em> here").includes("note")).toBe(false);
    });
});

describe("commentOpenerOf and fillerOf", () => {
    it("finds a pointing-back opener only at the start and a filler phrase anywhere", () => {
        expect(commentOpenerOf(["that", "is", "idempotency"])).toBe("that is");
        expect(commentOpenerOf(["the", "that", "is"])).toBeNull();
        expect(commentOpenerOf(["that", "is", "the", "loop"])).toBe("that is");
        expect(
            commentOpenerOf(["this", "is", "done", "by", "running", "the", "check", "on", "every", "change"]),
        ).toBeNull();
        expect(commentOpenerOf(["that", "makes", "the", "check", "fail", "on", "every", "change"])).toBe("that makes");
        expect(fillerOf(["the", "key", "point", "is", "x"])).toBe("the key point");
        expect(fillerOf(["the", "gate", "runs"])).toBeNull();
    });
});

describe("contentWordsOf, overlapOf, restates and fieldRestates", () => {
    it("compares sentences by their content words, folding plurals", () => {
        expect([...contentWordsOf("The checks run on every change.")]).toStrictEqual(["check", "run", "change"]);
        expect(overlapOf(new Set(["a"]), new Set(["a"]))).toBe(0);
        expect(
            restates(
                "Every check writes its report to disk after every run.",
                "After every run, every check writes its report to disk.",
            ),
        ).toBe(true);
        expect(
            restates("A word also matches its longer forms.", "A longer word also forgives one slip of spelling."),
        ).toBe(false);
        expect(
            fieldRestates(
                "A template carries the contract and a check reads the template slots.",
                "Read the template slots as the contract a check carries.",
            ),
        ).toBe(true);
    });
});

describe("partyOf", () => {
    it("names the unnamed actor, and passes the named parties", () => {
        expect(partyOf(["until", "someone", "reads", "it"])).toBe("someone");
        expect(partyOf(["nobody", "recalls", "it"])).toBe("nobody");
        expect(partyOf(["an", "await", "joins", "a", "reader"])).toBeNull();
        expect(partyOf(["the", "model", "and", "the", "developer"])).toBeNull();
    });
});

describe("compositionFindingsOf", () => {
    it("reports each kind once, and never a pointing-back opener on the first sentence", () => {
        const kinds = compositionFindingsOf(
            "That is fine. The gate runs. That is the gate. It is worth noting that it runs.",
        ).map((finding) => finding.kind);
        expect(kinds).toStrictEqual(["comment", "filler"]);
    });
});

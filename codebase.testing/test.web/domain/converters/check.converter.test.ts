import { canonOf, checkBlocks, checkRowsOf, recordCheckOf } from "@banes-lab/web/domain/converters/check.converter.ts";
import { checkAnswerOf, evidenceAnswerOf } from "@banes-lab/web/configuration/strings/reference.strings.ts";
import { describe, expect, it } from "vitest";
import type { ResolutionView } from "@banes-lab/web/types/ontology.types.ts";

const RECORD_REF = "architecture:modularity";
const FAIL_FAST = { label: "Fail Fast", ref: "architecture:fail-fast" };

const RESOLUTION: ResolutionView = {
    answers: [
        {
            authority: "the declared boundary, which each module conforms to",
            evidence: "fires-and-accepts: a planted cross-boundary import and a conforming one",
            freshness: "a verdict stands until the module changes",
            observation: "none: a cluster is a grouping of principles",
            population: "every module in the codebase",
            refusal: null,
        },
    ],
    byRecord: { [RECORD_REF]: { answers: 0, by: [FAIL_FAST], dependsOn: [], shape: [] } },
    coverage: [],
    defects: 0,
    records: 1,
};

describe("recordCheckOf", () => {
    it("joins a record's entry to its shared answers, and answers null for a record with no entry", () => {
        const check = recordCheckOf(RESOLUTION, RECORD_REF);
        expect(check?.by).toStrictEqual([FAIL_FAST]);
        expect(check?.answers.population).toBe("every module in the codebase");
        expect(recordCheckOf(RESOLUTION, "architecture:absent")).toBeNull();
        expect(recordCheckOf({ ...RESOLUTION, answers: [] }, RECORD_REF)).toBeNull();
    });
});

describe("checkRowsOf and checkBlocks", () => {
    it("writes one row per question, reading a declared absence as its reason and an empty list as not answered", () => {
        const check = recordCheckOf(RESOLUTION, RECORD_REF);
        if (check === null) {
            throw new Error("the planted record has no check");
        }
        const rows = checkRowsOf(check);
        expect(rows.map((entry) => entry.label)).toStrictEqual([
            "Checked by",
            "Population",
            "Freshness",
            "Refusal",
            "Observation",
            "Evidence",
            "Authoritative side",
            "Depends on",
            "Shape it refuses",
        ]);
        expect(rows[0]?.edges).toStrictEqual([FAIL_FAST]);
        expect(rows[3]?.text).toBe("Not answered");
        expect(rows[4]?.text).toBe("None, because a cluster is a grouping of principles");
        expect(rows[5]?.text).toBe(
            "Watched to fire and to accept: a planted cross-boundary import and a conforming one",
        );
        expect(rows[6]?.text).toBe("The declared boundary, which each module conforms to");
        expect(rows[7]?.edges).toBeNull();
        expect(checkBlocks(RESOLUTION, RECORD_REF).map((block) => block.kind)).toStrictEqual(["text", "glossary"]);
    });

    it("refuses to render a record the resolution carries no check for", () => {
        expect(() => checkBlocks(RESOLUTION, "architecture:absent")).toThrow("architecture:absent");
    });

    it("refuses an evidence answer that opens with no known sign", () => {
        const [answers] = RESOLUTION.answers;
        if (answers === undefined) {
            throw new Error("the planted resolution has no answers");
        }
        const unsigned: ResolutionView = {
            ...RESOLUTION,
            answers: [{ ...answers, evidence: "probably: it looked fine" }],
        };
        expect(() => checkBlocks(unsigned, RECORD_REF)).toThrow("probably: it looked fine");
    });
});

describe("checkAnswerOf and evidenceAnswerOf", () => {
    it("reads a missing answer, a declared absence and a plain answer, and names each evidence sign", () => {
        expect(checkAnswerOf(null)).toBe("Not answered");
        expect(checkAnswerOf("none: nothing observes it")).toBe("None, because nothing observes it");
        expect(checkAnswerOf("every module")).toBe("Every module");
        expect(evidenceAnswerOf("fires: a planted import")).toBe("Watched to fire: a planted import");
        expect(evidenceAnswerOf("contradicted: a planted import passed")).toBe(
            "Measured failing: a planted import passed",
        );
        expect(evidenceAnswerOf("none: nothing has watched it")).toBe("None, because nothing has watched it");
        expect(evidenceAnswerOf(null)).toBe("Not answered");
        expect(() => evidenceAnswerOf("fires without a separator")).toThrow("fires without a separator");
    });
});

describe("canonOf", () => {
    it("joins canon entries and reads a declared absence among them as its reason", () => {
        expect(canonOf(["quality:concept:coupling", "none: no rule catches it"])).toBe(
            "quality:concept:coupling, None, because no rule catches it",
        );
    });
});

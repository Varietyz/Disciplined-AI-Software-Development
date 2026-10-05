import {
    deadGovernsEdge,
    deadNameEdge,
    dependsOnCycle,
    docNameFinding,
    duplicateDocName,
    expectedSuffix,
    invalidBoolean,
    invalidEnum,
    invalidInteger,
    invalidKebab,
    invalidList,
    invalidListEntry,
    missingConcernVerb,
    missingFrontmatterField,
    missingRequiredField,
    missingSection,
    missingSubject,
    nonActivityConcern,
    sectionOutOfOrder,
} from "@govlab/docs/configuration/strings/document.strings.ts";
import { describe, expect, it } from "vitest";
import { unmatched } from "./strings.fixture.ts";

describe("the document strings", () => {
    it("carry every operand they are given", () => {
        expect(
            unmatched([
                [nonActivityConcern("guide", "quality"), 'concern "quality"'],
                [missingConcernVerb("x", "scale-", "scaling", "scale"), '"scale-<subject>"'],
                [missingSubject("scale-"), '"scale-"'],
                [missingFrontmatterField("name"), '"name"'],
                [missingSection("Usage"), "## Usage"],
                [sectionOutOfOrder("Usage"), '"Usage"'],
                [missingRequiredField("status"), '"status"'],
                [invalidInteger("order", "x"), "order: x"],
                [invalidBoolean("draft", "maybe"), "draft: maybe"],
                [invalidKebab("name", "Bad"), "name: Bad"],
                [invalidList("tags", "x", "a, b"), "[a, b]"],
                [invalidListEntry("validates", "paths", "rules"), 'lists "paths"'],
                [invalidEnum("status", "old", "current"), "status: old"],
                [deadGovernsEdge("a.md", "src/x.ts"), 'governs "src/x.ts"'],
                [deadNameEdge("a.md", "links", "other"), 'links "other"'],
                [dependsOnCycle("a → b → a"), "a → b → a"],
                [duplicateDocName("dup"), '"dup"'],
                [docNameFinding("a.md", "bad", " → expected"), "[doc-name] bad"],
                [expectedSuffix("x"), 'expected "x"'],
            ]),
        ).toStrictEqual([]);
    });
});

import { describe, expect, it } from "vitest";
import type { ConceptDefinition } from "@govlab/quality/types/concept.types.ts";
import { conceptsOfRule } from "@govlab/quality/core/classifiers/concept.classifier.ts";

const DEFINITIONS: readonly ConceptDefinition[] = [
    { cwe: ["89"], dimension: "security", exclude: [], id: "sql-injection", phrases: ["sql injection"], words: [] },
    {
        cwe: [],
        dimension: "size",
        exclude: ["test file"],
        id: "file-length",
        phrases: ["file length"],
        words: ["lines"],
    },
];

describe("conceptsOfRule", () => {
    it("matches a concept by phrase, by word or by CWE code", () => {
        expect(
            conceptsOfRule({ description: "limits file length", ruleId: "a", tool: "x" }, DEFINITIONS),
        ).toStrictEqual(["file-length"]);
        expect(conceptsOfRule({ ruleId: "b", tags: ["CWE-89"], tool: "x" }, DEFINITIONS)).toStrictEqual([
            "sql-injection",
        ]);
    });

    it("drops a concept whose exclusion phrase appears in the rule", () => {
        expect(
            conceptsOfRule({ description: "too many lines in a test file", ruleId: "c", tool: "x" }, DEFINITIONS),
        ).toStrictEqual([]);
    });
});

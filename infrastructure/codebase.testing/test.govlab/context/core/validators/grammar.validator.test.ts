import assert from "node:assert/strict";
import { grammarIssuesOf } from "@govlab/context/core/validators/grammar.validator.ts";
import { test } from "vitest";

test("a document type with no verb and a token defined twice are both reported", () => {
    const keyword = { keyword: "READ", roles: [{ category: "action", example: "", meaning: "" }] } as const;
    const issues = grammarIssuesOf(
        {
            documentTypes: [{ defaultVerb: "", purpose: "p", type: "BARE", verbs: [] }],
            keywords: [
                { keyword: keyword.keyword, roles: [{ ...keyword.roles[0] }] },
                { keyword: keyword.keyword, roles: [{ ...keyword.roles[0], category: "meta" }] },
            ],
            productions: [],
            templates: [],
            terminals: [],
        },
        new Map(),
    );
    assert.deepEqual(issues.docTypesWithoutVerb, ["BARE"]);
    assert.deepEqual(issues.duplicateKeywordIds, ["READ"]);
    assert.deepEqual(issues.unrecognizedDocumentTypes, ["BARE"]);
});

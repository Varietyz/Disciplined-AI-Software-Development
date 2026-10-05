import {
    normalizeDocumentType,
    normalizeKeyword,
    normalizeProduction,
    normalizeTemplate,
    refused,
} from "@govlab/context/core/normalizers/grammar.normalizer.ts";
import { PAG_KINDS } from "@govlab/context";
import assert from "node:assert/strict";
import { test } from "vitest";

test("each grammar record keeps its fields and adds grounds only when it carries some", () => {
    assert.deepEqual(normalizeKeyword({ category: "action", example: "e", keyword: "READ", meaning: "m" }), {
        keyword: "READ",
        roles: [{ category: "action", example: "e", meaning: "m" }],
    });
    assert.deepEqual(
        normalizeKeyword({
            category: "action",
            example: "e",
            grounds: ["reasoning:x"],
            keyword: "WAIT",
            meaning: "m",
            roles: [{ category: "coordination", example: "f", meaning: "n" }],
        }).roles,
        [
            { category: "action", example: "e", grounds: ["reasoning:x"], meaning: "m" },
            { category: "coordination", example: "f", meaning: "n" },
        ],
    );
    assert.deepEqual(normalizeProduction({ grounds: ["reasoning:x"], group: "g", lhs: "l", rhs: "r" }).grounds, [
        "reasoning:x",
    ]);
    const type = normalizeDocumentType({
        defaultVerb: "DOES",
        model: "cognition",
        purpose: "p",
        type: "T",
        verbs: ["DOES"],
    });
    assert.equal(type.model, "cognition");
    assert.equal("axis" in type, false);
});

test("a template slot defaults its kind and keeps a closed set only when one is declared", () => {
    const template = normalizeTemplate({
        body: "{a}",
        slots: [{ name: "a" }, { enum: ["x"], kind: "choice", name: "b", required: true }, "loose"],
        type: "T",
    });
    const [first, second] = template.slots;
    assert.equal(template.slots.length, 2);
    assert.ok(first && second);
    assert.equal("enum" in first, false);
    assert.deepEqual(second.enum, ["x"]);
    assert.equal(second.required, true);
});

test("refused checks a record against its kind's schema and refuses an undeclared kind", () => {
    const keyword = refused(PAG_KINDS.keyword, normalizeKeyword);
    assert.throws(() => keyword({ category: "action", keyword: "READ" }));
    assert.throws(() => refused("ghost-kind", normalizeKeyword)({}), {
        message: 'pag: the kind "ghost-kind" is not declared in the PAG taxonomy',
    });
});

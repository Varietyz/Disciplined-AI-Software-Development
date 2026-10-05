import { createArchRelations, createGovlabContext, createLexicon } from "@govlab/context";
import {
    crossFaceCollisions,
    invalidSeveritiesOf,
    unreachableAntiPatternsOf,
    unresolvedExpressionsOf,
} from "@govlab/context/core/validators/architecture.validator.ts";
import type { KeywordRecord } from "@govlab/context/types/grammar.types.ts";
import assert from "node:assert/strict";
import { plantedPrinciple } from "./ontology.fixture.ts";
import { test } from "vitest";

const KEYWORD: KeywordRecord = {
    keyword: "INVARIANT",
    roles: [{ category: "invariant", example: "INVARIANT x", meaning: "a stated invariant" }],
};
const PRODUCTION = { group: "planning", lhs: "refusal_line", rhs: '"refuse:" <condition>' };

const expressionFaces = (expressedBy: readonly string[]): Parameters<typeof unresolvedExpressionsOf>[0] => ({
    algo: { get: () => null },
    arch: { all: () => [{ expressedBy, id: "planted-principle" }], get: () => null },
    pag: {
        documentType: () => null,
        keyword: (id: string) => (id === "INVARIANT" ? KEYWORD : null),
        production: (lhs: string) => (lhs === PRODUCTION.lhs ? PRODUCTION : null),
        template: () => null,
    },
});

test("unresolvedExpressionsOf reports a pag ref that names no construct, and a ref outside pag", () => {
    const findings = unresolvedExpressionsOf(
        expressionFaces(["pag:production:no_such_line", "pag:keyword:GHOST", "architecture:stated-invariant"]),
    );
    assert.deepEqual(findings, [
        { from: "planted-principle", target: "pag:production:no_such_line" },
        { from: "planted-principle", target: "pag:keyword:GHOST" },
        { from: "planted-principle", target: "architecture:stated-invariant" },
    ]);
});

test("unresolvedExpressionsOf passes a keyword and a production the grammar declares", () => {
    const faces = expressionFaces(["pag:keyword:INVARIANT", "pag:production:refusal_line"]);
    assert.deepEqual(unresolvedExpressionsOf(faces), []);
});

test("an anti-pattern no principle conflicts with is unreachable", () => {
    const arch = createArchRelations({
        data: [
            plantedPrinciple("lonely-defect", { type: "anti-pattern" }),
            plantedPrinciple("guard", { conflicts_with: ["named-defect"] }),
            plantedPrinciple("named-defect", { type: "anti-pattern" }),
        ],
    });
    assert.deepEqual(unreachableAntiPatternsOf(arch), ["lonely-defect"]);
});

test("a lexicon id that an architecture id also takes is a collision", () => {
    const arch = createArchRelations({ data: [plantedPrinciple("shared-name")] });
    const lex = createLexicon({
        data: [
            {
                category: "planted",
                records: [{ definition: "A planted term.", kind: "constraint", name: "Shared Name" }],
            },
        ],
    });
    assert.deepEqual(crossFaceCollisions(arch, lex), ["shared-name"]);
});

test("mandatoryFor beside any severity but the conditional one is reported, and the bundled severities hold", () => {
    const arch = createArchRelations({
        data: [plantedPrinciple("gated-rule", { mandatoryFor: "production", severity: "mandatory" })],
    });
    assert.deepEqual(
        invalidSeveritiesOf(arch).map((entry) => entry.id),
        ["gated-rule"],
    );
    assert.deepEqual(createGovlabContext().validateResolution().invalidSeverities, []);
});

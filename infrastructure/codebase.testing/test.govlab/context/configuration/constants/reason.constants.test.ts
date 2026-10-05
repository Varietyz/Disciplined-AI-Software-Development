import {
    EVIDENCE_SOURCE_VALUES,
    PREDICATE_TYPE_VALUES,
    VERDICTS,
} from "@govlab/context/configuration/constants/reason.constants.ts";
import { asClosed, asClosedArray } from "@govlab/context/core/normalizers/field.normalizer.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const acceptedOf = (values: readonly string[]): string[] =>
    values.map((value) => asClosed(values, value, "reason: a planted value"));

const refusal =
    (planted: string) =>
    (error: unknown): boolean =>
        error instanceof Error && error.message.includes(`declares "${planted}"`);

test("a verdict outside the verdict vocabulary fails the load", () => {
    assert.deepEqual(acceptedOf(VERDICTS), [...VERDICTS]);
    assert.throws(
        () => asClosedArray(VERDICTS, ["pass", "maybe"], "reason: a planted verdict domain"),
        refusal("maybe"),
    );
});

test("an evidence source outside the evidence source vocabulary fails the load", () => {
    assert.deepEqual(acceptedOf(EVIDENCE_SOURCE_VALUES), [...EVIDENCE_SOURCE_VALUES]);
    assert.throws(() => asClosed(EVIDENCE_SOURCE_VALUES, "hearsay", "reason: a planted source"), refusal("hearsay"));
});

test("a predicate type outside the predicate type vocabulary fails the load", () => {
    assert.deepEqual(acceptedOf(PREDICATE_TYPE_VALUES), [...PREDICATE_TYPE_VALUES]);
    assert.throws(() => asClosed(PREDICATE_TYPE_VALUES, "vibes", "reason: a planted type"), refusal("vibes"));
});

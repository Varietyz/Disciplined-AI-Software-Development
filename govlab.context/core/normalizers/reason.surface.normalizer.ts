import { EVIDENCE_SOURCE_VALUES, PREDICATE_TYPE_VALUES, VERDICTS } from "#configuration/constants/reason.constants";
import type {
    FailureShape,
    Invariant,
    Technique,
    TestSurface,
    TestSurfaceEvidence,
    TestSurfacePredicate,
} from "#types/reason.surface.types";
import {
    asClosed,
    asClosedArray,
    asString,
    asStringArray,
    optionalString,
    optionalStrings,
} from "#core/normalizers/field.normalizer";
import { evidenceSourceOf, predicateTypeOf, verdictOf } from "#configuration/strings/reason.strings";
import { isObject } from "#core/predicates/record.predicate";

const normalizePredicate = function normalizePredicate(value: unknown, surface: string): TestSurfacePredicate {
    const raw = isObject(value) ? value : {};
    return {
        expression: asString(raw["expression"]),
        type: asClosed(PREDICATE_TYPE_VALUES, raw["type"], predicateTypeOf(surface)),
        ...optionalStrings(raw, "grounds"),
    };
};

const normalizeEvidence = function normalizeEvidence(value: unknown, surface: string): TestSurfaceEvidence {
    const raw = isObject(value) ? value : {};
    return {
        required: raw["required"] === true,
        source: asClosed(EVIDENCE_SOURCE_VALUES, raw["source"], evidenceSourceOf(surface)),
        ...optionalStrings(raw, "grounds"),
    };
};

export const normalizeTestSurface = function normalizeTestSurface(raw: Record<string, unknown>): TestSurface {
    const id = asString(raw["id"]);
    return {
        dimension: asString(raw["dimension"]),
        evidence: normalizeEvidence(raw["evidence"], id),
        failureModes: asStringArray(raw["failureModes"]),
        fit: asString(raw["fit"]),
        id,
        invariant: asString(raw["invariant"]),
        lens: asString(raw["lens"]),
        predicate: normalizePredicate(raw["predicate"], id),
        techniques: asStringArray(raw["techniques"]),
        verdictDomain: asClosedArray(VERDICTS, raw["verdictDomain"], verdictOf(id)),
    };
};

export const normalizeTechnique = function normalizeTechnique(raw: Record<string, unknown>): Technique {
    return {
        fails: asString(raw["fails"]),
        id: asString(raw["id"]),
        mode: asString(raw["mode"]),
        principle: asString(raw["principle"]),
        ...optionalString(raw, "principleRef"),
    };
};

export const normalizeInvariant = function normalizeInvariant(raw: Record<string, unknown>): Invariant {
    return { id: asString(raw["id"]), name: asString(raw["name"]), statement: asString(raw["statement"]) };
};

export const normalizeFailureShape = function normalizeFailureShape(raw: Record<string, unknown>): FailureShape {
    return {
        breaks: asString(raw["breaks"]),
        canon: asStringArray(raw["canon"]),
        fix: asString(raw["fix"]),
        id: asString(raw["id"]),
        instances: asStringArray(raw["instances"]),
        name: asString(raw["name"]),
        shape: asString(raw["shape"]),
    };
};

import { ALGO_SCHEMA, CONTRACT_KIND } from "#configuration/schemas/algorithm.schema";
import { ALGO_SUBJECT, DOMAIN_TIER_VALUES, TIER_KEY } from "#configuration/constants/algorithm.constants";
import type { Contract, DerivationMapEntry, Production } from "#types/algorithm.types";
import { asCheck, mergeCheck } from "#core/converters/check.converter";
import {
    asClosed,
    asDistinctFrom,
    asExemplar,
    asString,
    asStringArray,
    optionalString,
} from "#core/normalizers/field.normalizer";
import type { CheckFacet } from "#types/check.types";
import { isObject } from "#core/predicates/record.predicate";
import { refuseRecord } from "#core/validators/field.validator";
import { slugify } from "#core/converters/identifier.converter";
import { tierOf } from "#configuration/strings/algorithm.strings";

const asProductions = function asProductions(value: unknown): Production[] {
    return (Array.isArray(value) ? value : [])
        .filter(isObject)
        .map((entry) => ({ lhs: asString(entry["lhs"]), rhs: asString(entry["rhs"]) }));
};

const asDerivationMap = function asDerivationMap(value: unknown): DerivationMapEntry[] {
    return (Array.isArray(value) ? value : [])
        .filter(isObject)
        .map((entry) => ({ record: asString(entry["record"]), stage: asString(entry["stage"]) }));
};

type BaseContract = Pick<
    Contract,
    "composes" | "domain" | "flow" | "force" | "id" | "intent" | "invariant" | "productions" | "title"
>;

const baseContract = function baseContract(raw: Record<string, unknown>, domain: string, title: string): BaseContract {
    return {
        composes: asStringArray(raw["composes"]),
        domain,
        flow: asStringArray(raw["flow"]),
        force: asStringArray(raw["force"]),
        id: asString(raw["id"]) || slugify(title),
        intent: asString(raw["intent"]),
        invariant: asString(raw["invariant"]),
        productions: asProductions(raw["productions"]),
        title,
    };
};

type TypedFields = Pick<Contract, "axis" | "mathType" | "stage" | "yields">;
type ListFields = Pick<Contract, "aliases" | "canon" | "derivationMap" | "distinctFrom" | "grounds">;

const typedFieldsOf = function typedFieldsOf(raw: Record<string, unknown>): TypedFields {
    return {
        ...optionalString(raw, "stage"),
        ...optionalString(raw, "axis"),
        ...optionalString(raw, "mathType"),
        ...optionalString(raw, "yields"),
    };
};

const listFieldsOf = function listFieldsOf(raw: Record<string, unknown>): ListFields {
    const grounds = asStringArray(raw["grounds"]);
    const derivationMap = asDerivationMap(raw["derivationMap"]);
    const distinctFrom = asDistinctFrom(raw["distinctFrom"]);
    const canon = asStringArray(raw["canon"]);
    const aliases = asStringArray(raw["aliases"]);
    return {
        ...(aliases.length > 0 ? { aliases } : {}),
        ...(grounds.length > 0 ? { grounds } : {}),
        ...(derivationMap.length > 0 ? { derivationMap } : {}),
        ...(distinctFrom.length > 0 ? { distinctFrom } : {}),
        ...(canon.length > 0 ? { canon } : {}),
    };
};

export const normalizeContract = function normalizeContract(
    raw: Record<string, unknown>,
    domain: string,
    declared: CheckFacet | null,
    group: Record<string, unknown>,
): Contract {
    refuseRecord(ALGO_SUBJECT, CONTRACT_KIND, ALGO_SCHEMA, raw);
    const title = asString(raw["title"]);
    const tier = asClosed(DOMAIN_TIER_VALUES, group[TIER_KEY], tierOf(domain));
    const check = mergeCheck(declared, asCheck(raw["check"]));
    const principleRef = asString(raw["principleRef"]);
    const exemplar = asExemplar(raw["exemplar"]);
    return {
        ...baseContract(raw, domain, title),
        tier,
        ...(principleRef ? { principleRef } : {}),
        ...(raw["meta"] === true ? { meta: true } : {}),
        ...(exemplar ? { exemplar } : {}),
        ...typedFieldsOf(raw),
        ...listFieldsOf(raw),
        ...(check ? { check } : {}),
    };
};

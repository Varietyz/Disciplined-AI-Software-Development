import {
    ID,
    LABEL,
    OPTIONAL_FLAG,
    OPTIONAL_LABEL,
    OPTIONAL_LABELS,
    OPTIONAL_OBJECT,
    OPTIONAL_RECORDS,
    TEXT,
} from "#configuration/constants/field.constants";
import { freeRefs, kept, optionalRef, optionalRefs } from "#core/factories/field.factory";
import type { KindSchema } from "#types/field.types";

export const CONTRACT_KIND = "contract";

const CONTRACTS = "contracts";
const CONTRACTS_TARGET = "algorithms";

export const ALGO_SCHEMA: KindSchema = {
    aliases: OPTIONAL_LABELS,
    axis: optionalRef("reasoning:axis", CONTRACTS),
    canon: OPTIONAL_LABELS,
    check: OPTIONAL_OBJECT,
    composes: optionalRefs(CONTRACTS_TARGET, "composed-by"),
    derivationMap: OPTIONAL_RECORDS,
    "derivationMap.record": kept(optionalRefs(CONTRACTS_TARGET, "derived-by"), "derivation"),
    distinctFrom: OPTIONAL_RECORDS,
    exemplar: OPTIONAL_OBJECT,
    flow: OPTIONAL_LABELS,
    force: { inverse: CONTRACTS, required: false, target: "force", type: "labels" },
    grounds: freeRefs("grounded-by"),
    id: ID,
    intent: TEXT,
    invariant: TEXT,
    mathType: optionalRef("reasoning:math-type", CONTRACTS),
    meta: OPTIONAL_FLAG,
    principleRef: kept(optionalRef("architecture", CONTRACTS), "principle"),
    productions: OPTIONAL_RECORDS,
    stage: optionalRef("stage", CONTRACTS),
    title: LABEL,
    yields: OPTIONAL_LABEL,
};

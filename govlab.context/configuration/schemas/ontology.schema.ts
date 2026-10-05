import { ALGO_SCHEMA, CONTRACT_KIND } from "#configuration/schemas/algorithm.schema";
import { ARCH_SCHEMA, PRINCIPLE_KIND } from "#configuration/schemas/architecture.schema";
import { LEX_SCHEMA, TERM_KIND } from "#configuration/schemas/lexicon.schema";
import type { KindSchema } from "#types/field.types";
import { PAG_SCHEMA } from "#configuration/schemas/grammar.schema";
import { REASON_COLLECTION } from "#configuration/constants/reason.constants";
import { REASON_SCHEMA } from "#configuration/schemas/reason.schema";

export const ONTOLOGY_SCHEMA: ReadonlyMap<string, KindSchema> = new Map([
    ...[...REASON_SCHEMA].map(([kind, schema]): [string, KindSchema] => [`${REASON_COLLECTION}:${kind}`, schema]),
    [`algorithms:${CONTRACT_KIND}`, ALGO_SCHEMA],
    [`architecture:${PRINCIPLE_KIND}`, ARCH_SCHEMA],
    [`lexicon:${TERM_KIND}`, LEX_SCHEMA],
    ...[...PAG_SCHEMA].map(([kind, schema]): [string, KindSchema] => [`pag:${kind}`, schema]),
]);

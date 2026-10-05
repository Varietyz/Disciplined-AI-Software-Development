import { ALGO_FACE } from "#core/factories/algorithm.factory";
import { ARCH_FACE } from "#core/factories/architecture.factory";
import { LEX_FACE } from "#core/factories/lexicon.factory";
import type { OntologyFaceDefinition } from "#types/ontology.types";
import { PAG_FACE } from "#core/factories/grammar.factory";
import { REASON_FACE } from "#core/factories/reason.factory";

export const ONTOLOGY_FACES: readonly OntologyFaceDefinition[] = Object.freeze([
    ARCH_FACE,
    ALGO_FACE,
    PAG_FACE,
    LEX_FACE,
    REASON_FACE,
]);

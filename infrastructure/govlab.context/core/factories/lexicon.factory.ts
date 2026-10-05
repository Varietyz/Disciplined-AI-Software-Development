import type { Lexicon, LexiconOptions } from "#types/lexicon.types";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import { LexiconStore } from "#core/stores/lexicon.store";
import { defineOntologyFace } from "#core/registries/ontology.registry";

export const createLexicon = function createLexicon(options: LexiconOptions = {}): Lexicon {
    return new LexiconStore(options);
};

export const LEX_FACE = defineOntologyFace<Lexicon>({
    build: (context) => new LexiconStore({ canonicalizeId: context.canonicalizeId, logger: context.logger }),
    name: COLLECTIONS.lexicon,
});

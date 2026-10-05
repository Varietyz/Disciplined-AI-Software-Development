import type { AlgoGrammar, AlgoGrammarOptions } from "#types/algorithm.types";
import { AlgorithmStore } from "#core/stores/algorithm.store";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import { defineOntologyFace } from "#core/registries/ontology.registry";

export const createAlgoGrammar = function createAlgoGrammar(options: AlgoGrammarOptions = {}): AlgoGrammar {
    return new AlgorithmStore(options);
};

export const ALGO_FACE = defineOntologyFace<AlgoGrammar>({
    build: (context) => new AlgorithmStore({ logger: context.logger }),
    name: COLLECTIONS.algorithms,
});

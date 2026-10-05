import type { ArchRelations, ArchRelationsOptions } from "#types/architecture.types";
import { ArchitectureStore } from "#core/stores/architecture.store";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import { defineOntologyFace } from "#core/registries/ontology.registry";

export const createArchRelations = function createArchRelations(options: ArchRelationsOptions = {}): ArchRelations {
    return new ArchitectureStore(options);
};

export const ARCH_FACE = defineOntologyFace<ArchRelations>({
    build: (context) => new ArchitectureStore({ canonicalizeId: context.canonicalizeId, logger: context.logger }),
    name: COLLECTIONS.architecture,
});

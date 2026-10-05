import type { Faces, GovlabContext, GovlabContextOptions } from "#types/context.types";
import { checkGapsFor, runValidation } from "#core/validators/ontology.validator";
import {
    isAlgoGrammar,
    isArchRelations,
    isLexicon,
    isPagGrammar,
    isReasonOntology,
    requireFace,
} from "#core/guards/context.guard";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import type { DeclaredCheck } from "#types/check.types";
import { KIND_TAXONOMY } from "#configuration/constants/kind.constants";
import { ONTOLOGY_FACES } from "#core/registries/context.registry";
import { checkedRecordsOf } from "#core/selectors/check.selector";
import { collectionRefResolver } from "#core/resolvers/reference.resolver";
import { createLayerJoin } from "#core/factories/layer.factory";
import { crossValidateFaces } from "#core/validators/vocabulary.validator";
import { foldFaces } from "#core/registries/ontology.registry";
import { slugify } from "#core/converters/identifier.converter";

const assemble = function assemble(faces: Faces, checks: readonly DeclaredCheck[]): GovlabContext {
    return {
        algo: faces.algo,
        arch: faces.arch,
        checkGaps: () => checkGapsFor(faces, checks),
        checkedRecords: () => checkedRecordsOf(faces, checks),
        crossValidate: () => crossValidateFaces(faces),
        joinConcerns: () =>
            faces.algo.joinConcerns({
                principlesForForce: (force) => faces.arch.query({ scope: force }).map((principle) => principle.id),
            }),
        kindTaxonomy: () => KIND_TAXONOMY,
        layerOf: (idOrName) => faces.layerJoin.layerOf(idOrName),
        layers: () => faces.layerJoin.layers(),
        lex: faces.lex,
        pag: faces.pag,
        reason: faces.reason,
        resolutions: () => faces.layerJoin.resolutions(),
        resolveRef: collectionRefResolver(faces),
        resolveTension: (a, b) => faces.layerJoin.resolveTension(a, b),
        slugify,
        topology: () => faces.layerJoin.topology(),
        validateResolution: () => runValidation(faces, checks),
    };
};

export const createGovlabContext = function createGovlabContext(options: GovlabContextOptions = {}): GovlabContext {
    const { checks = [], logger, canonicalizeId } = options;
    const built = foldFaces(ONTOLOGY_FACES, { canonicalizeId, logger });
    const arch = requireFace(built.get(COLLECTIONS.architecture), isArchRelations, COLLECTIONS.architecture);
    const algo = requireFace(built.get(COLLECTIONS.algorithms), isAlgoGrammar, COLLECTIONS.algorithms);
    const pag = requireFace(built.get(COLLECTIONS.pag), isPagGrammar, COLLECTIONS.pag);
    const lex = requireFace(built.get(COLLECTIONS.lexicon), isLexicon, COLLECTIONS.lexicon);
    const reason = requireFace(built.get(COLLECTIONS.reasoning), isReasonOntology, COLLECTIONS.reasoning);
    const layerJoin = createLayerJoin({ algo, arch, lex });
    return assemble({ algo, arch, layerJoin, lex, pag, reason }, checks);
};

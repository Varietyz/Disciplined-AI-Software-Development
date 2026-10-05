export { ALGO_FACE, createAlgoGrammar } from "#core/factories/algorithm.factory";
export { ARCH_FACE, createArchRelations } from "#core/factories/architecture.factory";
export { BaseOntology } from "#core/stores/ontology.store";
export { CANONICAL_KINDS, KIND_DECISION_ORDER, KIND_TAXONOMY } from "#configuration/constants/kind.constants";
export { CLOSED_VOCABULARIES } from "#configuration/constants/vocabulary.constants";
export { CONCEPTS, VARIANTS } from "#configuration/constants/concept.constants";
export {
    CONDITIONAL_SEVERITY,
    EDGE_RELATIONS,
    RELATION_RANGES,
    SEVERITY_LEVELS,
    SEVERITY_LEVEL_VALUES,
    SEVERITY_TAXONOMY,
} from "#configuration/constants/architecture.constants";
export {
    EXAMPLE_SHAPES,
    EXAMPLE_SHAPE_VALUES,
    EXAMPLE_SHAPE_VOCABULARY,
} from "#configuration/constants/lexicon.constants";
export { LEX_FACE, createLexicon } from "#core/factories/lexicon.factory";
export { ONTOLOGY_FACES } from "#core/registries/context.registry";
export { ONTOLOGY_SCHEMA } from "#configuration/schemas/ontology.schema";
export { PAG_FACE, createPagGrammar } from "#core/factories/grammar.factory";
export { PAG_KINDS } from "#configuration/schemas/grammar.schema";
export { REASON_FACE, createReason } from "#core/factories/reason.factory";
export { REF_COLLECTIONS } from "#core/resolvers/reference.resolver";
export { buildSymbolIndex } from "#core/converters/algorithm.index.converter";
export { createGovlabContext } from "#core/factories/context.factory";
export { debugLogger } from "#core/reporters/ontology.reporter";
export { defineOntologyFace, foldFaces } from "#core/registries/ontology.registry";
export { executableDocuments } from "#core/loaders/document.loader";
export { keywordIdOf } from "#core/selectors/grammar.selector";
export { pagBlockOf, pagTextOf } from "#core/selectors/document.selector";
export { parse } from "#core/parsers/document.parser";
export { patternVocabularyOf } from "#core/selectors/pattern.selector";
export { resolvePagTemplate } from "#core/resolvers/template.resolver";
export { nameKeyOf, slugify } from "#core/converters/identifier.converter";
export { symbolIndexesMatch } from "#core/predicates/algorithm.predicate";
export { templateRefsOf, unresolvedTemplateRefsOf } from "#core/analyzers/template.analyzer";
export { validate, validateDocuments, verdictOf } from "#core/validators/document.validator";
export { valuesAt } from "#core/selectors/field.selector";
export type { AlgoGrammar, Contract, ContractCategory } from "#types/algorithm.types";
export type { ArchRelations, Principle, PrincipleCategory, PrincipleRecord } from "#types/architecture.types";
export type { CheckDeclaration, CheckFacet, CheckedRecord, DeclaredCheck } from "#types/check.types";
export { defineCheck } from "#core/factories/check.factory";
export { loadDeclaredChecks } from "#core/loaders/check.loader";
export type { Concept } from "#types/concept.types";
export type { Exemplar, FieldSpec } from "#types/field.types";
export type { GovlabContext } from "#types/context.types";
export type { Lens } from "#types/reason.concept.types";
export type { ReasonNode } from "#types/reason.node.types";
export type { Lexicon, Term } from "#types/lexicon.types";
export type { TestSurface } from "#types/reason.surface.types";

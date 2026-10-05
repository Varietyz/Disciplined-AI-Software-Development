import type { ContractResolver, GrammarIndexes, PagData, PagGrammar, PagGrammarOptions } from "#types/grammar.types";
import { categoriesOf, contextFor, hasRoleIn, keywordIdOf } from "#core/selectors/grammar.selector";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import { CheckTable } from "#core/stores/check.store";
import { PAG_SUBJECT } from "#configuration/constants/grammar.constants";
import { ReadAudit } from "#core/observers/record.observer";
import { deepFreeze } from "#core/converters/base.converter";
import { defineOntologyFace } from "#core/registries/ontology.registry";
import { grammarIssuesOf } from "#core/validators/grammar.validator";
import { isAlgoGrammar } from "#core/guards/context.guard";
import { loadBundledData } from "#core/loaders/grammar.loader";
import { missingDependency } from "#configuration/strings/ontology.strings";
import { parse } from "#core/parsers/document.parser";
import { resolvePagTemplate } from "#core/resolvers/template.resolver";
import { unknownTemplateType } from "#configuration/strings/grammar.strings";
import { validate } from "#core/validators/document.validator";

const buildIndexes = function buildIndexes(data: PagData): GrammarIndexes {
    return {
        keywordById: new Map(data.keywords.map((record) => [keywordIdOf(record), record])),
        productionByLhs: new Map(data.productions.map((record) => [record.lhs, record])),
        templateByType: new Map(data.templates.map((record) => [record.type, record])),
        typeByName: new Map(data.documentTypes.map((record) => [record.type, record])),
    };
};

const assemble = function assemble(
    data: PagData,
    indexes: GrammarIndexes,
    resolver: ContractResolver,
): Omit<PagGrammar, "attributions" | "checkOf" | "unreadKeys"> {
    return {
        categories: () => categoriesOf(data),
        contextFor: (type) => contextFor(type, { data, indexes, resolver }),
        documentType: (type) => indexes.typeByName.get(type) ?? null,
        documentTypes: () => [...data.documentTypes],
        keyword: (id) => indexes.keywordById.get(id) ?? null,
        keywords: (category) =>
            typeof category === "string" && category.length > 0
                ? data.keywords.filter((record) => hasRoleIn(record, category))
                : [...data.keywords],
        parse: (text) => parse(text),
        production: (lhs) => indexes.productionByLhs.get(lhs) ?? null,
        productions: () => [...data.productions],
        resolvePagTemplate: (type, slots) => {
            const template = indexes.templateByType.get(type);
            return template
                ? resolvePagTemplate(template, slots)
                : { text: "", unresolved: [], violations: [unknownTemplateType(type)] };
        },
        template: (type) => indexes.templateByType.get(type) ?? null,
        templates: () => [...data.templates],
        validate: (text) => validate(text),
        validateOntology: () => grammarIssuesOf(data, indexes.typeByName),
    };
};

export const createPagGrammar = function createPagGrammar(options: PagGrammarOptions = {}): PagGrammar {
    const audit = new ReadAudit(COLLECTIONS.pag);
    const checks = new CheckTable();
    const data = deepFreeze(options.data ?? loadBundledData(audit, checks));
    const indexes = buildIndexes(data);
    return {
        ...assemble(data, indexes, options.resolver ?? {}),
        attributions: () => audit.attributions(),
        checkOf: (kind, id) => checks.checkOf(kind, id),
        unreadKeys: () => audit.unread(),
    };
};

export const PAG_FACE = defineOntologyFace<PagGrammar>({
    build: (_context, dependencies) => {
        const algo = dependencies[COLLECTIONS.algorithms];
        if (!isAlgoGrammar(algo)) {
            throw new Error(missingDependency(COLLECTIONS.pag, COLLECTIONS.algorithms));
        }
        return createPagGrammar({
            resolver: { contractsForType: () => algo.query({ domain: PAG_SUBJECT }).map((contract) => contract.id) },
        });
    },
    dependsOn: [COLLECTIONS.algorithms],
    name: COLLECTIONS.pag,
});

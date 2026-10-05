import {
    ALGO_DOMAIN_FACE,
    ALGO_FACE,
    ARCH_FACE,
    COMPOSED_BY_RELATION,
    CONTRACTS_RELATION,
    DERIVED_BY_RELATION,
    DETECTS_RELATION,
    GROUNDED_BY_RELATION,
    LAYER_FACE,
    LEX_FACE,
    REFERENCED_BY_RELATION,
} from "@govlab/constants";
import { type Contract, type GovlabContext, type Principle, slugify } from "@govlab/context";
import type {
    ContractDomainView,
    ContractView,
    OntologySnapshot,
    PrincipleCategoryView,
    PrincipleView,
} from "@banes-lab/web/types/ontology.types.js";
import type { EdgeRef, EdgeRelation } from "@banes-lab/web/types/link.types.js";
import { SEVERITY_VOCABULARY, TIER_VOCABULARY } from "#configuration/constants/ontology.constants";
import { createResolver, refOf } from "#core/resolvers/ontology.resolver";
import { createReverseIndex, lookup } from "#core/converters/ontology.index.converter";
import { distinctsOf, exemplarOf, groupBy, layerRef, orNull } from "#core/converters/view.converter";
import { forceNames, forcesOf, kindsOf, layersOf, rangesOf } from "#core/converters/layer.converter";
import type { OntologySources } from "#types/ontology.types";
import { grammarOf } from "#core/converters/grammar.converter";
import { reasonOf } from "#core/converters/reason.converter";
import { resolutionOf } from "#core/converters/check.converter";
import { termsOf } from "#core/converters/lexicon.converter";
import { vocabulariesOf } from "#core/converters/ontology.vocabulary.converter";

const edgeRefs = function edgeRefs(
    sources: OntologySources,
    principle: Principle,
    relation: EdgeRelation,
): readonly EdgeRef[] {
    return sources.context.arch
        .resolve([principle.id])
        .edges[relation].map((edge) =>
            typeof edge === "string"
                ? sources.resolve.arch(edge)
                : { label: edge.name, ref: refOf(ARCH_FACE, edge.id) },
        );
};

const tensionsOf = function tensionsOf(sources: OntologySources, principle: Principle): readonly EdgeRef[] {
    return principle.tensions_with.flatMap((target) => {
        const resolution = sources.context.resolveTension(principle.id, target);
        return resolution === null
            ? []
            : [sources.resolve.tension(sources.resolve.arch(resolution.a), sources.resolve.arch(resolution.b))];
    });
};

const termTwin = function termTwin(sources: OntologySources, principle: Principle): EdgeRef | null {
    for (const key of [principle.name, ...(principle.aliases ?? [])]) {
        const term = sources.context.lex.resolve(key);
        if (term !== null) {
            return { label: term.name, ref: refOf(LEX_FACE, term.id) };
        }
    }
    return null;
};

const principleView = function principleView(sources: OntologySources, principle: Principle): PrincipleView {
    const { resolve } = sources;
    return {
        aliases: principle.aliases ?? [],
        canon: principle.canon ?? [],
        category: resolve.archCategory(principle.category),
        contracts: lookup(sources.index, CONTRACTS_RELATION, ARCH_FACE, principle.id),
        definition: principle.definition,
        detectedBy: resolve.labels(principle.detected_by),
        distinctFrom: distinctsOf(principle.distinctFrom, resolve.target),
        edges: {
            conflictsWith: edgeRefs(sources, principle, "conflictsWith"),
            enables: edgeRefs(sources, principle, "enables"),
            reinforces: edgeRefs(sources, principle, "reinforces"),
            requires: edgeRefs(sources, principle, "requires"),
            tensionsWith: edgeRefs(sources, principle, "tensionsWith"),
        },
        enforcedBy: resolve.labels(principle.enforced_by),
        exemplar: exemplarOf(principle.exemplar),
        expressedBy: (principle.expressedBy ?? []).map((target) => resolve.target(target)),
        formedBy: orNull(principle.formed_by),
        id: principle.id,
        kind: resolve.kind(principle.type),
        layer: layerRef(sources, principle.id),
        mandatoryFor: orNull(principle.mandatoryFor),
        measuredBy: resolve.labels(principle.measured_by),
        name: principle.name,
        refactoredBy: principle.refactored_by.map((target) => resolve.target(target)),
        referencedBy: lookup(sources.index, REFERENCED_BY_RELATION, ARCH_FACE, principle.id),
        scope: principle.scope.map((scope) => resolve.force(scope, sources.forces)),
        severity: resolve.vocabulary(SEVERITY_VOCABULARY, principle.severity),
        tensions: tensionsOf(sources, principle),
        term: termTwin(sources, principle),
        violatedBy: (principle.violated_by ?? []).map((target) => resolve.target(target)),
    };
};

const principlesOf = function principlesOf(sources: OntologySources): readonly PrincipleCategoryView[] {
    return groupBy(sources.context.arch.all(), (principle) => principle.category).map(([category, principles]) => ({
        category,
        id: slugify(category),
        principles: principles.map((principle) => principleView(sources, principle)),
    }));
};

const contractView = function contractView(sources: OntologySources, contract: Contract): ContractView {
    const { index, resolve } = sources;
    const principle = contract.principleRef === undefined ? null : resolve.archId(contract.principleRef);
    const isLayer = sources.context.layers().some((layer) => layer.id === contract.id);
    return {
        axis: contract.axis === undefined ? null : resolve.reason(contract.axis),
        canon: contract.canon ?? [],
        composedBy: lookup(index, COMPOSED_BY_RELATION, ALGO_FACE, contract.id),
        composes: contract.composes.map((target) => resolve.algo(target)),
        derivationMap: (contract.derivationMap ?? []).map((entry) => ({
            record: resolve.algo(entry.record),
            stage: resolve.stage(entry.stage),
        })),
        derivedBy: lookup(index, DERIVED_BY_RELATION, ALGO_FACE, contract.id),
        detects: lookup(index, DETECTS_RELATION, ALGO_FACE, contract.id),
        distinctFrom: distinctsOf(contract.distinctFrom, resolve.algo),
        domain: { label: contract.domain, ref: refOf(ALGO_DOMAIN_FACE, slugify(contract.domain)) },
        exemplar: exemplarOf(contract.exemplar),
        flow: contract.flow,
        force: contract.force.map((force) => resolve.force(force, sources.forces)),
        groundedBy: lookup(index, GROUNDED_BY_RELATION, ALGO_FACE, contract.id),
        grounds: (contract.grounds ?? []).map((ground) => resolve.target(ground)),
        id: contract.id,
        intent: contract.intent,
        invariant: contract.invariant,
        layer: isLayer ? { label: contract.title, ref: refOf(LAYER_FACE, contract.id) } : null,
        mathType: contract.mathType === undefined ? null : resolve.reason(contract.mathType),
        meta: contract.meta === true,
        principle,
        productions: contract.productions.map((production) => ({ lhs: production.lhs, rhs: production.rhs })),
        stage: contract.stage === undefined ? null : resolve.stage(contract.stage),
        tier: resolve.vocabulary(TIER_VOCABULARY, contract.tier),
        title: contract.title,
        yields: orNull(contract.yields),
    };
};

const contractsOf = function contractsOf(sources: OntologySources): readonly ContractDomainView[] {
    return groupBy(sources.context.algo.all(), (contract) => contract.domain).map(([domain, contracts]) => ({
        contracts: contracts.map((contract) => contractView(sources, contract)),
        domain,
        id: slugify(domain),
    }));
};

export const snapshotOf = function snapshotOf(context: GovlabContext): OntologySnapshot {
    const resolve = createResolver(context);
    const sources: OntologySources = {
        context,
        forces: forceNames(context),
        index: createReverseIndex(context, resolve),
        resolve,
    };
    const contracts = contractsOf(sources);
    const layers = layersOf(context, resolve);
    const principles = principlesOf(sources);
    const reason = reasonOf(context, resolve, sources.index);
    const terms = termsOf(sources, principles);
    return {
        contracts,
        forces: forcesOf(context, resolve),
        grammar: grammarOf(context, resolve),
        kinds: kindsOf(context),
        layers,
        principles,
        ranges: rangesOf(resolve),
        reason,
        resolution: resolutionOf(context, resolve),
        terms,
        vocabularies: vocabulariesOf({
            contracts,
            principles,
            surfaces: reason.testSurfaces,
            tensions: layers.resolutions,
            terms,
            topology: layers.topology,
        }),
    };
};

import {
    AXIS_KIND,
    DIMENSION_KIND,
    EVIDENCE_VOCABULARY,
    FAILURE_SHAPE_KIND,
    INVARIANT_KIND,
    LENS_KIND,
    MATH_DOMAIN_KIND,
    MATH_TYPE_KIND,
    MODEL_KIND,
    NODE_KIND,
    PATTERN_TYPE_KIND,
    PREDICATE_VOCABULARY,
    REASON_LAYER_KIND,
    REPRESENTATION_KIND,
    TECHNIQUE_KIND,
    TEST_SURFACE_KIND,
    UNIVERSAL_AXIS_KIND,
    VERDICT_VOCABULARY,
} from "#configuration/constants/ontology.constants";
import type { AxisView, ReasonNodeView } from "@banes-lab/web/types/loop.types.js";
import { CONTRACTS_RELATION, GROUNDED_BY_RELATION, REASON_FACE } from "@govlab/constants";
import type { GovlabContext, Lens, ReasonNode, TestSurface } from "@govlab/context";
import type { LensView, ReasonView, TestSurfaceView } from "@banes-lab/web/types/reason.types.js";
import { NODES_RELATION, TEST_SURFACES_RELATION } from "#configuration/constants/graph.constants";
import type { ReasonSources, Resolver, ReverseIndex } from "#types/ontology.types";
import { edgesOf, loopOf, mapsOf, substrateOf } from "#core/converters/reason.loop.converter";
import { catalogsOf } from "#core/converters/reason.catalog.converter";
import { lookup } from "#core/converters/ontology.index.converter";
import { orNull } from "#core/converters/base.converter";
import { reasonAnchor } from "#core/resolvers/ontology.resolver";

const LABEL_STEP_KIND = "label";

const nodeView = function nodeView(node: ReasonNode, sources: ReasonSources): ReasonNodeView {
    const { context, resolve } = sources;
    const concept = context.reason.conceptOf(node.id);
    return {
        anchor: reasonAnchor(NODE_KIND, node.id),
        answerShape: orNull(node.answerShape),
        axis: resolve.reasonAs(AXIS_KIND, node.axis),
        concept: node.concept === undefined ? null : resolve.reasonAs(concept?.kind ?? DIMENSION_KIND, node.concept),
        decisionTest: orNull(node.decisionTest),
        groundedBy: lookup(sources.index, GROUNDED_BY_RELATION, REASON_FACE, reasonAnchor(NODE_KIND, node.id)),
        id: node.id,
        mathType: resolve.reasonAs(MATH_TYPE_KIND, node.mathType),
        name: node.name,
        question: orNull(node.question),
        role: orNull(node.role),
    };
};

const axesOf = function axesOf(sources: ReasonSources): readonly AxisView[] {
    const { context, index, resolve } = sources;
    return context.reason
        .axes()
        .map((axis) => ({
            anchor: reasonAnchor(AXIS_KIND, axis.id),
            contracts: lookup(index, CONTRACTS_RELATION, REASON_FACE, reasonAnchor(AXIS_KIND, axis.id)),
            id: axis.id,
            layer: resolve.reasonAs(REASON_LAYER_KIND, axis.layer),
            mandatory: axis.mandatory,
            nodes: lookup(index, NODES_RELATION, REASON_FACE, reasonAnchor(AXIS_KIND, axis.id)),
            primaryMathType: resolve.reasonAs(MATH_TYPE_KIND, axis.primaryMathType),
            question: axis.question,
            selectable: axis.selectable,
        }));
};

const lensView = function lensView(lens: Lens, sources: ReasonSources): LensView {
    const { resolve } = sources;
    return {
        anchor: reasonAnchor(LENS_KIND, lens.id),
        detectedBy: (lens.detectedBy ?? []).map((detector) => resolve.target(detector)),
        id: lens.id,
        mathDomains: lens.mathDomains.map((domain) => resolve.reasonAs(MATH_DOMAIN_KIND, domain)),
        mathFields: lens.mathFields,
        nature: lens.nature,
        question: lens.question,
        surfaces: lens.surfaces ?? [],
        testSurfaces: lookup(sources.index, TEST_SURFACES_RELATION, REASON_FACE, reasonAnchor(LENS_KIND, lens.id)),
        universalAxis: resolve.reasonAs(UNIVERSAL_AXIS_KIND, lens.universalAxis),
    };
};

const surfaceView = function surfaceView(surface: TestSurface, resolve: Resolver): TestSurfaceView {
    return {
        anchor: reasonAnchor(TEST_SURFACE_KIND, surface.id),
        dimension: resolve.reasonAs(DIMENSION_KIND, surface.dimension),
        evidenceGrounds: (surface.evidence.grounds ?? []).map((ground) => resolve.target(ground)),
        evidenceRequired: surface.evidence.required,
        evidenceSource: resolve.vocabulary(EVIDENCE_VOCABULARY, surface.evidence.source),
        failureModes: surface.failureModes,
        fit: surface.fit,
        id: surface.id,
        invariant: resolve.reasonAs(INVARIANT_KIND, surface.invariant),
        lens: resolve.reasonAs(LENS_KIND, surface.lens),
        predicateExpression: surface.predicate.expression,
        predicateGrounds: (surface.predicate.grounds ?? []).map((ground) => resolve.target(ground)),
        predicateType: resolve.vocabulary(PREDICATE_VOCABULARY, surface.predicate.type),
        techniques: surface.techniques.map((technique) => resolve.reasonAs(TECHNIQUE_KIND, technique)),
        verdictDomain: surface.verdictDomain.map((verdict) => resolve.vocabulary(VERDICT_VOCABULARY, verdict)),
    };
};

const modelsOf = function modelsOf(sources: ReasonSources): ReasonView["models"] {
    const { context, resolve } = sources;
    return context.reason
        .models()
        .map((model) => ({
            anchor: reasonAnchor(MODEL_KIND, model.id),
            id: model.id,
            question: model.question,
            recursionFrom: model.recursion?.from ?? null,
            recursionTo: model.recursion?.to ?? null,
            sequence:
                model.stepKind === LABEL_STEP_KIND
                    ? []
                    : model.sequence.map((step) => resolve.reasonAs(model.stepKind, step)),
            steps: model.stepKind === LABEL_STEP_KIND ? model.sequence : [],
        }));
};

export const reasonOf = function reasonOf(context: GovlabContext, resolve: Resolver, index: ReverseIndex): ReasonView {
    const sources: ReasonSources = { context, index, resolve };
    const { reason } = context;
    return {
        ...catalogsOf(sources),
        axes: axesOf(sources),
        derivationLoop: loopOf(sources),
        edges: edgesOf(sources),
        failureShapes: reason
            .failureShapes()
            .map((shape) => ({
                anchor: reasonAnchor(FAILURE_SHAPE_KIND, shape.id),
                breaks: resolve.reasonAs(INVARIANT_KIND, shape.breaks),
                canon: shape.canon,
                fix: shape.fix,
                id: shape.id,
                instances: shape.instances.map((instance) => resolve.target(instance)),
                name: shape.name,
                shape: shape.shape,
            })),
        lenses: reason.lenses().map((lens) => lensView(lens, sources)),
        maps: mapsOf(sources),
        mathDomains: reason
            .mathDomains()
            .map((domain) => ({ ...domain, anchor: reasonAnchor(MATH_DOMAIN_KIND, domain.id) })),
        models: modelsOf(sources),
        nodes: reason.nodes().map((node) => nodeView(node, sources)),
        patternTypes: reason
            .patternTypes()
            .map((pattern) => ({ ...pattern, anchor: reasonAnchor(PATTERN_TYPE_KIND, pattern.id) })),
        representations: reason
            .representations()
            .map((representation) => ({
                ...representation,
                anchor: reasonAnchor(REPRESENTATION_KIND, representation.id),
            })),
        substrate: substrateOf(sources),
        testSurfaces: reason.testSurfaces().map((surface) => surfaceView(surface, resolve)),
        uncoveredCells: reason
            .uncoveredCells()
            .map((cell) => ({
                dimension: resolve.reasonAs(DIMENSION_KIND, cell.dimension),
                lens: resolve.reasonAs(LENS_KIND, cell.lens),
            })),
    };
};

import {
    AXES_RELATION,
    LENSES_RELATION,
    SURFACES_RELATION,
    TECHNIQUES_RELATION,
} from "#configuration/constants/graph.constants";
import { CONTRACTS_RELATION, GROUNDED_BY_RELATION, REASON_FACE } from "@govlab/constants";
import {
    DIMENSION_KIND,
    INVARIANT_KIND,
    MATH_DOMAIN_KIND,
    MATH_TYPE_KIND,
    MODE_KIND,
    REASON_LAYER_KIND,
    TECHNIQUE_KIND,
    UNIVERSAL_AXIS_KIND,
} from "#configuration/constants/ontology.constants";
import type {
    DimensionView,
    InvariantView,
    MathTypeView,
    ModeView,
    ReasonLayerView,
    ReasonView,
    TechniqueView,
    UniversalAxisView,
} from "@banes-lab/web/types/reason.types.js";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { ReasonSources } from "#types/ontology.types";
import { lookup } from "#core/converters/ontology.index.converter";
import { orNull } from "#core/converters/base.converter";
import { reasonAnchor } from "#core/resolvers/ontology.resolver";

type Catalogs = Pick<
    ReasonView,
    "dimensions" | "invariants" | "layers" | "mathTypes" | "modes" | "techniques" | "universalAxes"
>;

const reverseOf = function reverseOf(
    sources: ReasonSources,
    relation: string,
    kind: string,
    id: string,
): readonly EdgeRef[] {
    return lookup(sources.index, relation, REASON_FACE, reasonAnchor(kind, id));
};

const surfaceCatalogs = function surfaceCatalogs(sources: ReasonSources): Pick<Catalogs, "dimensions" | "invariants"> {
    const { reason } = sources.context;
    const dimensions: DimensionView[] = reason
        .dimensions()
        .map((dimension) => ({
            ...dimension,
            anchor: reasonAnchor(DIMENSION_KIND, dimension.id),
            mathDomains: dimension.mathDomains.map((domain) => sources.resolve.reasonAs(MATH_DOMAIN_KIND, domain)),
            surfaces: reverseOf(sources, SURFACES_RELATION, DIMENSION_KIND, dimension.id),
        }));
    const invariants: InvariantView[] = reason
        .invariants()
        .map((invariant) => ({
            ...invariant,
            anchor: reasonAnchor(INVARIANT_KIND, invariant.id),
            groundedBy: reverseOf(sources, GROUNDED_BY_RELATION, INVARIANT_KIND, invariant.id),
            surfaces: reverseOf(sources, SURFACES_RELATION, INVARIANT_KIND, invariant.id),
        }));
    return { dimensions, invariants };
};

export const catalogsOf = function catalogsOf(sources: ReasonSources): Catalogs {
    const { context, resolve } = sources;
    const { reason } = context;
    const layers: ReasonLayerView[] = reason
        .layers()
        .map((layer) => ({
            ...layer,
            anchor: reasonAnchor(REASON_LAYER_KIND, layer.id),
            axes: reverseOf(sources, AXES_RELATION, REASON_LAYER_KIND, layer.id),
        }));
    const mathTypes: MathTypeView[] = reason
        .mathTypes()
        .map((mathType) => ({
            ...mathType,
            anchor: reasonAnchor(MATH_TYPE_KIND, mathType.id),
            contracts: reverseOf(sources, CONTRACTS_RELATION, MATH_TYPE_KIND, mathType.id),
            mathDomains: mathType.domains.map((domain) => resolve.reasonAs(MATH_DOMAIN_KIND, domain)),
        }));
    const modes: ModeView[] = reason
        .modes()
        .map((mode) => ({
            anchor: reasonAnchor(MODE_KIND, mode.id),
            id: mode.id,
            practice: mode.practice,
            question: orNull(mode.question),
            techniques: reverseOf(sources, TECHNIQUES_RELATION, MODE_KIND, mode.id),
        }));
    const techniques: TechniqueView[] = reason
        .techniques()
        .map((technique) => ({
            ...technique,
            anchor: reasonAnchor(TECHNIQUE_KIND, technique.id),
            mode: resolve.reasonAs(MODE_KIND, technique.mode),
            principleRef: technique.principleRef === undefined ? null : resolve.archId(technique.principleRef),
            surfaces: reverseOf(sources, SURFACES_RELATION, TECHNIQUE_KIND, technique.id),
        }));
    const universalAxes: UniversalAxisView[] = reason
        .universalAxes()
        .map((axis) => ({
            ...axis,
            anchor: reasonAnchor(UNIVERSAL_AXIS_KIND, axis.id),
            lenses: reverseOf(sources, LENSES_RELATION, UNIVERSAL_AXIS_KIND, axis.id),
            subsumes: axis.subsumes.map((subsumed) => resolve.reasonAs(DIMENSION_KIND, subsumed)),
        }));
    return { ...surfaceCatalogs(sources), layers, mathTypes, modes, techniques, universalAxes };
};

import {
    AXIS_KIND,
    DIMENSION_KIND,
    INVARIANT_KIND,
    LENS_KIND,
    LOOP_KIND,
    MATH_DOMAIN_KIND,
    MATH_TYPE_KIND,
    MODEL_KIND,
    MODE_KIND,
    NODE_KIND,
    PATTERN_TYPE_KIND,
    REASON_LAYER_KIND,
    REPRESENTATION_KIND,
    SUBSTRATE_NODE_KIND,
    TECHNIQUE_KIND,
    TEST_SURFACE_KIND,
    UNIVERSAL_AXIS_KIND,
} from "#configuration/constants/ontology.constants";
import type { GovlabContext } from "@govlab/context";

export const reasonIndexOf = function reasonIndexOf(
    context: GovlabContext,
): ReadonlyMap<string, ReadonlyMap<string, string>> {
    const { reason } = context;
    const collections: readonly [string, readonly { readonly id: string; readonly label?: string }[]][] = [
        [LOOP_KIND, [reason.derivationLoop()]],
        [NODE_KIND, reason.nodes()],
        [AXIS_KIND, reason.axes()],
        [REASON_LAYER_KIND, reason.layers()],
        [MATH_TYPE_KIND, reason.mathTypes()],
        [SUBSTRATE_NODE_KIND, reason.substrate().nodes],
        [DIMENSION_KIND, reason.dimensions()],
        [LENS_KIND, reason.lenses()],
        [MODE_KIND, reason.modes()],
        [REPRESENTATION_KIND, reason.representations()],
        [MATH_DOMAIN_KIND, reason.mathDomains()],
        [PATTERN_TYPE_KIND, reason.patternTypes()],
        [MODEL_KIND, reason.models()],
        [UNIVERSAL_AXIS_KIND, reason.universalAxes()],
        [TEST_SURFACE_KIND, reason.testSurfaces()],
        [TECHNIQUE_KIND, reason.techniques()],
        [INVARIANT_KIND, reason.invariants()],
    ];
    return new Map(
        collections.map(([kind, records]) => [
            kind,
            new Map(records.map((record) => [record.id, record.label ?? record.id])),
        ]),
    );
};

import { LAYER_EDGE_KIND_VALUES, RESOLUTION_MECHANISM_VALUES } from "#configuration/constants/layer.constants";
import type { LayerEdge, LayerMembership, TensionResolution } from "#types/layer.types";
import { asClosed, asString } from "#core/normalizers/field.normalizer";
import { edgeKindOf, mechanismOf } from "#configuration/strings/layer.strings";
import { isObject } from "#core/predicates/record.predicate";

export const asLayerEdge = function asLayerEdge(value: unknown): LayerEdge | null {
    if (!isObject(value)) {
        return null;
    }
    const from = asString(value["from"]);
    const to = asString(value["to"]);
    const kind = asClosed(LAYER_EDGE_KIND_VALUES, value["kind"], edgeKindOf(from, to));
    return from && to ? { from, kind, to } : null;
};

export const asLayerMembership = function asLayerMembership(value: unknown): LayerMembership | null {
    if (!isObject(value)) {
        return null;
    }
    const key = asString(value["key"]);
    const layer = asString(value["layer"]);
    return key && layer ? { key, layer } : null;
};

export const asTensionResolution = function asTensionResolution(value: unknown): TensionResolution | null {
    if (!isObject(value)) {
        return null;
    }
    const a = asString(value["a"]);
    const b = asString(value["b"]);
    const mechanism = asClosed(RESOLUTION_MECHANISM_VALUES, value["mechanism"], mechanismOf(a, b));
    const rule = asString(value["rule"]);
    const scopeA = asString(value["scopeA"]);
    const scopeB = asString(value["scopeB"]);
    return a && b && rule ? { a, b, mechanism, rule, scopeA, scopeB } : null;
};

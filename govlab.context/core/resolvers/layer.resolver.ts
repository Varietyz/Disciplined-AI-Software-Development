import type { JoinState, LayerMembership, RefMaps, TensionPair, TensionResolution } from "#types/layer.types";
import { scopeSeparationRule, tradeoffRule } from "#configuration/strings/layer.strings";
import type { ArchRelations } from "#types/architecture.types";
import { PAIR_SEPARATOR } from "#configuration/constants/layer.constants";
import { PRINCIPLE_TYPE } from "#configuration/constants/architecture.constants";
import { slugify } from "#core/converters/identifier.converter";

const canonId = function canonId(refs: RefMaps, idOrName: string): string {
    return refs.archIdByRef.get(slugify(idOrName)) ?? slugify(idOrName);
};

export const pairKey = function pairKey(refs: RefMaps, a: string, b: string): string {
    return [canonId(refs, a), canonId(refs, b)]
        .toSorted((left, right) => left.localeCompare(right))
        .join(PAIR_SEPARATOR);
};

const isPrinciple = function isPrinciple(refs: RefMaps, idOrName: string): boolean {
    return refs.archTypeByRef.get(slugify(idOrName)) === PRINCIPLE_TYPE;
};

export const buildRefMaps = function buildRefMaps(arch: ArchRelations): RefMaps {
    const categoryByRef = new Map<string, string>();
    const archIdByRef = new Map<string, string>();
    const archTypeByRef = new Map<string, string>();
    for (const principle of arch.all()) {
        for (const ref of [principle.id, principle.name, ...(principle.aliases ?? [])]) {
            categoryByRef.set(slugify(ref), principle.category);
            archIdByRef.set(slugify(ref), principle.id);
            archTypeByRef.set(slugify(ref), principle.type);
        }
    }
    return { archIdByRef, archTypeByRef, categoryByRef };
};

export const buildLayerByKey = function buildLayerByKey(membership: readonly LayerMembership[]): Map<string, string> {
    return new Map(membership.map((entry) => [slugify(entry.key), entry.layer]));
};

export const buildResolutionByPair = function buildResolutionByPair(
    resolutions: readonly TensionResolution[],
    refs: RefMaps,
): Map<string, TensionResolution> {
    return new Map(resolutions.map((resolution) => [pairKey(refs, resolution.a, resolution.b), resolution]));
};

export const buildLiveEdgePairs = function buildLiveEdgePairs(arch: ArchRelations, refs: RefMaps): Set<string> {
    return new Set(
        arch.all().flatMap((principle) => principle.tensions_with.map((target) => pairKey(refs, principle.id, target))),
    );
};

export const layerOf = function layerOf(state: JoinState, idOrName: string): string | null {
    const ref = slugify(idOrName);
    const direct = state.layerByKey.get(ref);
    if (typeof direct === "string") {
        return direct;
    }
    const archCategory = state.refs.categoryByRef.get(ref);
    if (typeof archCategory === "string") {
        return state.layerByKey.get(slugify(archCategory)) ?? null;
    }
    const termCategory = state.termCategoryOf(idOrName);
    return termCategory === null ? null : (state.layerByKey.get(slugify(termCategory)) ?? null);
};

const scopeSeparation = function scopeSeparation(pair: TensionPair): TensionResolution {
    const { a, b, scopeA, scopeB } = pair;
    return { a, b, mechanism: "scope-separation", rule: scopeSeparationRule(pair), scopeA, scopeB };
};

const irreducibleTradeoff = function irreducibleTradeoff(pair: TensionPair): TensionResolution {
    const { a, b, scopeA, scopeB } = pair;
    return { a, b, mechanism: "irreducible-tradeoff", rule: tradeoffRule(pair), scopeA, scopeB };
};

export const resolveTension = function resolveTension(
    state: JoinState,
    a: string,
    b: string,
): TensionResolution | null {
    const explicit = state.resolutionByPair.get(pairKey(state.refs, a, b));
    if (explicit) {
        return explicit;
    }
    const scopeA = layerOf(state, a);
    const scopeB = layerOf(state, b);
    if (scopeA === null || scopeB === null) {
        return null;
    }
    if (scopeA !== scopeB && isPrinciple(state.refs, a) && isPrinciple(state.refs, b)) {
        return scopeSeparation({ a, b, scopeA, scopeB });
    }
    return irreducibleTradeoff({ a, b, scopeA, scopeB });
};

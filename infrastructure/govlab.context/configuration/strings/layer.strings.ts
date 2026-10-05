import type { TensionPair } from "#types/layer.types";

export const edgeKindOf = function edgeKindOf(from: string, to: string): string {
    return `layers: the kind of topology edge ${from} → ${to}`;
};

export const mechanismOf = function mechanismOf(a: string, b: string): string {
    return `layers: the mechanism of tension ${a} / ${b}`;
};

export const scopeSeparationRule = function scopeSeparationRule(pair: TensionPair): string {
    return `"${pair.a}" governs the ${pair.scopeA} layer and "${pair.b}" the ${pair.scopeB} layer — two principles in different layers; apply each within its own layer instead of trading one off inside the other.`;
};

export const tradeoffRule = function tradeoffRule(pair: TensionPair): string {
    return `"${pair.a}" (${pair.scopeA} layer) is traded against "${pair.b}" (${pair.scopeB} layer) — a principle cannot be scope-separated from a quality, metric, or cost it competes with; resolve by measuring "${pair.b}" and choosing an explicit operating point.`;
};

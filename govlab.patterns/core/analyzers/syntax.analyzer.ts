import type { Distribution, TypeStat } from "#types/code.types";
import { increment } from "#core/counters/base.counter";

const TOP_TYPES = 8;
const RARE_TYPES = 6;
const UNKNOWN_TYPE = "unknown";

const IDENTIFIER_TYPES: ReadonlySet<string> = new Set([
    "identifier",
    "type_identifier",
    "shorthand_property_identifier",
    "property_identifier",
    "field_identifier",
]);

const typeStats = function typeStats(records: readonly Record<string, unknown>[]): TypeStat[] {
    const counts = new Map<string, number>();
    for (const record of records) {
        const { nodeType } = record;
        increment(counts, typeof nodeType === "string" ? nodeType : UNKNOWN_TYPE);
    }
    return [...counts.entries()].map(([type, count]) => ({ count, type })).sort((a, b) => b.count - a.count);
};

export const identifierNames = function identifierNames(records: readonly Record<string, unknown>[]): string[] {
    return records.flatMap((record) => {
        const { nodeType, text } = record;
        return typeof nodeType === "string" && IDENTIFIER_TYPES.has(nodeType) && typeof text === "string" ? [text] : [];
    });
};

export const syntaxDistribution = function syntaxDistribution(
    records: readonly Record<string, unknown>[],
): Distribution {
    const types = typeStats(records);
    return {
        invariants: types.slice(0, TOP_TYPES),
        variants: types.filter((stat) => stat.count === 1).slice(0, RARE_TYPES),
    };
};

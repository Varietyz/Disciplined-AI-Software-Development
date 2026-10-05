import type { Inline } from "#types/site.types";

export const textualize = function textualize(value: unknown, inline: Inline): unknown {
    if (typeof value === "string") {
        return inline(value);
    }
    if (Array.isArray(value)) {
        return value.map((entry: unknown) => textualize(entry, inline));
    }
    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, textualize(entry, inline)]));
    }
    return value;
};

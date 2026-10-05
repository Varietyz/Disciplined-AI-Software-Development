import { NONE_PREFIX, NONE_WORD } from "#configuration/constants/field.constants";
import { slugify } from "#core/converters/identifier.converter";

export const lacksValue = function lacksValue(value: string): boolean {
    const text = value.trim();
    if (text.length === 0 || text === NONE_WORD) {
        return true;
    }
    return text.startsWith(NONE_PREFIX) && text.slice(NONE_PREFIX.length).trim().length === 0;
};

export const lacksEntry = function lacksEntry(value: unknown): boolean {
    return (typeof value === "string" && lacksValue(value)) || (Array.isArray(value) && value.length === 0);
};

export const isKebabId = function isKebabId(id: string): boolean {
    return id.length > 0 && slugify(id) === id;
};

export const asText = function asText(value: unknown): string {
    return value !== null && typeof value === "object" ? JSON.stringify(value) : String(value);
};

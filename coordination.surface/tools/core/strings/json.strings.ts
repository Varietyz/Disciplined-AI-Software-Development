export const unreadableJson = function unreadableJson(origin: string, detail: string): string {
    return `${origin} is not readable JSON: ${detail}`;
};

export const unsatisfiedShape = function unsatisfiedShape(origin: string, shape: string): string {
    return `${origin} does not satisfy ${shape}`;
};

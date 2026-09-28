import { unreadableJson, unsatisfiedShape } from "../strings/json.strings.ts";

export const parseJson = function parseJson(text: string, origin: string): unknown {
    try {
        return JSON.parse(text);
    } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new Error(unreadableJson(origin, detail), { cause: error });
    }
};

export const tryParse = function tryParse(text: string): { readonly value: unknown } | null {
    try {
        const value: unknown = JSON.parse(text);
        return { value };
    } catch (error) {
        if (error instanceof SyntaxError) {
            return null;
        }
        throw error;
    }
};

export const fieldOf = function fieldOf(value: object, key: string): unknown {
    return Object.getOwnPropertyDescriptor(value, key)?.value;
};

export const narrow = function narrow<T>(
    value: unknown,
    guard: (candidate: unknown) => candidate is T,
    origin: string,
    shape: string,
): T {
    if (!guard(value)) {
        throw new Error(unsatisfiedShape(origin, shape));
    }
    return value;
};

export const readJson = function readJson<T>(
    text: string,
    guard: (candidate: unknown) => candidate is T,
    origin: string,
    shape: string,
): T {
    return narrow(parseJson(text, origin), guard, origin, shape);
};

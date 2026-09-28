import { accumulate, isWordCharacter } from "./token.predicate.ts";
import type { SecretShape } from "../types/secret.types.ts";

const SHAPE_SEPARATOR = ":";

const shapeOf = function shapeOf(entry: string): SecretShape[] {
    const cut = entry.lastIndexOf(SHAPE_SEPARATOR);
    const minimumLength = Number(entry.slice(cut + 1));
    return cut > 0 && Number.isFinite(minimumLength) && minimumLength > 0
        ? [{ minimumLength, prefix: entry.slice(0, cut) }]
        : [];
};

export const parseShapes = function parseShapes(declared: readonly string[]): SecretShape[] {
    return declared.flatMap(shapeOf);
};

const isTokenChar = function isTokenChar(char: string): boolean {
    return isWordCharacter(char) || char === "-";
};

export const tokensOf = function tokensOf(source: string): string[] {
    return accumulate(source, isTokenChar);
};

export const isPlaceholder = function isPlaceholder(body: string): boolean {
    const core = body.replaceAll("_", "").replaceAll("-", "");
    const first = core.codePointAt(0);
    return first !== undefined && core.replaceAll(String.fromCodePoint(first), "").length === 0;
};

const matchesShape = function matchesShape(token: string, shape: SecretShape): boolean {
    return (
        token.startsWith(shape.prefix) &&
        token.length >= shape.minimumLength &&
        !isPlaceholder(token.slice(shape.prefix.length))
    );
};

export const bearsSecret = function bearsSecret(source: string, shapes: readonly SecretShape[]): boolean {
    if (!shapes.some((shape) => source.includes(shape.prefix))) {
        return false;
    }
    return tokensOf(source).some((token) => shapes.some((shape) => matchesShape(token, shape)));
};

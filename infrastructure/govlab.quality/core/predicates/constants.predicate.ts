import { isAsciiUpper, isSnakeTail } from "#core/predicates/code-point.predicate";
import { everyChar } from "@govlab/constants";

const codeOf = function codeOf(char: string): number | undefined {
    return char.codePointAt(0);
};

export const isUpperSnake = function isUpperSnake(name: string): boolean {
    const hasUpper = !everyChar(name, (char) => !isAsciiUpper(codeOf(char)));
    return hasUpper && everyChar(name, (char) => isAsciiUpper(codeOf(char)) || isSnakeTail(codeOf(char)));
};

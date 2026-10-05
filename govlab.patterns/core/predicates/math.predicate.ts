import { MATH_TYPES } from "#configuration/constants/math.constants";

export const isMathType = function isMathType(value: string): boolean {
    return MATH_TYPES.has(value);
};

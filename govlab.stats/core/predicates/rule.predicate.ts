import { OFF_SEVERITY } from "#configuration/constants/rule.constants";

export const isOff = function isOff(value: unknown): boolean {
    const severity: unknown = Array.isArray(value) ? value.at(0) : value;
    return value === null || value === false || severity === OFF_SEVERITY || severity === 0;
};

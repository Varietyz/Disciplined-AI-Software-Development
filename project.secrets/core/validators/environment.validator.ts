import {
    BLANKS,
    DIGITS,
    ENVIRONMENT_KIND_RULES,
    SIXTEEN_BIT_CEILING,
} from "#configuration/constants/environment.constants";
import type { EnvironmentKind, EnvironmentKindRule } from "#types/environment.types";

const RULES: ReadonlyMap<EnvironmentKind, EnvironmentKindRule> = new Map(
    ENVIRONMENT_KIND_RULES.map((rule) => [rule.kind, rule]),
);

const everyCharacter = function everyCharacter(value: string, test: (character: string) => boolean): boolean {
    for (let at = 0; at < value.length; at += 1) {
        if (!test(value.charAt(at))) {
            return false;
        }
    }
    return true;
};

const isWhole = function isWhole(value: string): boolean {
    return value.length > 0 && everyCharacter(value, (character) => DIGITS.has(character));
};

const holdsBlank = function holdsBlank(value: string): boolean {
    return !everyCharacter(value, (character) => !BLANKS.has(character));
};

const fits = function fits(rule: EnvironmentKindRule, value: string): boolean {
    if (value.length === 0 || (!rule.blankAllowed && holdsBlank(value))) {
        return false;
    }
    if (rule.numeric && !(isWhole(value) && Number(value) <= SIXTEEN_BIT_CEILING)) {
        return false;
    }
    return !rule.locator || URL.canParse(value);
};

export const isValueOfKind = function isValueOfKind(kind: EnvironmentKind, value: string): boolean {
    const rule = RULES.get(kind);
    return rule !== undefined && fits(rule, value);
};

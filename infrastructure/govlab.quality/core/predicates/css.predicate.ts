import type { CssNode } from "#types/css.types";
import { valueUnits } from "#core/parsers/css.parser";

export const hasPxUnit = function hasPxUnit(value: string): boolean {
    return valueUnits(value).some((token) => token.unit === "px");
};

export const customPropertyStartsWith = function customPropertyStartsWith(
    name: string,
    prefix: string,
    excludes: readonly string[] = [],
): boolean {
    return name.startsWith(prefix) && !excludes.some((exclude) => name.includes(exclude));
};

const atRuleAncestor = function atRuleAncestor(node: CssNode, names: Set<string>): boolean {
    const { parent } = node;
    if (!parent) {
        return false;
    }
    if (parent.type === "atrule" && names.has(parent.name ?? "")) {
        return true;
    }
    return atRuleAncestor(parent, names);
};

export const insideAtRule = function insideAtRule(node: CssNode | undefined, names: Set<string>): boolean {
    return node ? atRuleAncestor(node, names) : false;
};

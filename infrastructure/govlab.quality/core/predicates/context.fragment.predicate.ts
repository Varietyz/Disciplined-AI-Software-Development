import type { AstNode } from "#types/context.types";
import { FRAGMENT_FACTORY } from "#configuration/constants/context.constants";
import type { Rule } from "eslint";

export const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

export const isNode = function isNode(value: unknown): value is AstNode {
    return isRecord(value) && typeof value["type"] === "string";
};

export const isArray = function isArray(value: unknown): value is readonly unknown[] {
    return Array.isArray(value);
};

export const isRuleNode = function isRuleNode(value: unknown): value is Rule.Node {
    return isNode(value);
};

export const isDefineFragmentCall = function isDefineFragmentCall(node: unknown): boolean {
    if (!isRecord(node) || node["type"] !== "CallExpression") {
        return false;
    }
    const { callee } = node;
    return isRecord(callee) && callee["type"] === "Identifier" && callee["name"] === FRAGMENT_FACTORY;
};

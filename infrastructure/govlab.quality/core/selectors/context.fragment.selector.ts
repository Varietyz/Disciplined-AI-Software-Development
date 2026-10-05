import { isArray, isNode, isRecord } from "#core/predicates/context.fragment.predicate";
import type { AstNode } from "#types/context.types";

export const identifierName = function identifierName(node: unknown): string | null {
    return isNode(node) && node.type === "Identifier" && typeof node["name"] === "string" ? node["name"] : null;
};

export const fragmentObject = function fragmentObject(node: unknown): AstNode | null {
    if (!isRecord(node)) {
        return null;
    }
    const args = node["arguments"];
    const first = isArray(args) ? args[0] : null;
    return isNode(first) && first.type === "ObjectExpression" ? first : null;
};

const keyName = function keyName(candidate: unknown): string | null {
    if (!isRecord(candidate)) {
        return null;
    }
    const { key } = candidate;
    if (!isRecord(key)) {
        return null;
    }
    if (typeof key["name"] === "string") {
        return key["name"];
    }
    return typeof key["value"] === "string" ? key["value"] : null;
};

export const propertyNames = function propertyNames(object: AstNode): Set<string> {
    const names = new Set<string>();
    const { properties } = object;
    if (Array.isArray(properties)) {
        for (const prop of properties) {
            const name = keyName(prop);
            if (name !== null) {
                names.add(name);
            }
        }
    }
    return names;
};

export const property = function property(object: AstNode, name: string): AstNode | null {
    const { properties } = object;
    if (Array.isArray(properties)) {
        for (const prop of properties) {
            if (keyName(prop) === name && isRecord(prop)) {
                const { value } = prop;
                return isNode(value) ? value : null;
            }
        }
    }
    return null;
};

export const stringValue = function stringValue(node: unknown): string | null {
    if (isNode(node) && node.type === "Literal" && typeof node["value"] === "string") {
        return node["value"];
    }
    return null;
};

export const stringArrayValues = function stringArrayValues(node: unknown): string[] {
    const out: string[] = [];
    if (isNode(node) && node.type === "ArrayExpression" && Array.isArray(node["elements"])) {
        for (const element of node["elements"]) {
            const value = stringValue(element);
            if (value !== null) {
                out.push(value);
            }
        }
    }
    return out;
};

import type { RuleFileShape, RuleObjectShape } from "../../types/rule.types.ts";
import {
    argumentAt,
    calleeName,
    literalString,
    nameOf,
    nodeAt,
    nodesAt,
    recordAt,
    stringIn,
    walk,
} from "../selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";

const GUARD_IMPORTS = new Set(["isGovernedFile"]);
const ANY_KEYWORD = "TSAnyKeyword";
const REPORT_METHOD = "report";

export const textOf = function textOf(node: AstNode | null): string {
    if (node === null) {
        return "";
    }
    return node.type === "Identifier" ? nameOf(node) : (literalString(node) ?? "");
};

const keyNameOf = function keyNameOf(property: AstNode): string {
    return textOf(nodeAt(property, "key"));
};

export const propertiesOf = function propertiesOf(node: AstNode | null): AstNode[] {
    return nodesAt(node, "properties").filter((property) => property.type === "Property");
};

export const propertyNamed = function propertyNamed(node: AstNode | null, name: string): AstNode | null {
    return propertiesOf(node).find((property) => keyNameOf(property) === name) ?? null;
};

export const isNonEmptyString = function isNonEmptyString(node: AstNode | null): boolean {
    if (node === null) {
        return false;
    }
    if (node.type === "Literal") {
        return (literalString(node) ?? "").trim().length > 0;
    }
    if (node.type === "TemplateLiteral") {
        return nodesAt(node, "quasis").some((quasi) => stringIn(recordAt(quasi, "value"), "cooked").trim().length > 0);
    }
    if (node.type === "BinaryExpression") {
        return isNonEmptyString(nodeAt(node, "left")) || isNonEmptyString(nodeAt(node, "right"));
    }
    return false;
};

export const collectRuleFile = function collectRuleFile(program: AstNode): RuleFileShape {
    const anyNodes: AstNode[] = [];
    const guards: AstNode[] = [];
    const ruleObjects: AstNode[] = [];
    walk(program, (node) => {
        if (node.type === ANY_KEYWORD) {
            anyNodes.push(node);
            return;
        }
        if (node.type === "ImportSpecifier" && GUARD_IMPORTS.has(textOf(nodeAt(node, "imported")))) {
            guards.push(node);
            return;
        }
        if (node.type !== "ObjectExpression") {
            return;
        }
        const names = new Set(propertiesOf(node).map(keyNameOf));
        if (names.has("create") && names.has("meta")) {
            ruleObjects.push(node);
        }
    });
    return { anyNodes, guards, ruleObjects };
};

export const collectRuleObject = function collectRuleObject(ruleObject: AstNode): RuleObjectShape {
    const metaProperty = propertyNamed(ruleObject, "meta");
    return { meta: nodeAt(metaProperty, "value"), metaProperty };
};

export const reportedIds = function reportedIds(program: AstNode): Set<string> {
    const ids = new Set<string>();
    walk(program, (node) => {
        if (node.type !== "CallExpression" || calleeName(node) !== REPORT_METHOD) {
            return;
        }
        const messageId = propertyNamed(argumentAt(node, 0), "messageId");
        const value = messageId === null ? null : literalString(nodeAt(messageId, "value"));
        if (value !== null && value !== "") {
            ids.add(value);
        }
    });
    return ids;
};

export const declaredIds = function declaredIds(ruleObjects: readonly AstNode[]): Set<string> {
    const ids = new Set<string>();
    for (const ruleObject of ruleObjects) {
        const meta = nodeAt(propertyNamed(ruleObject, "meta"), "value");
        const messages = meta === null ? null : propertyNamed(meta, "messages");
        for (const name of propertiesOf(nodeAt(messages, "value")).map(keyNameOf)) {
            ids.add(name);
        }
    }
    return ids;
};

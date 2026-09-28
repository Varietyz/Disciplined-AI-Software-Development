import type { AstNode, CopyOf } from "../../types/syntax.types.ts";
import {
    asNode,
    isType,
    literalString,
    nameOf,
    nodeAt,
    nodesAt,
    propertyKeyName,
    recordAt,
    staticTextOf,
    stringAt,
    stringIn,
    walk,
} from "./syntax.selector.ts";
import type { Scope } from "eslint";

const LETTERS: ReadonlySet<string> = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
const MIN_WORD_LETTERS = 3;
const HOLE = "…";

const hasWord = function hasWord(text: string): boolean {
    let run = 0;
    for (const char of text) {
        run = LETTERS.has(char) ? run + 1 : 0;
        if (run >= MIN_WORD_LETTERS) {
            return true;
        }
    }
    return false;
};

const templatePartsOf = function templatePartsOf(node: AstNode | null): readonly string[] {
    return nodesAt(node, "quasis").map((part) => stringIn(recordAt(part, "value"), "cooked"));
};

export const templateShapeOf = function templateShapeOf(node: AstNode | null): string | null {
    return isType(node, "TemplateLiteral") ? templatePartsOf(node).join(HOLE) : null;
};

const wordedTemplateOf = function wordedTemplateOf(node: AstNode | null): string | null {
    if (!isType(node, "TemplateLiteral") || nodesAt(node, "expressions").length === 0) {
        return null;
    }
    const parts = templatePartsOf(node);
    return parts.some(hasWord) ? parts.join(HOLE) : null;
};

const CONCAT_OPERATOR = "+";

const concatPartsOf = function concatPartsOf(node: AstNode | null): readonly string[] | null {
    if (!isType(node, "BinaryExpression") || stringAt(node, "operator") !== CONCAT_OPERATOR) {
        return null;
    }
    const side = (part: AstNode | null): readonly string[] =>
        concatPartsOf(part) ?? (isType(part, "TemplateLiteral") ? templatePartsOf(part) : [literalString(part) ?? ""]);
    return [...side(nodeAt(node, "left")), ...side(nodeAt(node, "right"))];
};

const wordedConcatOf = function wordedConcatOf(node: AstNode | null): string | null {
    const parts = concatPartsOf(node);
    if (parts === null) {
        return null;
    }
    return parts.some(hasWord) ? parts.join(HOLE) : null;
};

export const copyTextOf = function copyTextOf(node: AstNode | null): string | null {
    return staticTextOf(node) ?? wordedTemplateOf(node) ?? wordedConcatOf(node);
};

export const boundInitOf = function boundInitOf(scope: Scope.Scope | null, name: string): AstNode | null {
    for (let cursor = scope; cursor !== null; cursor = cursor.upper) {
        const variable = cursor.set.get(name);
        if (variable !== undefined) {
            const [definition] = variable.defs;
            return definition === undefined ? null : nodeAt(asNode(definition.node), "init");
        }
    }
    return null;
};

const isCopy = function isCopy(node: AstNode | null): boolean {
    const text = copyTextOf(node);
    return text !== null && text.length > 0;
};

export const boundCopyOf = function boundCopyOf(scope: Scope.Scope): CopyOf {
    return (node) => {
        if (isCopy(node)) {
            return node;
        }
        const bound = isType(node, "Identifier") ? boundInitOf(scope, nameOf(node)) : null;
        return isCopy(bound) ? bound : null;
    };
};

export const CODE_SLOTS: ReadonlySet<string> = new Set(["code", "grammar"]);
export const DIAGRAM_KINDS: ReadonlySet<string> = new Set(["diagram", "mermaid"]);
export const CODE_KINDS: ReadonlySet<string> = new Set(["code", ...DIAGRAM_KINDS]);
const KIND_SLOT = "kind";
const TEXT_SLOT = "text";
const TEXT_NODE_TYPES: ReadonlySet<string> = new Set(["Literal", "TemplateLiteral"]);

const isTextNode = function isTextNode(node: AstNode | null): node is AstNode {
    return node !== null && TEXT_NODE_TYPES.has(node.type);
};

const propertyOf = function propertyOf(objectExpr: AstNode, key: string): AstNode | null {
    const found = nodesAt(objectExpr, "properties").find(
        (prop) => isType(prop, "Property") && propertyKeyName(prop) === key,
    );
    return found === undefined ? null : nodeAt(found, "value");
};

const kindedTextValue = function kindedTextValue(node: AstNode, kinds: ReadonlySet<string>): AstNode | null {
    if (!isType(node, "ObjectExpression")) {
        return null;
    }
    const kind = literalString(propertyOf(node, KIND_SLOT));
    return kind !== null && kinds.has(kind) ? propertyOf(node, TEXT_SLOT) : null;
};

const codeSlotValue = function codeSlotValue(node: AstNode): AstNode | null {
    if (isType(node, "Property") && CODE_SLOTS.has(propertyKeyName(node))) {
        return nodeAt(node, "value");
    }
    return kindedTextValue(node, CODE_KINDS);
};

const diagramSlotValue = function diagramSlotValue(node: AstNode): AstNode | null {
    return kindedTextValue(node, DIAGRAM_KINDS);
};

const literalsOf = function literalsOf(
    program: AstNode,
    slotValue: (node: AstNode) => AstNode | null,
): ReadonlySet<AstNode> {
    const inline: AstNode[] = [];
    const names: string[] = [];
    walk(program, (node) => {
        const value = slotValue(node);
        if (isTextNode(value)) {
            inline.push(value);
        }
        if (isType(value, "Identifier")) {
            names.push(nameOf(value));
        }
    });
    const named = new Set(names);
    const declared: AstNode[] = [];
    walk(program, (node) => {
        const init = nodeAt(node, "init");
        if (isType(node, "VariableDeclarator") && named.has(nameOf(nodeAt(node, "id"))) && isTextNode(init)) {
            declared.push(init);
        }
    });
    return new Set([...inline, ...declared]);
};

export const codeLiteralsOf = function codeLiteralsOf(program: AstNode): ReadonlySet<AstNode> {
    return literalsOf(program, codeSlotValue);
};

export const diagramLiteralsOf = function diagramLiteralsOf(program: AstNode): ReadonlySet<AstNode> {
    return literalsOf(program, diagramSlotValue);
};

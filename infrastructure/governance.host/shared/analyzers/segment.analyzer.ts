import {
    calleeName,
    handlerKey,
    isType,
    literalString,
    nameOf,
    nodeAt,
    nodesAt,
    stringAt,
} from "../selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import type { SegmentTable } from "../../types/location.types.ts";
import { cookedOf } from "./location.analyzer.ts";
import { tokenIn } from "../registries/location.registry.ts";

const BUILDERS = new Set(["join", "resolve"]);

type Folder = (node: AstNode, consts: SegmentTable) => string[] | null;

const foldParts = function foldParts(nodes: readonly AstNode[], consts: SegmentTable): string[] | null {
    const parts: string[] = [];
    for (const node of nodes) {
        const folded = foldSegments(node, consts);
        if (folded === null) {
            return null;
        }
        parts.push(...folded);
    }
    return parts;
};

const arrayJoinObject = function arrayJoinObject(node: AstNode): AstNode | null {
    const callee = nodeAt(node, "callee");
    if (!isType(callee, "MemberExpression") || nameOf(nodeAt(callee, "property")) !== "join") {
        return null;
    }
    return nodeAt(callee, "object");
};

const foldTemplate: Folder = function foldTemplate(node, consts) {
    const holes: string[] = [];
    for (const expression of nodesAt(node, "expressions")) {
        const folded = foldSegments(expression, consts);
        if (folded === null) {
            return null;
        }
        holes.push(folded.join("/"));
    }
    return [
        nodesAt(node, "quasis")
            .map((quasi, index) => cookedOf(quasi) + (holes[index] ?? ""))
            .join(""),
    ];
};

const foldConcat: Folder = function foldConcat(node, consts) {
    if (stringAt(node, "operator") !== "+") {
        return null;
    }
    const left = foldSegments(nodeAt(node, "left"), consts);
    const right = foldSegments(nodeAt(node, "right"), consts);
    return left === null || right === null ? null : [left.join("/") + right.join("/")];
};

const foldCall: Folder = function foldCall(node, consts) {
    if (BUILDERS.has(calleeName(node))) {
        return foldParts(nodesAt(node, "arguments"), consts);
    }
    return foldSegments(arrayJoinObject(node), consts);
};

const foldLiteral: Folder = function foldLiteral(node) {
    const literal = literalString(node);
    return literal === null ? null : [literal];
};

const FOLDERS: Record<string, Folder> = {
    arrayExpression: (node, consts) => foldParts(nodesAt(node, "elements"), consts),
    binaryExpression: foldConcat,
    callExpression: foldCall,
    identifier: (node, consts) => consts.get(nameOf(node)) ?? null,
    literal: foldLiteral,
    spreadElement: (node, consts) => foldSegments(nodeAt(node, "argument"), consts),
    templateLiteral: foldTemplate,
};

export const foldSegments = function foldSegments(node: AstNode | null, consts: SegmentTable): string[] | null {
    if (node === null) {
        return null;
    }
    const fold = FOLDERS[handlerKey(node.type)];
    return fold === undefined ? null : fold(node, consts);
};

export const composedTokenOf = function composedTokenOf(node: AstNode, consts: SegmentTable): string | null {
    if (node.type !== "CallExpression") {
        return null;
    }
    const joinObject = arrayJoinObject(node);
    const isBuilder = BUILDERS.has(calleeName(node));
    if (!isBuilder && joinObject === null) {
        return null;
    }
    const segments =
        joinObject === null ? foldParts(nodesAt(node, "arguments"), consts) : foldSegments(joinObject, consts);
    if (segments === null || segments.length < 2) {
        return null;
    }
    return tokenIn(segments.filter((part) => part.length > 0).join("/"));
};

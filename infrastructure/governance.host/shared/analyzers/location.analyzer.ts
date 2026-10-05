import {
    calleeName,
    isType,
    literalString,
    nameOf,
    nodeAt,
    nodesAt,
    recordAt,
    stringIn,
} from "../selectors/syntax.selector.ts";
import { keyForLocation, locationForKey } from "../registries/location.registry.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import type { ComposedKey } from "../../types/location.types.ts";
import { existsSync } from "node:fs";
import { normalizePath } from "../resolvers/anchor.resolver.ts";

const PATH_CALLEES = new Set([
    "join",
    "resolve",
    "relative",
    "readFileSync",
    "writeFileSync",
    "existsSync",
    "readdirSync",
    "statSync",
    "mkdirSync",
    "rmSync",
    "unlinkSync",
    "readFile",
    "writeFile",
    "readdir",
    "stat",
    "mkdir",
]);

const CJS_ANCHORS = new Set(["__dirname", "__filename"]);
const BUILDERS = new Set(["join", "resolve"]);

export const cookedOf = function cookedOf(node: AstNode | null): string {
    return stringIn(recordAt(node, "value"), "cooked");
};

const trimSlashes = function trimSlashes(value: string): string {
    let start = 0;
    let end = value.length;
    while (start < end && value[start] === "/") {
        start += 1;
    }
    while (end > start && value[end - 1] === "/") {
        end -= 1;
    }
    return value.slice(start, end);
};

export const composedKeyOf = function composedKeyOf(node: AstNode, ssotNames: ReadonlySet<string>): ComposedKey | null {
    const parent = nodeAt(node, "parent");
    if (!isType(parent, "TemplateLiteral")) {
        return null;
    }
    const [anchor] = nodesAt(parent, "expressions");
    if (anchor?.type !== "CallExpression" || !ssotNames.has(calleeName(anchor))) {
        return null;
    }
    const keyValue = literalString(nodesAt(anchor, "arguments")[0] ?? null);
    if (keyValue === null) {
        return null;
    }
    const tail = trimSlashes(cookedOf(node));
    if (tail.length === 0 || tail.includes("$")) {
        return null;
    }
    const anchorLocation = locationForKey(keyValue);
    if (anchorLocation === null) {
        return null;
    }
    const key = keyForLocation(`${anchorLocation}/${tail}`);
    return key === null ? null : { key, tail };
};

export const holdsMeta = function holdsMeta(node: AstNode | null): boolean {
    if (node === null) {
        return false;
    }
    if (node.type === "MetaProperty") {
        return true;
    }
    if (node.type === "Identifier" && CJS_ANCHORS.has(nameOf(node))) {
        return true;
    }
    if (node.type === "MemberExpression") {
        return holdsMeta(nodeAt(node, "object"));
    }
    if (node.type === "CallExpression") {
        return nodesAt(node, "arguments").some((arg) => holdsMeta(arg));
    }
    return false;
};

const climbCountOf = function climbCountOf(value: string): number {
    let count = 0;
    for (const segment of normalizePath(value).split("/")) {
        if (segment === "..") {
            count += 1;
        }
    }
    return count;
};

export const depthBelowPackage = function depthBelowPackage(filename: string): number {
    const posix = normalizePath(filename);
    const segments = posix.split("/");
    for (let cut = segments.length - 1; cut > 0; cut -= 1) {
        const dir = segments.slice(0, cut).join("/");
        if (existsSync(`${dir}/package.json`)) {
            return segments.length - 1 - cut;
        }
    }
    return 0;
};

export const isFileDir = function isFileDir(node: AstNode | null, dirNames: ReadonlySet<string>): boolean {
    if (node === null) {
        return false;
    }
    if (node.type === "Identifier") {
        const name = nameOf(node);
        return CJS_ANCHORS.has(name) || dirNames.has(name);
    }
    if (node.type === "MemberExpression") {
        return isType(nodeAt(node, "object"), "MetaProperty") && nameOf(nodeAt(node, "property")) === "dirname";
    }
    if (node.type === "CallExpression" && calleeName(node) === "dirname") {
        return nodesAt(node, "arguments").some((arg) => holdsMeta(arg));
    }
    return false;
};

export const staticTargetOf = function staticTargetOf(
    node: AstNode,
    dirNames: ReadonlySet<string>,
    fromDir: string,
): string | null {
    if (node.type !== "CallExpression" || !BUILDERS.has(calleeName(node))) {
        return null;
    }
    const segments: string[] = [];
    let sawFileDir = false;
    for (const arg of nodesAt(node, "arguments")) {
        if (isFileDir(arg, dirNames)) {
            sawFileDir = true;
            continue;
        }
        const literal = literalString(arg);
        if (literal === null) {
            return null;
        }
        segments.push(literal);
    }
    if (!sawFileDir || segments.length === 0) {
        return null;
    }
    return normalizePath([fromDir, ...segments].join("/"));
};

export const boundNameOf = function boundNameOf(node: AstNode): string | null {
    const parent = nodeAt(node, "parent");
    if (!isType(parent, "VariableDeclarator")) {
        return null;
    }
    const id = nodeAt(parent, "id");
    return isType(id, "Identifier") ? nameOf(id) : null;
};

export const isMetaClimb = function isMetaClimb(node: AstNode, metaNames: ReadonlySet<string>, depth: number): boolean {
    if (node.type !== "CallExpression" || !PATH_CALLEES.has(calleeName(node))) {
        return false;
    }
    let sawMeta = false;
    let climbs = 0;
    for (const arg of nodesAt(node, "arguments")) {
        if (holdsMeta(arg) || (arg.type === "Identifier" && metaNames.has(nameOf(arg)))) {
            sawMeta = true;
        }
        const literal = literalString(arg);
        if (literal !== null) {
            climbs += climbCountOf(literal);
        }
    }
    return sawMeta && climbs > depth;
};

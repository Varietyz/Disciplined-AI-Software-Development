import { GENERATED_MARKER, MARKER_EXEMPT_BASENAMES, PRETTIER_EXTENSIONS } from "../manifests/generator.manifest.ts";
import type { InitResolver, WriteNode } from "../../types/generator.types.ts";
import { calledName, identName } from "./sink.analyzer.ts";

const EPHEMERAL_ROOT_FNS = new Set(["tmpdir", "mkdtemp", "mkdtempSync"]);
const CLIMB_LIMIT = 16;

const literalChildren = function literalChildren(node: WriteNode): (WriteNode | undefined)[] {
    return [
        node.callee,
        node.object,
        node.property,
        node.left,
        node.right,
        node.argument,
        ...(node.arguments ?? []),
        ...(node.elements ?? []),
        ...(node.expressions ?? []),
    ];
};

const ownLiterals = function ownLiterals(node: WriteNode): string[] {
    const literal = node.type === "Literal" && typeof node.value === "string" ? [node.value] : [];
    const quasis = (node.quasis ?? []).flatMap((quasi) =>
        typeof quasi.value?.cooked === "string" ? [quasi.value.cooked] : [],
    );
    return [...literal, ...quasis];
};

export const collectLiterals = function collectLiterals(node: WriteNode | undefined, depth: number): string[] {
    if (!node || depth > CLIMB_LIMIT) {
        return [];
    }
    return [...ownLiterals(node), ...literalChildren(node).flatMap((child) => collectLiterals(child, depth + 1))];
};

export const rootsAtEphemeralDir = function rootsAtEphemeralDir(
    resolve: InitResolver,
    node: WriteNode | undefined,
    depth: number,
): boolean {
    if (!node || depth > CLIMB_LIMIT) {
        return false;
    }
    if (node.type === "CallExpression" && EPHEMERAL_ROOT_FNS.has(calledName(node) ?? "")) {
        return true;
    }
    if (node.type === "Identifier") {
        const init = resolve(identName(node) ?? "");
        return init !== null && rootsAtEphemeralDir(resolve, init, depth + 1);
    }
    return literalChildren(node).some((child) => rootsAtEphemeralDir(resolve, child, depth + 1));
};

const extensionOf = function extensionOf(text: string): string | null {
    const dot = text.lastIndexOf(".");
    return dot === -1 ? null : text.slice(dot + 1).toLowerCase();
};

const prettierExtLiterals = function prettierExtLiterals(strings: string[]): string[] {
    return strings.filter((text) => {
        const ext = extensionOf(text);
        return ext !== null && PRETTIER_EXTENSIONS.has(ext);
    });
};

const targetLiterals = function targetLiterals(resolve: InitResolver, target: WriteNode): string[] {
    const own = collectLiterals(target, 0);
    const name = identName(target);
    const init = name === null ? null : resolve(name);
    return init === null ? own : [...own, ...collectLiterals(init, 0)];
};

const basenameOf = function basenameOf(text: string): string {
    const slash = Math.max(text.lastIndexOf("/"), text.lastIndexOf("\\"));
    return slash === -1 ? text : text.slice(slash + 1);
};

export const targetIsUnmarkedGenerated = function targetIsUnmarkedGenerated(
    resolve: InitResolver,
    target: WriteNode,
): boolean {
    const named = prettierExtLiterals(targetLiterals(resolve, target));
    if (named.length === 0) {
        return false;
    }
    return named.every((text) => {
        const base = basenameOf(text).toLowerCase();
        return !base.includes(GENERATED_MARKER) && !MARKER_EXEMPT_BASENAMES.has(base);
    });
};

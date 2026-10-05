import type { WriteNode } from "../../types/generator.types.ts";

const WRITE_METHODS = new Set(["write", "writeFile", "writeFileSync", "writeSync"]);
const FILE_WRITE_FNS = new Set(["writeFile", "writeFileSync"]);
const UTF8 = "utf8";

const encodingOf = function encodingOf(value: string): string {
    return value.toLowerCase().split("-").join("");
};

export const identName = function identName(node: WriteNode | undefined): string | null {
    return node?.type === "Identifier" && typeof node.name === "string" ? node.name : null;
};

export const calledName = function calledName(node: WriteNode): string | null {
    const { callee } = node;
    if (callee?.type === "Identifier") {
        return identName(callee);
    }
    return callee?.type === "MemberExpression" ? identName(callee.property) : null;
};

export const isJsonStringify = function isJsonStringify(call: WriteNode): boolean {
    const { callee } = call;
    return (
        callee?.type === "MemberExpression" &&
        identName(callee.object) === "JSON" &&
        identName(callee.property) === "stringify"
    );
};

const stringValue = function stringValue(node: WriteNode | undefined): string | null {
    return node?.type === "Literal" && typeof node.value === "string" ? node.value : null;
};

export const parentWriteMissingUtf8 = function parentWriteMissingUtf8(call: WriteNode): boolean {
    const { parent } = call;
    if (parent?.type !== "CallExpression" || parent.callee?.type !== "MemberExpression") {
        return false;
    }
    if (!WRITE_METHODS.has(identName(parent.callee.property) ?? "")) {
        return false;
    }
    return !(parent.arguments ?? []).some((arg) => encodingOf(stringValue(arg) ?? "") === UTF8);
};

export const isFileWriteCall = function isFileWriteCall(node: WriteNode | undefined): boolean {
    return node?.type === "CallExpression" && FILE_WRITE_FNS.has(calledName(node) ?? "");
};

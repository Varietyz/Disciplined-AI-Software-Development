import type { AstNode, CopyOf } from "../../types/syntax.types.ts";
import type { CopyHit, SinkArgument } from "../../types/sink.types.ts";
import { argumentAt, calleeName, isType, literalString, nameOf, nodeAt } from "./syntax.selector.ts";

const ERROR_CONSTRUCTOR_SUFFIX = "Error";
const PROCESS_OBJECT = "process";
const CONSOLE_OBJECT = "console";
const WRITE_METHOD = "write";
const SET_ATTRIBUTE = "setAttribute";
const ASSIGN_OPERATOR = "=";
const STREAMS: ReadonlySet<string> = new Set(["stdout", "stderr"]);
const CONSOLE_METHODS: ReadonlySet<string> = new Set(["debug", "error", "info", "log", "warn"]);
const RENDERABLE_TEXT_PROPERTIES: ReadonlySet<string> = new Set(["textContent"]);
const RENDERABLE_ATTRIBUTES: ReadonlySet<string> = new Set(["aria-label", "title", "placeholder"]);

export const errorMessageSink = function errorMessageSink(node: AstNode): SinkArgument | null {
    const callee = nodeAt(node, "callee");
    if (!isType(callee, "Identifier") || !nameOf(callee).endsWith(ERROR_CONSTRUCTOR_SUFFIX)) {
        return null;
    }
    return { argument: argumentAt(node, 0), sink: nameOf(callee) };
};

const streamWrite = function streamWrite(callee: AstNode | null): string | null {
    const stream = nodeAt(callee, "object");
    const owner = nodeAt(stream, "object");
    const name = nameOf(nodeAt(stream, "property"));
    const isWrite = nameOf(nodeAt(callee, "property")) === WRITE_METHOD && STREAMS.has(name);
    return isWrite && isType(owner, "Identifier") && nameOf(owner) === PROCESS_OBJECT ? name : null;
};

const consoleCall = function consoleCall(callee: AstNode | null): string | null {
    const owner = nodeAt(callee, "object");
    const method = nameOf(nodeAt(callee, "property"));
    return isType(owner, "Identifier") && nameOf(owner) === CONSOLE_OBJECT && CONSOLE_METHODS.has(method)
        ? method
        : null;
};

export const terminalSink = function terminalSink(node: AstNode): SinkArgument | null {
    const callee = nodeAt(node, "callee");
    if (!isType(callee, "MemberExpression")) {
        return null;
    }
    const sink = streamWrite(callee) ?? consoleCall(callee);
    return sink === null ? null : { argument: argumentAt(node, 0), sink };
};

export const sinkLiteral = function sinkLiteral(found: SinkArgument | null, copyOf: CopyOf): CopyHit | null {
    const message = found === null ? null : copyOf(found.argument);
    return found === null || message === null ? null : { keyName: found.sink, value: message };
};

export const renderableTextAssignment = function renderableTextAssignment(
    node: AstNode,
    copyOf: CopyOf,
): CopyHit | null {
    if (node.type !== "AssignmentExpression" || node["operator"] !== ASSIGN_OPERATOR) {
        return null;
    }
    const property = nodeAt(nodeAt(node, "left"), "property");
    if (!isType(property, "Identifier") || !RENDERABLE_TEXT_PROPERTIES.has(nameOf(property))) {
        return null;
    }
    const right = copyOf(nodeAt(node, "right"));
    return right === null ? null : { keyName: nameOf(property), value: right };
};

export const setAttributeLiteral = function setAttributeLiteral(node: AstNode, copyOf: CopyOf): CopyHit | null {
    if (node.type !== "CallExpression" || calleeName(node) !== SET_ATTRIBUTE) {
        return null;
    }
    const attr = literalString(argumentAt(node, 0));
    if (attr === null || !RENDERABLE_ATTRIBUTES.has(attr)) {
        return null;
    }
    const target = copyOf(argumentAt(node, 1));
    return target === null ? null : { keyName: attr, value: target };
};

import { lineOf, relPath } from "../selectors/program.selector.ts";
import type { CodePointFinding } from "../../types/analyzer.types.ts";
import ts from "typescript";

const SOURCE_METHOD = "charCodeAt";
const TARGET_METHOD = "codePointAt";
const STRING_TYPE = "string";

const UNTYPED = new Set(["any", "unknown", "error"]);

const typeNameOf = function typeNameOf(checker: ts.TypeChecker, node: ts.Expression): string {
    const type = checker.getTypeAtLocation(node);
    return type.isStringLiteral() ? STRING_TYPE : checker.typeToString(type);
};

const accessOf = function accessOf(call: ts.CallExpression): ts.PropertyAccessExpression | null {
    const { expression } = call;
    if (!ts.isPropertyAccessExpression(expression)) {
        return null;
    }
    return expression.name.text === SOURCE_METHOD ? expression : null;
};

const receiverReason = function receiverReason(
    checker: ts.TypeChecker,
    access: ts.PropertyAccessExpression,
): string | null {
    const typeName = typeNameOf(checker, access.expression);
    if (typeName === STRING_TYPE) {
        return null;
    }
    if (UNTYPED.has(typeName)) {
        return `receiver is typed '${typeName}' — type it as a string before converting`;
    }
    return `receiver is '${typeName}', so '${SOURCE_METHOD}' here is not the String method`;
};

const shapeReason = function shapeReason(call: ts.CallExpression, access: ts.PropertyAccessExpression): string | null {
    if (call.arguments.length !== 1) {
        return `expected exactly one index argument, found ${String(call.arguments.length)}`;
    }
    if (call.questionDotToken ?? access.questionDotToken) {
        return "optional call — the receiver may be nullish";
    }
    return null;
};

const findingFor = function findingFor(
    checker: ts.TypeChecker,
    sourceFile: ts.SourceFile,
    call: ts.CallExpression,
): CodePointFinding | null {
    const access = accessOf(call);
    if (!access) {
        return null;
    }
    const [indexArg] = call.arguments;
    return {
        args: indexArg ? indexArg.getText(sourceFile) : "",
        end: call.getEnd(),
        file: relPath(sourceFile.fileName),
        fileName: sourceFile.fileName,
        line: lineOf(sourceFile, call),
        reason: shapeReason(call, access) ?? receiverReason(checker, access),
        receiver: access.expression.getText(sourceFile),
        start: call.getStart(sourceFile),
    };
};

export const replacementText = function replacementText(finding: CodePointFinding): string {
    return `(${finding.receiver}.${TARGET_METHOD}(${finding.args}) ?? 0)`;
};

export const scanSourceFile = function scanSourceFile(
    checker: ts.TypeChecker,
    sourceFile: ts.SourceFile,
): CodePointFinding[] {
    const out: CodePointFinding[] = [];
    const visit = function visit(node: ts.Node): void {
        if (ts.isCallExpression(node)) {
            const finding = findingFor(checker, sourceFile, node);
            if (finding) {
                out.push(finding);
            }
        }
        ts.forEachChild(node, visit);
    };
    ts.forEachChild(sourceFile, visit);
    return out;
};

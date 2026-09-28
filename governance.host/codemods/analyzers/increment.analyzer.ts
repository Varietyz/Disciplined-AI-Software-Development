import { lineOf, relPath } from "../selectors/program.selector.ts";
import type { IncrementFinding } from "../../types/analyzer.types.ts";
import ts from "typescript";

const STEP = "1";

const OPERATORS: ReadonlyMap<ts.SyntaxKind, string> = new Map([
    [ts.SyntaxKind.PlusPlusToken, "+="],
    [ts.SyntaxKind.MinusMinusToken, "-="],
]);

type UpdateExpression = ts.PostfixUnaryExpression | ts.PrefixUnaryExpression;

const isUpdateExpression = function isUpdateExpression(node: ts.Node): node is UpdateExpression {
    if (!ts.isPostfixUnaryExpression(node) && !ts.isPrefixUnaryExpression(node)) {
        return false;
    }
    return OPERATORS.has(node.operator);
};

const discardsValue = function discardsValue(node: UpdateExpression, parent: ts.Node | null): boolean {
    if (!parent) {
        return false;
    }
    if (ts.isExpressionStatement(parent)) {
        return true;
    }
    return ts.isForStatement(parent) && parent.incrementor === node;
};

const positionReason = function positionReason(node: UpdateExpression, parent: ts.Node | null): string | null {
    if (discardsValue(node, parent)) {
        return null;
    }
    return "the increment's value is read, so '+= 1' would change what the expression evaluates to";
};

const operandReason = function operandReason(operand: ts.Expression): string | null {
    if (ts.isIdentifier(operand) || ts.isPropertyAccessExpression(operand)) {
        return null;
    }
    if (ts.isElementAccessExpression(operand)) {
        return "operand is an element access — rewriting would evaluate the index expression twice";
    }
    return "operand is not a simple reference";
};

const findingFor = function findingFor(
    sourceFile: ts.SourceFile,
    node: UpdateExpression,
    parent: ts.Node | null,
): IncrementFinding {
    return {
        end: node.getEnd(),
        file: relPath(sourceFile.fileName),
        fileName: sourceFile.fileName,
        line: lineOf(sourceFile, node),
        operand: node.operand.getText(sourceFile),
        operator: OPERATORS.get(node.operator) ?? "+=",
        reason: positionReason(node, parent) ?? operandReason(node.operand),
        start: node.getStart(sourceFile),
    };
};

export const replacementText = function replacementText(finding: IncrementFinding): string {
    return `${finding.operand} ${finding.operator} ${STEP}`;
};

export const scanSourceFile = function scanSourceFile(sourceFile: ts.SourceFile): IncrementFinding[] {
    const out: IncrementFinding[] = [];
    const visit = function visit(node: ts.Node, parent: ts.Node | null): void {
        if (isUpdateExpression(node)) {
            out.push(findingFor(sourceFile, node, parent));
        }
        ts.forEachChild(node, (child) => {
            visit(child, node);
        });
    };
    visit(sourceFile, null);
    return out;
};

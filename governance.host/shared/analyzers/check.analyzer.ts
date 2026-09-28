import type { ReadDeclaration } from "../../types/check.types.ts";
import ts from "typescript";

export const DECLARING_CALLEE = "defineCheck";

type Field = keyof ReadDeclaration;

const stringsOf = function stringsOf(node: ts.Expression): readonly string[] | null {
    if (!ts.isArrayLiteralExpression(node)) {
        return null;
    }
    const values = node.elements.flatMap((element) => (ts.isStringLiteral(element) ? [element.text] : []));
    return values.length === node.elements.length ? values : null;
};

const fieldOf = function fieldOf(object: ts.ObjectLiteralExpression, field: Field): readonly string[] | null {
    const property = object.properties.find(
        (member) => ts.isPropertyAssignment(member) && ts.isIdentifier(member.name) && member.name.text === field,
    );
    return property !== undefined && ts.isPropertyAssignment(property) ? stringsOf(property.initializer) : null;
};

const declarationOf = function declarationOf(node: ts.CallExpression): ReadDeclaration | null {
    const [argument] = node.arguments;
    if (argument === undefined || !ts.isObjectLiteralExpression(argument)) {
        return null;
    }
    const detects = fieldOf(argument, "detects");
    const enforces = fieldOf(argument, "enforces");
    return detects === null || enforces === null ? null : { detects, enforces };
};

const isDeclaringCall = function isDeclaringCall(node: ts.Node): node is ts.CallExpression {
    return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === DECLARING_CALLEE;
};

export const declarationsIn = function declarationsIn(
    fileName: string,
    text: string,
): readonly (ReadDeclaration | null)[] {
    const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    const found: (ReadDeclaration | null)[] = [];
    const visit = (node: ts.Node): void => {
        if (isDeclaringCall(node)) {
            found.push(declarationOf(node));
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    return found;
};

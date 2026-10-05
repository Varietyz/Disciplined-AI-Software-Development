import type { LineRange } from "#types/edit.types";
import path from "node:path";
import { readFileSync } from "node:fs";
import { safeStat } from "#core/loaders/source.loader";
import ts from "typescript";

const LINE_OFFSET = 1;

const declaredFunctionName = function declaredFunctionName(node: ts.VariableStatement): string | null {
    const [decl] = node.declarationList.declarations;
    if (!decl || !ts.isIdentifier(decl.name)) {
        return null;
    }
    const init = decl.initializer;
    const initializesFunction = init !== undefined && (ts.isArrowFunction(init) || ts.isFunctionExpression(init));
    return initializesFunction ? decl.name.text : null;
};

const functionNameOf = function functionNameOf(node: ts.Node): string | null {
    if (ts.isFunctionDeclaration(node)) {
        return node.name ? node.name.text : null;
    }
    if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) {
        return node.name.text;
    }
    return ts.isVariableStatement(node) ? declaredFunctionName(node) : null;
};

const visitFunctions = function visitFunctions(
    source: ts.SourceFile,
    onFunction: (name: string, node: ts.Node) => void,
): void {
    const visit = (node: ts.Node): void => {
        const name = functionNameOf(node);
        if (name !== null) {
            onFunction(name, node);
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
};

const sourceAt = function sourceAt(root: string, file: string): ts.SourceFile | null {
    const full = path.join(root, file);
    if (safeStat(full) === null) {
        return null;
    }
    return ts.createSourceFile(file, readFileSync(full, "utf8"), ts.ScriptTarget.Latest, true);
};

export const functionNamesIn = function functionNamesIn(root: string, file: string): Set<string> | null {
    const source = sourceAt(root, file);
    if (source === null) {
        return null;
    }
    const names = new Set<string>();
    visitFunctions(source, (name) => {
        names.add(name);
    });
    return names;
};

export const functionRangesIn = function functionRangesIn(
    root: string,
    file: string,
    wanted: ReadonlySet<string>,
): LineRange[] {
    const source = sourceAt(root, file);
    const ranges: LineRange[] = [];
    if (source === null) {
        return ranges;
    }
    visitFunctions(source, (name, node) => {
        if (wanted.has(name)) {
            const start = source.getLineAndCharacterOfPosition(node.getStart(source)).line + LINE_OFFSET;
            const end = source.getLineAndCharacterOfPosition(node.getEnd()).line + LINE_OFFSET;
            ranges.push({ end, start });
        }
    });
    return ranges;
};

import ts from "typescript";

export const specifierNodes = function specifierNodes(source: ts.SourceFile): ts.StringLiteral[] {
    const out: ts.StringLiteral[] = [];
    const visit = function visit(node: ts.Node): void {
        if (
            (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
            node.moduleSpecifier !== undefined &&
            ts.isStringLiteral(node.moduleSpecifier)
        ) {
            out.push(node.moduleSpecifier);
        }
        if (
            ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword &&
            node.arguments.length > 0
        ) {
            const [first] = node.arguments;
            if (first !== undefined && ts.isStringLiteral(first)) {
                out.push(first);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    return out;
};

export const specifiersOf = function specifiersOf(fileName: string, text: string): readonly string[] {
    const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    return specifierNodes(source).map((literal) => literal.text);
};

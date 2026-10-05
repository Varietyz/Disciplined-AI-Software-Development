import ts from "typescript";

const CREATE = "create";

export const isFunctionLike = function isFunctionLike(
    node: ts.Node,
): node is ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression | ts.MethodDeclaration {
    return (
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node) ||
        ts.isMethodDeclaration(node)
    );
};

export const isFactoryName = function isFactoryName(name: string): boolean {
    if (!name.startsWith(CREATE) || name.length <= CREATE.length) {
        return false;
    }
    const char = name.charAt(CREATE.length);
    return char >= "A" && char <= "Z";
};

export const inPackage = function inPackage(decl: ts.Declaration, dirPosix: string): boolean {
    return decl.getSourceFile().fileName.split("\\").join("/").startsWith(dirPosix);
};

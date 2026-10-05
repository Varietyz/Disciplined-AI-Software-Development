import ts from "typescript";

const FLAG_PARITY = 2;
const FLAG_SET = 1;

const resolveAlias = function resolveAlias(
    checker: ts.TypeChecker,
    symbol: ts.Symbol | undefined,
): ts.Symbol | undefined {
    if (symbol && Math.floor(symbol.flags / ts.SymbolFlags.Alias) % FLAG_PARITY === FLAG_SET) {
        return checker.getAliasedSymbol(symbol);
    }
    return symbol;
};

export const clausesOfToken = function clausesOfToken(
    node: ts.ClassLikeDeclaration,
    token: ts.SyntaxKind,
): ts.ExpressionWithTypeArguments[] {
    const out: ts.ExpressionWithTypeArguments[] = [];
    for (const clause of node.heritageClauses ?? []) {
        if (clause.token === token) {
            out.push(...clause.types);
        }
    }
    return out;
};

export const baseChain = function baseChain(
    checker: ts.TypeChecker,
    node: ts.ClassLikeDeclaration,
): ts.ClassLikeDeclaration[] {
    const out: ts.ClassLikeDeclaration[] = [];
    const visited = new Set<ts.ClassLikeDeclaration>([node]);
    let current: ts.ClassLikeDeclaration | null = node;
    while (current) {
        const [baseExpr] = clausesOfToken(current, ts.SyntaxKind.ExtendsKeyword);
        const baseSymbol = baseExpr ? resolveAlias(checker, checker.getSymbolAtLocation(baseExpr.expression)) : null;
        const baseDecl =
            (baseSymbol?.getDeclarations() ?? []).find((declaration) => ts.isClassLike(declaration)) ?? null;
        current = baseDecl && ts.isClassLike(baseDecl) && !visited.has(baseDecl) ? baseDecl : null;
        if (current) {
            visited.add(current);
            out.push(current);
        }
    }
    return out;
};

export const implementsClauses = function implementsClauses(
    checker: ts.TypeChecker,
    node: ts.ClassLikeDeclaration,
): ts.ExpressionWithTypeArguments[] {
    const out: ts.ExpressionWithTypeArguments[] = [...clausesOfToken(node, ts.SyntaxKind.ImplementsKeyword)];
    for (const base of baseChain(checker, node)) {
        out.push(...clausesOfToken(base, ts.SyntaxKind.ImplementsKeyword));
    }
    return out;
};

export const memberNamesOf = function memberNamesOf(node: ts.ClassLikeDeclaration): string[] {
    const out: string[] = [];
    for (const classMember of node.members) {
        if (classMember.name) {
            out.push(classMember.name.getText());
        }
    }
    return out;
};

import type { Binding, CodeFile } from "@banes-lab/web/types/code.types.js";
import { CODE_EXTENSIONS } from "#configuration/constants/binding.constants";
import { dirname } from "node:path";
import ts from "typescript";

const WINDOWS_SEPARATOR = "\\";
const PATH_SEPARATOR = "/";
const EXTENSION_SEPARATOR = ".";

const keyOf = function keyOf(file: string): string {
    const slashed = file.split(WINDOWS_SEPARATOR).join(PATH_SEPARATOR);
    return ts.sys.useCaseSensitiveFileNames ? slashed : slashed.toLowerCase();
};

const isCode = function isCode(path: string): boolean {
    return CODE_EXTENSIONS.has(path.slice(path.lastIndexOf(EXTENSION_SEPARATOR) + 1));
};

const optionsOf = function optionsOf(configDir: string): ts.CompilerOptions {
    const found = ts.findConfigFile(configDir, (file) => ts.sys.fileExists(file));
    if (found === undefined) {
        return { allowJs: true, noEmit: true };
    }
    const read = ts.readConfigFile(found, (file) => ts.sys.readFile(file));
    const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, dirname(found));
    return { ...parsed.options, allowJs: true, noEmit: true };
};

const isDynamicImport = function isDynamicImport(parent: ts.Node): boolean {
    return ts.isCallExpression(parent) && parent.expression.kind === ts.SyntaxKind.ImportKeyword;
};

const isImportType = function isImportType(parent: ts.Node): boolean {
    return ts.isLiteralTypeNode(parent) && ts.isImportTypeNode(parent.parent);
};

const SPECIFIER_PARENTS: readonly ((parent: ts.Node) => boolean)[] = [
    ts.isImportDeclaration,
    ts.isExportDeclaration,
    ts.isExternalModuleReference,
    isDynamicImport,
    isImportType,
];

const isModuleSpecifier = function isModuleSpecifier(node: ts.Node): boolean {
    return ts.isStringLiteralLike(node) && SPECIFIER_PARENTS.some((test) => test(node.parent));
};

const symbolAt = function symbolAt(checker: ts.TypeChecker, node: ts.Node): ts.Symbol | undefined {
    const shorthand =
        ts.isShorthandPropertyAssignment(node.parent) && node.parent.name === node
            ? checker.getShorthandAssignmentValueSymbol(node.parent)
            : undefined;
    const found = shorthand ?? checker.getSymbolAtLocation(node);
    return found !== undefined && (found.flags & ts.SymbolFlags.Alias) !== 0 ? checker.getAliasedSymbol(found) : found;
};

interface Scope {
    readonly checker: ts.TypeChecker;
    readonly paths: ReadonlyMap<string, string>;
}

const bindingAt = function bindingAt(scope: Scope, source: ts.SourceFile, node: ts.Node): Binding | null {
    const symbol = symbolAt(scope.checker, node);
    const declaration = symbol?.valueDeclaration ?? symbol?.declarations?.[0];
    if (symbol === undefined || declaration === undefined) {
        return null;
    }
    const home = declaration.getSourceFile();
    const file = scope.paths.get(keyOf(home.fileName));
    if (file === undefined) {
        return null;
    }
    const start = node.getStart(source);
    const here = source.getLineAndCharacterOfPosition(start);
    const at = { column: here.character, line: here.line + 1 };
    if (ts.isSourceFile(declaration)) {
        return { ...at, file, module: true, name: symbol.getName(), target: 1 };
    }
    const name = ts.getNameOfDeclaration(declaration) ?? declaration;
    const nameStart = name.getStart(home);
    if (home === source && nameStart === start) {
        return null;
    }
    const target = home.getLineAndCharacterOfPosition(nameStart).line + 1;
    return { ...at, file, module: false, name: name.getText(home), target };
};

const bindingsIn = function bindingsIn(scope: Scope, source: ts.SourceFile): readonly Binding[] {
    const found: Binding[] = [];
    const visit = function visit(node: ts.Node): void {
        if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node) || isModuleSpecifier(node)) {
            const binding = bindingAt(scope, source, node);
            if (binding !== null) {
                found.push(binding);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    return found;
};

export const bindingResolverOf = function bindingResolverOf(
    files: readonly CodeFile[],
    configDir: string,
): (path: string) => readonly Binding[] | null {
    const code = files.filter((file) => isCode(file.path));
    const program = ts.createProgram({ options: optionsOf(configDir), rootNames: code.map((file) => file.absolute) });
    const paths = new Map(code.map((file) => [keyOf(file.absolute), file.path] as const));
    const byPath = new Map(code.map((file) => [file.path, keyOf(file.absolute)] as const));
    const sources = new Map(program.getSourceFiles().map((source) => [keyOf(source.fileName), source] as const));
    const scope: Scope = { checker: program.getTypeChecker(), paths };
    return (path) => {
        const key = byPath.get(path);
        const source = key === undefined ? undefined : sources.get(key);
        return source === undefined ? null : bindingsIn(scope, source);
    };
};

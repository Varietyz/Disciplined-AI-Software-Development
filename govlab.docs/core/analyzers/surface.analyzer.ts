import type { PublicMember, ResolvedMember, SurfaceResult } from "#types/readme.types";
import { PROGRAM_OPTIONS } from "#configuration/constants/program.constants";
import type { PackageJsonLike } from "#types/code.types";
import { hasSymbolFlag } from "#core/predicates/program.predicate";
import { resolveSourceBarrels } from "#core/resolvers/barrel.resolver";
import ts from "typescript";

const SIGNATURE_FLAGS =
    ts.TypeFormatFlags.NoTruncation |
    ts.TypeFormatFlags.UseFullyQualifiedType |
    ts.TypeFormatFlags.WriteTypeArgumentsOfSignature |
    ts.TypeFormatFlags.MultilineObjectLiterals;

const TYPE_BODY_MAX = 96;
const DEFAULT_EXPORT = "default";
const COLLAPSED_BODY = "{ … }";
const WHITESPACE: ReadonlySet<string> = new Set([" ", "\t", "\n", "\r"]);

const NAMED_KINDS: readonly (readonly [number, string, string])[] = [
    [ts.SymbolFlags.Class, "class", "class"],
    [ts.SymbolFlags.Interface, "type", "interface"],
    [ts.SymbolFlags.Enum, "enum", "enum"],
    [ts.SymbolFlags.EnumMember, "enum", "enum"],
    [ts.SymbolFlags.Module, "namespace", "namespace"],
];

const collapseWhitespace = function collapseWhitespace(text: string): string {
    let out = "";
    let inSpace = false;
    for (const char of text) {
        const isSpace = WHITESPACE.has(char);
        if (!isSpace) {
            out += char;
        }
        if (isSpace && !inSpace) {
            out += " ";
        }
        inSpace = isSpace;
    }
    return out.trim();
};

const braceEnd = function braceEnd(text: string, start: number): number {
    let depth = 0;
    for (let at = start; at < text.length; at += 1) {
        depth += text.charAt(at) === "{" ? 1 : 0;
        depth -= text.charAt(at) === "}" ? 1 : 0;
        if (depth === 0 && text.charAt(at) === "}") {
            return at;
        }
    }
    return text.length;
};

const collapseBraces = function collapseBraces(text: string, threshold: number): string {
    let out = "";
    let at = 0;
    while (at < text.length) {
        const end = text.charAt(at) === "{" ? braceEnd(text, at) : -1;
        if (end !== -1 && end - at - 1 > threshold) {
            out += COLLAPSED_BODY;
            at = end + 1;
        } else {
            out += text.charAt(at);
            at += 1;
        }
    }
    return out;
};

const readable = function readable(text: string): string {
    return collapseBraces(collapseWhitespace(text), TYPE_BODY_MAX);
};

const namedKind = function namedKind(name: string, flags: number): ResolvedMember | null {
    const hit = NAMED_KINDS.find(([mask]) => hasSymbolFlag(flags, mask));
    return hit === undefined ? null : { kind: hit[1], signature: `${hit[2]} ${name}` };
};

const valueKind = function valueKind(
    name: string,
    target: ts.Symbol,
    checker: ts.TypeChecker,
    decl: ts.Declaration,
): ResolvedMember {
    if (hasSymbolFlag(target.getFlags(), ts.SymbolFlags.TypeAlias)) {
        const aliasType = checker.getDeclaredTypeOfSymbol(target);
        return {
            kind: "type",
            signature: readable(`type ${name} = ${checker.typeToString(aliasType, decl, SIGNATURE_FLAGS)}`),
        };
    }
    const type = checker.getTypeOfSymbolAtLocation(target, decl);
    const [callSignature] = type.getCallSignatures();
    if (callSignature) {
        return { kind: "fn", signature: readable(`function ${name}${checker.signatureToString(callSignature, decl)}`) };
    }
    return {
        kind: "const",
        signature: readable(`const ${name}: ${checker.typeToString(type, decl, SIGNATURE_FLAGS)}`),
    };
};

const resolveMember = function resolveMember(
    symbol: ts.Symbol,
    decl: ts.Declaration,
    checker: ts.TypeChecker,
): ResolvedMember {
    const name = symbol.getName();
    if (name === DEFAULT_EXPORT) {
        return { kind: DEFAULT_EXPORT, signature: "default export" };
    }
    const target = hasSymbolFlag(symbol.getFlags(), ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(symbol) : symbol;
    const targetDecl = target.getDeclarations()?.[0] ?? decl;
    return namedKind(name, target.getFlags()) ?? valueKind(name, target, checker, targetDecl);
};

const exportsOf = function exportsOf(file: ts.SourceFile, checker: ts.TypeChecker, axis: string): PublicMember[] {
    const moduleSymbol = checker.getSymbolAtLocation(file);
    if (!moduleSymbol) {
        return [];
    }
    return checker.getExportsOfModule(moduleSymbol).flatMap((symbol): PublicMember[] => {
        const decl = symbol.getDeclarations()?.[0];
        return decl ? [{ axis, name: symbol.getName(), ...resolveMember(symbol, decl, checker) }] : [];
    });
};

export const readPublicSurface = function readPublicSurface(moduleDir: string, pkg: PackageJsonLike): SurfaceResult {
    const barrels = resolveSourceBarrels(moduleDir, pkg);
    if (barrels.length === 0) {
        return { surface: [] };
    }
    const program = ts.createProgram({ options: PROGRAM_OPTIONS, rootNames: barrels.map((barrel) => barrel.barrel) });
    const checker = program.getTypeChecker();
    const surface = barrels.flatMap(({ axis, barrel }) => {
        const file = program.getSourceFile(barrel);
        return file ? exportsOf(file, checker, axis) : [];
    });
    return {
        surface: surface.toSorted(
            (left, right) => left.axis.localeCompare(right.axis) || left.name.localeCompare(right.name),
        ),
    };
};

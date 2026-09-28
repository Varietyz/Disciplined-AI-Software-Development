import {
    CODEMOD_TSCONFIGS,
    inRepo,
    lineOf,
    programFor,
    relPath,
    repoSourceFiles,
    toPosix,
} from "../selectors/program.selector.ts";
import type { LiteralSite, LocationFinding } from "../../types/analyzer.types.ts";
import { ROOT, paths } from "@ssot/paths";
import { existsSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const SSOT_MODULE = "@ssot/paths";
const ROOT_POSIX = toPosix(ROOT);

const PATH_CALLEES = new Set([
    "existsSync",
    "join",
    "mkdirSync",
    "readFileSync",
    "readdirSync",
    "resolve",
    "rmSync",
    "statSync",
    "writeFileSync",
]);

const PATH_NAME_SUFFIXES = ["DIR", "DIRS", "FILE", "FILES", "GLOB", "PATH", "PATHS", "ROOT"];

const keyIndex = function keyIndex(): [string, string][] {
    const flat: [string, string][] = [];
    const walk = function walk(node: unknown, trail: string[]): void {
        if (typeof node === "string") {
            const posix = toPosix(node);
            if (posix.startsWith(`${ROOT_POSIX}/`)) {
                flat.push([trail.join("."), posix.slice(ROOT_POSIX.length + 1)]);
            }
            return;
        }
        if (typeof node !== "object" || node === null) {
            return;
        }
        for (const [key, value] of Object.entries(node)) {
            walk(value, [...trail, key]);
        }
    };
    walk(paths, []);
    return flat.sort((a, b) => b[1].length - a[1].length);
};

const KEYS = keyIndex();

const matchOf = function matchOf(value: string): { key: string; rest: string } | null {
    const posix = toPosix(value);
    for (const [key, token] of KEYS) {
        if (posix === token) {
            return { key, rest: "" };
        }
        if (posix.startsWith(`${token}/`)) {
            return { key, rest: posix.slice(token.length) };
        }
    }
    return null;
};

const isPathName = function isPathName(name: string): boolean {
    const upper = name.toUpperCase();
    return PATH_NAME_SUFFIXES.some((suffix) => upper.endsWith(suffix));
};

const calleeOf = function calleeOf(call: ts.CallExpression): string {
    const callee = call.expression;
    return ts.isPropertyAccessExpression(callee) ? callee.name.text : (ts.isIdentifier(callee) ? callee.text : "");
};

const usedAsPath = function usedAsPath(chain: readonly ts.Node[]): boolean {
    for (let index = chain.length - 1; index >= 0; index -= 1) {
        const node = chain[index];
        if (node === undefined) {
            return false;
        }
        if (ts.isCallExpression(node)) {
            return PATH_CALLEES.has(calleeOf(node));
        }
        if (ts.isVariableDeclaration(node)) {
            return ts.isIdentifier(node.name) && isPathName(node.name.text);
        }
        if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name)) {
            return isPathName(node.name.text);
        }
        if (!ts.isArrayLiteralExpression(node) && !ts.isParenthesizedExpression(node)) {
            return false;
        }
    }
    return false;
};

const isSsotImport = function isSsotImport(statement: ts.Statement): statement is ts.ImportDeclaration {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
        return false;
    }
    return statement.moduleSpecifier.text === SSOT_MODULE;
};

const ssotLocalName = function ssotLocalName(source: ts.SourceFile): string | null {
    for (const statement of source.statements.filter(isSsotImport)) {
        const bindings = statement.importClause?.namedBindings;
        if (bindings === undefined || !ts.isNamedImports(bindings)) {
            continue;
        }
        for (const element of bindings.elements) {
            if ((element.propertyName?.text ?? element.name.text) === "rel") {
                return element.name.text;
            }
        }
    }
    return null;
};

const SSOT_CALLEES = new Set(["rel", "resolve", "pathRel"]);

const viaSsot = function viaSsot(chain: readonly ts.Node[]): boolean {
    const parent = chain.at(-1);
    return parent !== undefined && ts.isCallExpression(parent) && SSOT_CALLEES.has(calleeOf(parent));
};

const findingFor = function findingFor(source: ts.SourceFile, site: LiteralSite): LocationFinding | null {
    const literal = site.node;
    const match = matchOf(literal.text);
    if (match === null || viaSsot(site.chain)) {
        return null;
    }
    const local = ssotLocalName(source);
    const accessor = local ?? "rel";
    const resolves = existsSync(path.join(ROOT, literal.text));
    const positionReason = usedAsPath(site.chain)
        ? null
        : `'${literal.text}' spells a workspace location but is not in a path-forming position — confirm whether it is a path, a declaration key, or a fixture before rewriting`;
    const blocked = resolves
        ? positionReason
        : `'${literal.text}' does not exist on disk — it may have been renamed and moved at once, so the intended target must be confirmed by hand`;
    const call = `${accessor}("${match.key}")`;
    return {
        end: literal.getEnd(),
        file: relPath(source.fileName),
        from: literal.text,
        line: lineOf(source, literal),
        localName: accessor,
        needsImport: local === null,
        reason: blocked,
        start: literal.getStart(source),
        to: match.rest.length > 0 ? `\`\${${call}}${match.rest}\`` : call,
    };
};

const stringLiterals = function stringLiterals(source: ts.SourceFile): LiteralSite[] {
    const out: LiteralSite[] = [];
    const visit = function visit(node: ts.Node, chain: ts.Node[]): void {
        const parent = chain.at(-1);
        const isSpecifier = parent !== undefined && (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent));
        if (ts.isStringLiteral(node) && !isSpecifier) {
            out.push({ chain, node });
        }
        ts.forEachChild(node, (child) => {
            visit(child, [...chain, node]);
        });
    };
    visit(source, []);
    return out;
};

const findingsInSource = function findingsInSource(source: ts.SourceFile): LocationFinding[] {
    return stringLiterals(source)
        .map((site) => findingFor(source, site))
        .filter((finding): finding is LocationFinding => finding !== null);
};

const findingsInProgram = function findingsInProgram(tsconfig: string): LocationFinding[] {
    return repoSourceFiles(programFor(tsconfig))
        .filter((source) => inRepo(source.fileName) && !source.isDeclarationFile)
        .flatMap(findingsInSource);
};

export const collectLocationFindings = function collectLocationFindings(): LocationFinding[] {
    const seen = new Set<string>();
    const isFirstAtSite = function isFirstAtSite(finding: LocationFinding): boolean {
        const key = `${finding.file}:${String(finding.start)}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    };
    return CODEMOD_TSCONFIGS.flatMap(findingsInProgram).filter(isFirstAtSite);
};

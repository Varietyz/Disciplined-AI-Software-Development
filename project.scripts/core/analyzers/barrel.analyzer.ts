import { GLOB_CALLEE, RELATIVE_MARK } from "#configuration/constants/closure.constants";
import type { PatternResolution, SideEffectEntry } from "#types/closure.types";
import { dirname, relative } from "node:path";
import { unmatchedBarrels, unmatchedPattern } from "#configuration/strings/closure.strings";
import { expandPattern } from "#core/resolvers/pattern.resolver";
import { normalizePath } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { readFileSync } from "node:fs";
import ts from "typescript";

const SEPARATOR = "/";
const HERE = "./";

const patternOf = function patternOf(node: ts.Node, sourceFile: ts.SourceFile): string | null {
    if (!ts.isCallExpression(node) || node.expression.getText(sourceFile) !== GLOB_CALLEE) {
        return null;
    }
    const argument = node.arguments.at(0);
    return argument !== undefined && ts.isStringLiteral(argument) ? argument.text : null;
};

const globArgumentsOf = function globArgumentsOf(node: ts.Node, sourceFile: ts.SourceFile): string[] {
    const found: string[] = [];
    const visit = function visit(child: ts.Node): void {
        const own = patternOf(child, sourceFile);
        if (own !== null) {
            found.push(own);
        }
        ts.forEachChild(child, visit);
    };
    visit(node);
    return found;
};

const resolvePattern = function resolvePattern(
    pattern: string,
    barrelDir: string,
    barrelRel: string,
): PatternResolution {
    if (!pattern.startsWith(RELATIVE_MARK)) {
        return { edges: [], unmatched: [] };
    }
    const segments = pattern.split(SEPARATOR).filter((segment) => segment !== RELATIVE_MARK && segment.length > 0);
    const matches = expandPattern(barrelDir, segments);
    if (matches.length === 0) {
        return { edges: [], unmatched: [unmatchedPattern(barrelRel, pattern)] };
    }
    return {
        edges: matches.map((match) => ({
            file: barrelRel,
            from: `${HERE}${normalizePath(relative(barrelDir, match))}`,
        })),
        unmatched: [],
    };
};

const resolveFile = function resolveFile(filePath: string, root: string): PatternResolution {
    const text = readFileSync(filePath, "utf8");
    if (!text.includes(GLOB_CALLEE)) {
        return { edges: [], unmatched: [] };
    }
    const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true);
    const barrelDir = dirname(filePath);
    const barrelRel = normalizePath(relative(root, filePath));
    const resolved = globArgumentsOf(sourceFile, sourceFile).map((pattern) =>
        resolvePattern(pattern, barrelDir, barrelRel),
    );
    return { edges: resolved.flatMap((entry) => entry.edges), unmatched: resolved.flatMap((entry) => entry.unmatched) };
};

export const collectGlobEdges = function collectGlobEdges(root: string, files: readonly string[]): SideEffectEntry[] {
    const resolved = files.map((filePath) => resolveFile(filePath, root));
    const unmatched = resolved.flatMap((entry) => entry.unmatched);
    if (unmatched.length > 0) {
        throw new Error(unmatchedBarrels(unmatched));
    }
    return resolved.flatMap((entry) => entry.edges);
};

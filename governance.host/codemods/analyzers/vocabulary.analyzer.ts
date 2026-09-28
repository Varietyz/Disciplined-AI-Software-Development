import {
    COLLECTION_PATH_SEGMENTS,
    RENAMED_COLLECTIONS,
    RENAMED_WORDS,
} from "../../shared/manifests/vocabulary.manifest.ts";
import type { LiteralFinding, RenameReach, VocabularyScope } from "../../types/analyzer.types.ts";
import { ROOT } from "@ssot/paths";
import type { RenameRules } from "../../types/writing.types.ts";
import { filesUnder } from "./word.analyzer.ts";
import path from "node:path";
import { readFileSync } from "node:fs";
import { relPath } from "../selectors/program.selector.ts";
import { renamedSpans } from "../../shared/matchers/word.matcher.ts";
import ts from "typescript";

interface MarkdownLine {
    readonly code: boolean;
    readonly offset: number;
    readonly spans: readonly (readonly [number, number])[];
    readonly text: string;
}

interface Region {
    readonly end: number;
    readonly start: number;
}

const MARKDOWN_EXTENSION = ".md";
const JSON_EXTENSION = ".json";
const FENCE = "```";
const TICK = "`";
const NEWLINE = "\n";
const SPACE = " ";
const QUOTE_WIDTH = 1;
const HOLE_OPEN_WIDTH = 2;
const PATH_BUILDERS: ReadonlySet<string> = new Set(["absolutePath", "relativePath", "join", "resolve"]);
const SHAPES_ONLY: RenameReach = { prose: false, wholeId: false };
const SHAPES_AND_WORDS: RenameReach = { prose: true, wholeId: false };

const rulesFor = function rulesFor(reach: RenameReach): RenameRules {
    return {
        ids: RENAMED_COLLECTIONS,
        pathSegments: COLLECTION_PATH_SEGMENTS,
        wholeId: reach.wholeId,
        words: reach.prose ? RENAMED_WORDS : null,
    };
};

const findingsIn = function findingsIn(
    fileName: string,
    content: string,
    region: Region,
    rules: RenameRules,
): LiteralFinding[] {
    const text = content.slice(region.start, region.end);
    return renamedSpans(text, rules).map((span) => ({
        end: region.start + span.end,
        file: relPath(fileName),
        fileName,
        from: span.from,
        line: content.slice(0, region.start + span.start).split(NEWLINE).length,
        reason: null,
        start: region.start + span.start,
        to: span.to,
    }));
};

const calleeName = function calleeName(call: ts.CallExpression): string {
    const callee = call.expression;
    return ts.isIdentifier(callee) ? callee.text : (ts.isPropertyAccessExpression(callee) ? callee.name.text : "");
};

const MODULE_POSITIONS: readonly ((parent: ts.Node) => boolean)[] = [
    (parent) => ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent),
    (parent) => ts.isExternalModuleReference(parent),
    (parent) => ts.isLiteralTypeNode(parent) && ts.isImportTypeNode(parent.parent),
    (parent) => ts.isCallExpression(parent) && parent.expression.kind === ts.SyntaxKind.ImportKeyword,
];

const FIELD_POSITIONS: readonly ((node: ts.Node, parent: ts.Node) => boolean)[] = [
    (node, parent) => ts.isElementAccessExpression(parent) && parent.argumentExpression === node,
    (node, parent) => (ts.isPropertyAssignment(parent) || ts.isPropertySignature(parent)) && parent.name === node,
    (_node, parent) => ts.isLiteralTypeNode(parent) && ts.isIndexedAccessTypeNode(parent.parent),
    (node, parent) =>
        ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.InKeyword && parent.left === node,
    (_node, parent) => ts.isCallExpression(parent) && PATH_BUILDERS.has(calleeName(parent)),
];

const isModuleSpecifier = function isModuleSpecifier(node: ts.Node): boolean {
    return MODULE_POSITIONS.some((position) => position(node.parent));
};

const namesAField = function namesAField(node: ts.Node): boolean {
    return FIELD_POSITIONS.some((position) => position(node, node.parent));
};

const literalRegion = function literalRegion(node: ts.Node, source: ts.SourceFile): Region | null {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateTail(node)) {
        return { end: node.getEnd() - QUOTE_WIDTH, start: node.getStart(source) + QUOTE_WIDTH };
    }
    return ts.isTemplateHead(node) || ts.isTemplateMiddle(node)
        ? { end: node.getEnd() - HOLE_OPEN_WIDTH, start: node.getStart(source) + QUOTE_WIDTH }
        : null;
};

const scriptFindings = function scriptFindings(fileName: string, content: string, wholeIds: boolean): LiteralFinding[] {
    const json = path.extname(fileName) === JSON_EXTENSION;
    const kind = json ? ts.ScriptKind.JSON : ts.ScriptKind.TS;
    const source = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true, kind);
    const found: LiteralFinding[] = [];
    const visit = (node: ts.Node): void => {
        const region = literalRegion(node, source);
        if (region !== null && !isModuleSpecifier(node) && !(json && namesAField(node))) {
            const prose = content.slice(region.start, region.end).includes(SPACE);
            const wholeId = wholeIds && ts.isStringLiteralLike(node) && !namesAField(node);
            found.push(...findingsIn(fileName, content, region, rulesFor({ prose, wholeId })));
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    return found;
};

const codeSpans = function codeSpans(line: string): readonly (readonly [number, number])[] {
    const spans: [number, number][] = [];
    let open = line.indexOf(TICK);
    while (open !== -1) {
        const close = line.indexOf(TICK, open + 1);
        if (close === -1) {
            break;
        }
        spans.push([open, close]);
        open = line.indexOf(TICK, close + 1);
    }
    return spans;
};

const markdownLines = function markdownLines(content: string): readonly MarkdownLine[] {
    const lines: MarkdownLine[] = [];
    let offset = 0;
    let fenced = false;
    for (const text of content.split(NEWLINE)) {
        const fence = text.trimStart().startsWith(FENCE);
        fenced = fence ? !fenced : fenced;
        lines.push({ code: fence || fenced, offset, spans: codeSpans(text), text });
        offset += text.length + NEWLINE.length;
    }
    return lines;
};

const inCode = function inCode(line: MarkdownLine, at: number): boolean {
    const column = at - line.offset;
    return line.code || line.spans.some(([open, close]) => column > open && column < close);
};

const markdownFindings = function markdownFindings(fileName: string, content: string): LiteralFinding[] {
    return markdownLines(content).flatMap((line) => {
        const region = { end: line.offset + line.text.length, start: line.offset };
        const shapes = findingsIn(fileName, content, region, rulesFor(SHAPES_ONLY));
        const words = findingsIn(fileName, content, region, rulesFor(SHAPES_AND_WORDS)).filter(
            (finding) => !inCode(line, finding.start) && !shapes.some((shape) => shape.start === finding.start),
        );
        return [...shapes, ...words];
    });
};

export const vocabularyFindingsIn = function vocabularyFindingsIn(
    fileName: string,
    content: string,
    wholeIds: boolean,
): LiteralFinding[] {
    return path.extname(fileName) === MARKDOWN_EXTENSION
        ? markdownFindings(fileName, content)
        : scriptFindings(fileName, content, wholeIds);
};

export const collectVocabularyFindings = function collectVocabularyFindings(scope: VocabularyScope): LiteralFinding[] {
    const wholeRoots = scope.wholeIdRoots.map((root) => path.resolve(ROOT, root) + path.sep);
    const skippedPaths = scope.skippedPaths.map((skipped) => path.resolve(ROOT, skipped));
    const isSkipped = (fileName: string): boolean =>
        skippedPaths.some((skipped) => fileName === skipped || fileName.startsWith(skipped + path.sep));
    const wanted = (fileName: string): boolean =>
        scope.extensions.includes(path.extname(fileName)) && !isSkipped(fileName);
    return scope.roots
        .flatMap((root) => filesUnder(path.resolve(ROOT, root), scope.skipped))
        .filter(wanted)
        .flatMap((fileName) =>
            vocabularyFindingsIn(
                fileName,
                readFileSync(fileName, "utf8"),
                wholeRoots.some((root) => fileName.startsWith(root)),
            ),
        );
};

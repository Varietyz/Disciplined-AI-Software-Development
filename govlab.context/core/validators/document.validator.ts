import type {
    DocumentSource,
    DocumentVerdict,
    PagDefect,
    PagDocument,
    ValidateResult,
} from "#types/grammar.document.types";
import { FIRST_LINE, PAG_FENCE_INFO } from "#configuration/constants/document.constants";
import { FOR_EACH_HEAD, FOR_HEAD, LOWERCASE_KEYWORDS, NEEDS_COLON } from "#configuration/constants/grammar.constants";
import { gateDefects, nodeDefects } from "#core/validators/node.validator";
import { pagTextOf } from "#core/selectors/document.selector";
import { parse } from "#core/parsers/document.parser";
import { readFileSync } from "node:fs";
import { splitLines } from "#core/converters/text.converter";

const COLON = ":";
const DECLARATION_TOKEN = "THIS";

const lineDefect = function lineDefect(trimmed: string, lineNo: number): PagDefect | null {
    if (trimmed.startsWith(FOR_HEAD) && !trimmed.startsWith(FOR_EACH_HEAD)) {
        return { code: "for_without_each", line: lineNo, token: FOR_HEAD.trim() };
    }
    const lower = LOWERCASE_KEYWORDS.find((keyword) => trimmed.startsWith(keyword));
    if (lower !== undefined) {
        return { code: "lowercase_keyword", line: lineNo, token: lower.trim() };
    }
    const needsColon = NEEDS_COLON.find((head) => trimmed.startsWith(head) && !trimmed.includes(COLON));
    return needsColon === undefined ? null : { code: "missing_colon", line: lineNo, token: needsColon.trim() };
};

const tokenDefects = function tokenDefects(text: string): PagDefect[] {
    return splitLines(text).flatMap((line, index) => {
        const trimmed = line.trim();
        const defect = trimmed === "" ? null : lineDefect(trimmed, index + 1);
        return defect === null ? [] : [defect];
    });
};

const retiredDefects = function retiredDefects(doc: PagDocument): PagDefect[] {
    return doc.retired.map((entry) => ({
        code: entry.kind === "invariant" ? "bare_invariant_block" : "retired_unit_head",
        line: entry.line,
        token: entry.token,
    }));
};

const invariantDefects = function invariantDefects(doc: PagDocument): PagDefect[] {
    return doc.invariants.flatMap((invariant): PagDefect[] => [
        ...(invariant.set === null || invariant.set === ""
            ? [{ code: "invariant_without_set" as const, line: invariant.line, token: invariant.name }]
            : []),
        ...(invariant.parties === null || invariant.parties === ""
            ? [{ code: "invariant_without_parties" as const, line: invariant.line, token: invariant.name }]
            : []),
        ...(invariant.objector === null || invariant.objector === ""
            ? [{ code: "invariant_without_objector" as const, line: invariant.line, token: invariant.name }]
            : []),
    ]);
};

const duplicateNodeDefects = function duplicateNodeDefects(doc: PagDocument): PagDefect[] {
    const seen = new Set<string>();
    const defects: PagDefect[] = [];
    for (const node of doc.nodes) {
        const number = node.number ?? "";
        if (number !== "" && seen.has(number)) {
            defects.push({ code: "node_declared_twice", line: node.line, token: number });
        }
        seen.add(number);
    }
    return defects;
};

const byLine = function byLine(a: PagDefect, b: PagDefect): number {
    return a.line - b.line || a.code.localeCompare(b.code);
};

export const validate = function validate(text: string): ValidateResult {
    const doc = parse(text);
    const declType = doc.declaration?.type;
    const defects: PagDefect[] = [
        ...(typeof declType !== "string" || declType.length === 0
            ? [{ code: "no_declaration" as const, line: 1, token: DECLARATION_TOKEN }]
            : []),
        ...retiredDefects(doc),
        ...doc.nodes.flatMap((node) => nodeDefects(node, doc)),
        ...doc.nodes.flatMap(gateDefects),
        ...duplicateNodeDefects(doc),
        ...invariantDefects(doc),
        ...tokenDefects(text),
    ].toSorted(byLine);
    return { defects, wellFormed: defects.length === 0 };
};

export const verdictOf = function verdictOf(source: DocumentSource, text: string): DocumentVerdict {
    const pag = pagTextOf(source, text);
    if (pag === null) {
        return {
            defects: [{ code: "template_without_block", line: FIRST_LINE, token: PAG_FENCE_INFO }],
            extracted: false,
            source,
        };
    }
    const offset = pag.firstLine - FIRST_LINE;
    return {
        defects: validate(pag.text).defects.map((defect) => ({ ...defect, line: defect.line + offset })),
        extracted: true,
        source,
    };
};

export const validateDocuments = function validateDocuments(sources: readonly DocumentSource[]): DocumentVerdict[] {
    return sources.map((source) => verdictOf(source, readFileSync(source.path, "utf8")));
};

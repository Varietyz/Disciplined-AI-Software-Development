import {
    ARTIFACT_SHAPE,
    DECLARING_PREFIXES,
    GATE_MAX_CONDITIONS,
    GATE_MIN_CONDITIONS,
    JURISDICTION_KEY,
    NAME_TERMINATORS,
    RESULT_BLOCKED,
    SOURCE_TOKENS,
    VAGUE_TERMS,
    WRITING_TOKENS,
    ZERO,
} from "#configuration/constants/grammar.constants";
import type { PagDefect, PagDocument, PagGate, PagNode } from "#types/grammar.document.types";

const hasVagueCondition = function hasVagueCondition(condition: string): boolean {
    const lower = condition.toLowerCase();
    return VAGUE_TERMS.some((term) => lower.includes(term));
};

const declaredNameOf = function declaredNameOf(directive: string): string | null {
    const prefix = DECLARING_PREFIXES.find((candidate) => directive.startsWith(candidate));
    if (prefix === undefined) {
        return null;
    }
    const rest = directive.slice(prefix.length);
    let end = 0;
    while (end < rest.length && !NAME_TERMINATORS.has(rest.charAt(end))) {
        end += 1;
    }
    const name = rest.slice(0, end);
    return name === "" ? null : name;
};

const declaredNamesOf = function declaredNamesOf(doc: PagDocument): string[] {
    return doc.nodes.flatMap((node) => node.directives.flatMap((directive) => declaredNameOf(directive) ?? []));
};

const inJurisdiction = function inJurisdiction(node: PagNode, doc: PagDocument, input: string): boolean {
    const jurisdiction = doc.meta[JURISDICTION_KEY] ?? "";
    return doc.nodes[0] === node && jurisdiction !== "" && jurisdiction.includes(input);
};

const inputHasSource = function inputHasSource(node: PagNode, doc: PagDocument, names: string[]): boolean {
    const input = node.input ?? "";
    return (
        SOURCE_TOKENS.some((token) => input.includes(token)) ||
        names.some((name) => input.includes(name)) ||
        inJurisdiction(node, doc, input)
    );
};

const isWordChar = function isWordChar(ch: string): boolean {
    return ch !== "" && ch.toLowerCase() !== ch.toUpperCase();
};

const hasWord = function hasWord(line: string, token: string): boolean {
    let at = line.indexOf(token);
    while (at !== -1) {
        if (!isWordChar(line.charAt(at - 1))) {
            return true;
        }
        at = line.indexOf(token, at + 1);
    }
    return false;
};

const writes = function writes(node: PagNode): boolean {
    const lines = [node.transform ?? "", ...node.directives];
    return lines.some((line) => WRITING_TOKENS.some((token) => hasWord(line, token)));
};

const tokenOf = function tokenOf(node: PagNode): string {
    return node.number ?? node.title;
};

export const nodeDefects = function nodeDefects(node: PagNode, doc: PagDocument): PagDefect[] {
    const token = tokenOf(node);
    const defects: PagDefect[] = [];
    if (node.tag === null) {
        defects.push({ code: "node_tag_malformed", line: node.line, token });
    }
    if (node.input !== null && !inputHasSource(node, doc, declaredNamesOf(doc))) {
        defects.push({ code: "input_without_source", line: node.line, token });
    }
    if (writes(node) && node.gate?.refusal === null) {
        defects.push({ code: "write_without_refusal", line: node.gate.line, token });
    }
    if (node.tag?.yields.includes(ARTIFACT_SHAPE) === true && node.freshness === null) {
        defects.push({ code: "artifact_without_freshness", line: node.line, token });
    }
    if (node.gate === null) {
        defects.push({ code: "node_without_gate", line: node.line, token });
    }
    return defects;
};

const countDefect = function countDefect(gate: PagGate): PagDefect | null {
    const count = gate.checks.length;
    if (count < GATE_MIN_CONDITIONS) {
        return { code: "gate_too_few_conditions", line: gate.line, token: String(count) };
    }
    return count > GATE_MAX_CONDITIONS
        ? { code: "gate_too_many_conditions", line: gate.line, token: String(count) }
        : null;
};

const checkDefects = function checkDefects(gate: PagGate): PagDefect[] {
    return gate.checks.flatMap((check): PagDefect[] => [
        ...(hasVagueCondition(check.condition)
            ? [{ code: "vague_condition" as const, line: check.line, token: check.marker }]
            : []),
        ...(check.evidence === null || check.evidence === ""
            ? [{ code: "check_without_evidence" as const, line: check.line, token: check.marker }]
            : []),
        ...(check.population?.measured === ZERO && check.population.whole === ZERO
            ? [{ code: "empty_population" as const, line: check.line, token: check.population.set }]
            : []),
    ]);
};

const resultDefects = function resultDefects(gate: PagGate, nodeToken: string): PagDefect[] {
    if (gate.result === null) {
        return [{ code: "result_missing", line: gate.line, token: nodeToken }];
    }
    return gate.result.unknown === RESULT_BLOCKED
        ? []
        : [{ code: "unknown_unrouted", line: gate.result.line, token: nodeToken }];
};

export const gateDefects = function gateDefects(node: PagNode): PagDefect[] {
    const { gate } = node;
    if (gate === null) {
        return [];
    }
    const countIssue = countDefect(gate);
    return [
        ...(countIssue ? [countIssue] : []),
        ...(gate.checks.some((check) => check.population !== null)
            ? []
            : [{ code: "gate_without_population" as const, line: gate.line, token: tokenOf(node) }]),
        ...checkDefects(gate),
        ...resultDefects(gate, tokenOf(node)),
    ];
};

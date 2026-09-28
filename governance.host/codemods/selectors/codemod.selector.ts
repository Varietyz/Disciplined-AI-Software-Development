import {
    CONVERTIBLE,
    DEFAULT_SCOPE_NOUN,
    appliedLine,
    blockedLine,
    gatedLine,
    handFixLine,
    leftAsWrittenLine,
    mapLine,
    noteLine,
    refusedLine,
} from "../strings/codemod.strings.ts";
import type { CodemodFinding, CodemodSpec } from "../../types/codemod.types.ts";
import { applyByFile } from "./edit.selector.ts";

const MAP = process.argv.includes("--map");
const FAILURE = 1;

const report = function report(line: string): void {
    process.stdout.write(`${line}\n`);
};

export const refuse = function refuse(reason: string): never {
    process.stderr.write(refusedLine(reason));
    process.exit(FAILURE);
};

const locationOf = function locationOf(finding: CodemodFinding): string {
    return `${finding.file}:${String(finding.line)}`;
};

const printMap = function printMap<F extends CodemodFinding>(spec: CodemodSpec<F>): void {
    const sorted = [...spec.findings].toSorted((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
    for (const finding of sorted) {
        report(mapLine(locationOf(finding), spec.label(finding), finding.reason ?? CONVERTIBLE));
    }
};

const reportBlocked = function reportBlocked<F extends CodemodFinding>(
    spec: CodemodSpec<F>,
    blocked: readonly F[],
): void {
    for (const finding of blocked) {
        const line = blockedLine(locationOf(finding), spec.ruleId, spec.blockedMessage(finding));
        if (spec.gateOnBlocked) {
            process.stderr.write(`${gatedLine(line)}\n`);
        } else {
            report(noteLine(line));
        }
    }
};

export const applyCodemod = function applyCodemod<F extends CodemodFinding>(spec: CodemodSpec<F>): void {
    if (MAP) {
        printMap(spec);
        process.exit(0);
    }
    const convertible = spec.findings.filter((finding) => finding.reason === null);
    const blocked = spec.findings.filter((finding) => finding.reason !== null);
    const applied = applyByFile(spec.editsByFile(convertible));
    const programs = String(spec.programCount);
    report(appliedLine(spec.ruleId, applied, spec.appliedNoun, programs, spec.scopeNoun ?? DEFAULT_SCOPE_NOUN));
    if (blocked.length === 0) {
        return;
    }
    reportBlocked(spec, blocked);
    if (spec.gateOnBlocked) {
        process.stderr.write(`${handFixLine(spec.ruleId, blocked.length)}\n`);
        process.exit(FAILURE);
    }
    report(leftAsWrittenLine(spec.ruleId, blocked.length));
};

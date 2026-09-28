import { bodyFileMissing, bodyInline, fixedTarget, forgedBoundary, stdinEmpty } from "../strings/board.strings.ts";
import { existsSync, readFileSync } from "node:fs";
import type { Outcome } from "../types/invocation.types.ts";
import { forgedBoundaries } from "../predicates/marker.predicate.ts";
import { projectRoot } from "../../../config/surface.config.ts";
import { resolve } from "node:path";

const FLAG_LEAD = "--";

const STDIN_OPERAND = "-";

const TRAILING = new Set([" ", "\t", "\n", "\r"]);

export const finish: (message: string, code: number) => never = function finish(message, code) {
    process.stdout.write(message);
    process.exit(code);
};

export const argumentValue = function argumentValue(flag: string): string | null {
    const at = process.argv.indexOf(flag);
    const value = at === -1 ? undefined : process.argv[at + 1];
    return value === undefined || value.length === 0 || value.startsWith(FLAG_LEAD) ? null : value;
};

const operandsAfter = function operandsAfter(flag: string): string[] {
    const at = process.argv.indexOf(flag);
    if (at === -1) {
        return [];
    }

    const rest = process.argv.slice(at + 1);
    const end = rest.findIndex((token) => token.startsWith(FLAG_LEAD));
    return end === -1 ? rest : rest.slice(0, end);
};

export const joinedValue = function joinedValue(flag: string): string | null {
    const held = operandsAfter(flag);
    return held.length === 0 ? null : held.join(" ");
};

export const refuseFixedTarget = function refuseFixedTarget(form: string, surface: string): void {
    if (process.argv.includes("--file")) {
        finish(fixedTarget(form, surface), 2);
    }
};

const refuseForgedBoundary = function refuseForgedBoundary(body: string, flag: string): void {
    const forged = forgedBoundaries(body);
    if (forged.length === 0) {
        return;
    }

    const named = forged.map((entry) => `line ${String(entry.line)}: ${entry.text}`).join("; ");
    finish(forgedBoundary(flag, forged.length, named), 2);
};

const withoutTrailing = function withoutTrailing(raw: string): string {
    let end = raw.length;
    while (end > 0 && TRAILING.has(raw.charAt(end - 1))) {
        end -= 1;
    }
    return raw.slice(0, end);
};

const inlineOperand = function inlineOperand(inlineFlag: string, fileFlag: string): string | null {
    const inline = joinedValue(inlineFlag);
    if (inline === null) {
        return null;
    }

    if (inline !== STDIN_OPERAND) {
        finish(bodyInline(inlineFlag, fileFlag, STDIN_OPERAND, operandsAfter(inlineFlag).length), 2);
    }

    const piped = readFileSync(0, "utf8");
    if (piped.trim().length === 0) {
        process.stdout.write(stdinEmpty(inlineFlag, STDIN_OPERAND));
        return null;
    }
    refuseForgedBoundary(piped, `${inlineFlag} ${STDIN_OPERAND}`);
    return piped;
};

export const textOperand = function textOperand(inlineFlag: string, fileFlag: string): string | null {
    const path = argumentValue(fileFlag);
    if (path === null) {
        return inlineOperand(inlineFlag, fileFlag);
    }

    const from = resolve(projectRoot(), path);
    if (!existsSync(from)) {
        finish(bodyFileMissing(fileFlag, path), 2);
    }

    const body = withoutTrailing(readFileSync(from, "utf8"));
    refuseForgedBoundary(body, fileFlag);
    return body;
};

export const bodyOr = function bodyOr(refusal: string, act: (body: string) => Outcome): Outcome {
    const body = textOperand("--body", "--body-file");
    return body === null ? { code: 2, message: refusal } : act(body);
};

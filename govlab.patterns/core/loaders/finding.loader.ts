import { existsSync, readFileSync } from "node:fs";
import type { CodeFinding } from "#types/code.types";
import type { ModuleFindings } from "#types/report.types";
import { isRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { relativePath } from "@ssot/paths";

const stringOf = function stringOf(value: unknown): string {
    return typeof value === "string" ? value : "";
};

const numberOf = function numberOf(value: unknown): number {
    return typeof value === "number" ? value : 0;
};

const stringsOf = function stringsOf(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
};

const asCodeFinding = function asCodeFinding(value: unknown): CodeFinding[] {
    if (!isRecord(value)) {
        return [];
    }
    return [
        {
            confidence: stringOf(value["confidence"]),
            detail: stringOf(value["detail"]),
            file: stringOf(value["file"]),
            kind: stringOf(value["kind"]),
            line: numberOf(value["line"]),
            members: stringsOf(value["members"]),
            name: stringOf(value["name"]),
            relevance: numberOf(value["relevance"]),
            remedy: stringOf(value["remedy"]),
            severity: stringOf(value["severity"]),
        },
    ];
};

export const findingsPathOf = function findingsPathOf(moduleDir: string): string {
    return join(moduleDir, relativePath("moduleInfo.findings"));
};

export const loadModuleFindings = function loadModuleFindings(moduleDir: string, title: string): ModuleFindings | null {
    const path = findingsPathOf(moduleDir);
    if (!existsSync(path)) {
        return null;
    }
    try {
        const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
        const raw: unknown[] = isRecord(parsed) && Array.isArray(parsed["findings"]) ? parsed["findings"] : [];
        return { findings: raw.flatMap(asCodeFinding), module: title };
    } catch (error) {
        if (!(error instanceof SyntaxError)) {
            throw error;
        }
        return null;
    }
};

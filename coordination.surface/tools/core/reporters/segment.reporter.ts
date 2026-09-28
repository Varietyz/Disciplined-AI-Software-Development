import type { Edit, EditRecord, Finding, Hit, HitRecord, Report, Verdict } from "../types/segment.types.ts";
import { dirname, join } from "node:path";

import { mkdirSync, writeFileSync } from "node:fs";
import { GENERATED_DIR } from "../constants/path.constants.ts";

const GENERATED_REPORT = ".generated.json";

export const toHitRecords = function toHitRecords(hits: readonly Hit[]): HitRecord[] {
    return hits.map((hit) => ({
        line: hit.span.line,
        path: hit.path,
        pattern: hit.patternId,
        text: hit.segments.map((s) => s.text).join("\n"),
    }));
};

export const toEditRecords = function toEditRecords(edits: readonly Edit[]): EditRecord[] {
    return edits.map((edit) => ({
        end: edit.end,
        path: edit.path,
        reason: edit.reason,
        replacement: edit.replacement,
        start: edit.start,
    }));
};

export const verdictOf = function verdictOf(findings: readonly Finding[], rejected: readonly Edit[]): Verdict {
    return findings.length === 0 && rejected.length === 0 ? "pass" : "fail";
};

export const writeReport = function writeReport(repoRoot: string, name: string, report: Report): string {
    const target = join(repoRoot, GENERATED_DIR, `${name}${GENERATED_REPORT}`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${JSON.stringify(report, null, 4)}\n`, "utf8");
    return target;
};

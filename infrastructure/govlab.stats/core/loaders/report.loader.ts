import type { VerifyReportStats, VerifyStageStat, VerifyStepStat } from "#types/report.types";
import { arrayField, field, numberField, stringField } from "#core/selectors/field.selector";
import { VERIFY_REPORT_FILE } from "@govlab/pipeline/configuration/constants/report.constants.ts";
import { isRecord } from "#core/predicates/record.predicate";
import path from "node:path";
import { readJson } from "#core/loaders/data.loader";

const emptyVerify = function emptyVerify(): VerifyReportStats {
    return {
        available: false,
        generatedAt: "",
        label: "",
        ok: false,
        stages: [],
        totals: { failed: 0, passed: 0, steps: 0, violations: 0 },
    };
};

const toStep = function toStep(raw: unknown): VerifyStepStat {
    const violations = field(raw, "violations");
    return {
        label: stringField(raw, "label"),
        ok: field(raw, "ok") === true,
        violations: typeof violations === "number" ? violations : null,
    };
};

const toStage = function toStage(raw: unknown): VerifyStageStat {
    return {
        failed: numberField(raw, "failed", 0),
        passed: numberField(raw, "passed", 0),
        stage: stringField(raw, "stage"),
        steps: arrayField(raw, "steps").map(toStep),
        violations: numberField(raw, "violations", 0),
    };
};

export const collectVerifyReport = function collectVerifyReport(root: string): VerifyReportStats {
    const raw = readJson(path.join(root, VERIFY_REPORT_FILE));
    if (!isRecord(raw)) {
        return emptyVerify();
    }
    const totals = field(raw, "totals");
    return {
        available: true,
        generatedAt: stringField(raw, "generatedAt"),
        label: stringField(raw, "label"),
        ok: field(raw, "ok") === true,
        stages: arrayField(raw, "stages").map(toStage),
        totals: {
            failed: numberField(totals, "failed", 0),
            passed: numberField(totals, "passed", 0),
            steps: numberField(totals, "steps", 0),
            violations: numberField(totals, "violations", 0),
        },
    };
};

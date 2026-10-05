import type { ReportArtifact, ReportRow, StageArtifact } from "#types/stage.types";
import type { StageTally, StepOutput } from "#types/report.types";
import type { CapturedOutcome } from "#types/shell.types";
import { FALLBACK_EXIT } from "#configuration/constants/shell.constants";
import { lastCount } from "#core/selectors/violation.selector";

export const rowOf = function rowOf(stage: string, label: string, outcome: CapturedOutcome): ReportRow {
    return { code: outcome.code, count: lastCount(outcome.out), label, out: outcome.out, stage };
};

export const outputOf = function outputOf(row: ReportRow): StepOutput {
    return { label: row.label, ok: row.code === 0, out: row.out, stage: row.stage };
};

export const rowsOf = function rowsOf(outputs: readonly StepOutput[]): ReportRow[] {
    return outputs.map((entry) =>
        rowOf(entry.stage, entry.label, { code: entry.ok ? 0 : FALLBACK_EXIT, out: entry.out }),
    );
};

export const tallyByStage = function tallyByStage(rows: readonly ReportRow[]): Map<string, StageTally> {
    const tallies = new Map<string, StageTally>();
    for (const row of rows) {
        const entry = tallies.get(row.stage) ?? { failed: 0, passed: 0, violations: 0 };
        tallies.set(row.stage, {
            failed: entry.failed + (row.code === 0 ? 0 : 1),
            passed: entry.passed + (row.code === 0 ? 1 : 0),
            violations: entry.violations + (row.count ?? 0),
        });
    }
    return tallies;
};

const stageArtifacts = function stageArtifacts(rows: readonly ReportRow[]): StageArtifact[] {
    const order = [...new Set(rows.map((row) => row.stage))];
    return order.map((stage) => {
        const stageRows = rows.filter((row) => row.stage === stage);
        return {
            failed: stageRows.filter((row) => row.code !== 0).length,
            passed: stageRows.filter((row) => row.code === 0).length,
            stage,
            steps: stageRows.map((row) => ({ label: row.label, ok: row.code === 0, violations: row.count })),
            violations: stageRows.reduce((sum, row) => sum + (row.count ?? 0), 0),
        };
    });
};

export const buildArtifact = function buildArtifact(rows: readonly ReportRow[], label: string): ReportArtifact {
    const failed = rows.filter((row) => row.code !== 0).length;
    return {
        generatedAt: new Date().toISOString(),
        label,
        ok: failed === 0,
        stages: stageArtifacts(rows),
        totals: {
            failed,
            passed: rows.length - failed,
            steps: rows.length,
            violations: rows.reduce((sum, row) => sum + (row.count ?? 0), 0),
        },
    };
};

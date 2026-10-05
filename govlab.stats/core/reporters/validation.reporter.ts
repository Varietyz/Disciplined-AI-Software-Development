import type { ActiveRuleStats } from "#types/rule.types";
import type { TypescriptStats } from "#types/config.types";
import type { VerifyReportStats } from "#types/report.types";
import { num } from "#core/formatters/metric.formatter";

const stageRows = function stageRows(verify: VerifyReportStats): string[] {
    return verify.stages.map(
        (stage) => `| ${stage.stage} | ${num(stage.passed)} | ${num(stage.failed)} | ${num(stage.violations)} |`,
    );
};

const failingRows = function failingRows(verify: VerifyReportStats): string[] {
    return verify.stages
        .flatMap((stage) => stage.steps.filter((step) => !step.ok).map((step) => ({ stage: stage.stage, step })))
        .toSorted((a, b) => (b.step.violations ?? -1) - (a.step.violations ?? -1))
        .map(
            (entry) =>
                `| ${entry.step.label} | ${entry.stage} | ${entry.step.violations === null ? "—" : num(entry.step.violations)} |`,
        );
};

const gateLines = function gateLines(verify: VerifyReportStats): string[] {
    if (!verify.available) {
        return ["### Gate", "", "| Metric | Value |", "| --- | --- |", "| report | not recorded |", ""];
    }
    const failing = failingRows(verify);
    return [
        "### Gate",
        "",
        "| Stage | Passed | Failed | Violations |",
        "| --- | ---: | ---: | ---: |",
        ...stageRows(verify),
        `| **total** | **${num(verify.totals.passed)}** | **${num(verify.totals.failed)}** | **${num(verify.totals.violations)}** |`,
        "",
        ...(failing.length > 0
            ? ["| Failing step | Stage | Violations |", "| --- | --- | ---: |", ...failing, ""]
            : []),
    ];
};

const cell = function cell(value: number | null): string {
    return value === null ? "—" : num(value);
};

const fullGateRows = function fullGateRows(rules: ActiveRuleStats): string[] {
    const sorted = rules.fullGate.toSorted(
        (a, b) => a.ecosystem.localeCompare(b.ecosystem) || a.tool.localeCompare(b.tool),
    );
    return sorted.map((entry) => {
        const metrics = rules.byTool.get(entry.tool);
        if (metrics === undefined) {
            return `| ${entry.tool} | ${entry.ecosystem} | — | — | no adapter wired |`;
        }
        return `| ${entry.tool} | ${entry.ecosystem} | ${cell(metrics.active)} | ${cell(metrics.disabled)} | ${metrics.configuration} |`;
    });
};

const enforcementLines = function enforcementLines(rules: ActiveRuleStats): string[] {
    if (!rules.available) {
        return [
            "### Enforcement",
            "",
            "| Metric | Value |",
            "| --- | --- |",
            "| registry | unavailable |",
            `| reason | ${rules.reason} |`,
            "",
        ];
    }
    const registered = rules.fullGate.length + rules.advisory + rules.selectable + rules.excluded + rules.plugins;
    return [
        "### Enforcement",
        "",
        "| Tool disposition | Count |",
        "| --- | ---: |",
        `| full-gate | ${num(rules.fullGate.length)} |`,
        `| advisory | ${num(rules.advisory)} |`,
        `| selectable | ${num(rules.selectable)} |`,
        `| excluded | ${num(rules.excluded)} |`,
        `| plugin rule-packs | ${num(rules.plugins)} |`,
        `| **registered** | **${num(registered)}** |`,
        "",
        "| Full-gate tool | Ecosystem | Rules on | Rules off | Configuration |",
        "| --- | --- | ---: | ---: | --- |",
        ...fullGateRows(rules),
        `| — custom \`local/*\` | | ${num(rules.local.active)} | ${num(rules.local.disabled)} | within eslint |`,
        "",
        "| Active ecosystem |",
        "| --- |",
        ...rules.activeEcosystems.map((ecosystem) => `| \`${ecosystem}\` |`),
        "",
    ];
};

const typecheckLines = function typecheckLines(ts: TypescriptStats): string[] {
    const on = ts.strictFlags.filter(([, enabled]) => enabled);
    return [
        "### Type-check",
        "",
        "| Metric | Value |",
        "| --- | ---: |",
        `| members with a \`tsconfig.json\` | ${num(ts.covered)} / ${num(ts.total)} |`,
        `| extending the base config | ${num(ts.members.filter((entry) => entry.extendsBase).length)} |`,
        `| base compiler options | ${num(ts.baseOptions)} |`,
        `| strict flags at base | ${num(on.length)} / ${num(ts.strictFlags.length)} |`,
        `| target | \`${ts.target}\` |`,
        `| members without a project config | ${num(ts.uncovered.length)} |`,
        "",
        ...(ts.uncovered.length > 0
            ? ["| Uncovered member |", "| --- |", ...ts.uncovered.map((member) => `| \`${member}\` |`), ""]
            : []),
    ];
};

export const verificationSubsections = function verificationSubsections(
    verify: VerifyReportStats,
    rules: ActiveRuleStats,
    typescript: TypescriptStats,
): string[] {
    return [...gateLines(verify), ...enforcementLines(rules), ...typecheckLines(typescript)];
};

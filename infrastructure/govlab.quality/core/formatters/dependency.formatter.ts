import type { InstallPlan, InstallReport } from "#types/dependency.types";
import {
    NONE_LABEL,
    eslintPluginsLine,
    generatorsLine,
    installedLine,
    npmLine,
    planHeading,
    systemInstructionLine,
    systemToolsLine,
} from "#configuration/strings/dependency.strings";

const listOrNone = function listOrNone(values: readonly string[]): string {
    return values.length > 0 ? values.join(", ") : NONE_LABEL;
};

export const printPlan = function printPlan(plan: InstallPlan): string {
    const lines: string[] = [
        planHeading(plan.ecosystems.join(", ")),
        npmLine(plan.npmDeps.length, listOrNone(plan.npmDeps)),
    ];
    if (plan.systemInstructions.length > 0) {
        lines.push(systemToolsLine(plan.systemInstructions.map((instruction) => instruction.system).join(", ")));
    }
    if (plan.eslintPlugins.length > 0) {
        lines.push(eslintPluginsLine(plan.eslintPlugins.join(", ")));
    }
    lines.push(generatorsLine(listOrNone(plan.emitters)));
    return `${lines.join("\n")}\n`;
};

export const printReport = function printReport(report: InstallReport): string {
    return [
        installedLine(report.installed.length),
        ...report.systemInstructions.map((instruction) => systemInstructionLine(instruction.system)),
    ].join("");
};

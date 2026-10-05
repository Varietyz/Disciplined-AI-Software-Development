import type { InstallPlan, InstallReport } from "#types/dependency.types";
import { execFileSync } from "node:child_process";

const NPM = "npm";
const NPM_INSTALL_DEV = ["install", "--save-dev"];

export const runInstall = function runInstall(
    plan: InstallPlan,
    { dryRun, root }: { dryRun: boolean; root: string },
): InstallReport {
    if (dryRun || plan.npmDeps.length === 0) {
        return { installed: [], systemInstructions: plan.systemInstructions };
    }
    execFileSync(NPM, [...NPM_INSTALL_DEV, ...plan.npmDeps], { cwd: root, stdio: "inherit" });
    return { installed: plan.npmDeps, systemInstructions: plan.systemInstructions };
};

#!/usr/bin/env node
import { printPlan, printReport } from "#core/formatters/dependency.formatter";
import { FAILURE_EXIT } from "#configuration/constants/invocation.constants";
import { computePlan } from "#core/factories/dependency.factory";
import { detectEcosystems } from "#core/resolvers/scope.resolver";
import { parseCliArgs } from "#core/parsers/invocation.parser";
import path from "node:path";
import process from "node:process";
import { runInstall } from "#core/adapters/dependency.adapter";
import { runLint } from "#core/coordinators/concern.coordinator";
import { validateInstallRequest } from "#core/validators/dependency.validator";

const ARGV_START = 2;
const CONFIG_FOLDER = "config";

const rootFromConfig = function rootFromConfig(configPath: string | null): string {
    if (configPath === null || configPath === "") {
        return process.cwd();
    }
    const dir = path.dirname(path.resolve(configPath));
    return path.basename(dir) === CONFIG_FOLDER ? path.dirname(dir) : dir;
};

const runInstallVerb = function runInstallVerb(args: ReturnType<typeof parseCliArgs>, root: string): void {
    const request = validateInstallRequest({ auto: args.auto, dryRun: args.dryRun, ecosystems: args.ecosystems });
    const detected = request.auto ? detectEcosystems(root).map((entry) => entry.ecosystem) : [];
    const plan = computePlan([...new Set([...request.ecosystems, ...detected])]);
    process.stdout.write(printPlan(plan));
    if (!request.dryRun) {
        process.stdout.write(printReport(runInstall(plan, { dryRun: request.dryRun, root })));
    }
};

const main = async function main(): Promise<number> {
    const args = parseCliArgs(process.argv.slice(ARGV_START));
    const root = rootFromConfig(args.config);
    if (args.concern === "list") {
        process.stdout.write(
            `${detectEcosystems(root)
                .map((entry) => entry.ecosystem)
                .join("\n")}\n`,
        );
        return 0;
    }
    if (args.concern === "install") {
        runInstallVerb(args, root);
        return 0;
    }
    return runLint(args, { env: process.env, root });
};

try {
    process.exitCode = await main();
} catch (error: unknown) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = FAILURE_EXIT;
}

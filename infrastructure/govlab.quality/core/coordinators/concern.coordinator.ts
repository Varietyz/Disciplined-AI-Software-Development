import { AGGREGATE_CONCERN, CONCERNS } from "#configuration/constants/concern.constants";
import { resolveActiveEcosystems, resolveActiveSelectable } from "#core/resolvers/tool.resolver";
import type { CliArgs } from "#types/quality.types";
import type { ProcessEnv } from "#types/tool.types";
import process from "node:process";
import { runQuality } from "#core/coordinators/quality.coordinator";

const activeEcosystems = function activeEcosystems(
    declared: readonly string[] | null,
    requested: readonly string[] | undefined,
): string[] {
    const wanted = [...(requested ?? [])];
    if (declared === null) {
        return wanted;
    }
    const allow = new Set(declared);
    return wanted.filter((ecosystem) => allow.has(ecosystem));
};

export const runLint = async function runLint(args: CliArgs, host: { env: ProcessEnv; root: string }): Promise<number> {
    const { env, root } = host;
    const spec = CONCERNS[args.concern];
    const declared = args.concern === AGGREGATE_CONCERN ? await resolveActiveEcosystems(root) : null;
    const ecosystems = activeEcosystems(declared, spec.ecosystems);
    if (declared !== null && ecosystems.length === 0) {
        return 0;
    }
    const outcome = await runQuality({
        backup: args.backup,
        dryRun: args.dryRun,
        ecosystems,
        env,
        fix: args.fix,
        only: spec.only,
        paths: args.paths.length > 0 ? args.paths : undefined,
        reporter: args.reporter,
        root,
        selectableActive: await resolveActiveSelectable(root),
    });
    process.stdout.write(outcome.report);
    return outcome.exitCode;
};

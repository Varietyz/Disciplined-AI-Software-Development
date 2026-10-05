import type { CheckOps, DriftProbe, HealOps, HealResult, HealState, ModuleFindings } from "#types/report.types";
import { HEX_DIR, persistArtifacts, staleFiles } from "#core/persistence/report.persistence";
import { artifactDrift, artifactsEqual } from "#core/validators/report.validator";
import { driftModules, healedModules, modulesClean, rewrittenModules } from "#configuration/strings/report.strings";
import { join } from "node:path";
import process from "node:process";

const FAILURE_EXIT = 1;

const probeModule = async function probeModule(moduleDir: string, ops: HealOps): Promise<DriftProbe> {
    const generated = await ops.generate(moduleDir);
    const hexDir = join(moduleDir, HEX_DIR);
    const orphaned = staleFiles(hexDir, new Set(generated.artifacts.keys())).length > 0;
    return { ...generated, drift: orphaned || artifactDrift(hexDir, generated.artifacts) };
};

const settle = function settle(probe: DriftProbe, state: HealState): HealResult {
    return { findings: probe.findings, state, svgs: probe.svgs };
};

const reattempt = async function reattempt(
    moduleDir: string,
    ops: HealOps,
    remaining: number,
    prior: DriftProbe,
): Promise<HealResult> {
    if (remaining <= 0) {
        return settle(prior, "drift");
    }
    await ops.reparse(moduleDir);
    const fresh = await probeModule(moduleDir, ops);
    if (!fresh.drift) {
        return settle(fresh, "healed");
    }
    if (artifactsEqual(prior.artifacts, fresh.artifacts)) {
        persistArtifacts(moduleDir, fresh.artifacts);
        return settle(fresh, "rewritten");
    }
    return reattempt(moduleDir, ops, remaining - 1, fresh);
};

export const healModule = async function healModule(moduleDir: string, ops: HealOps): Promise<HealResult> {
    const first = await probeModule(moduleDir, ops);
    if (!first.drift) {
        return settle(first, "clean");
    }
    if (ops.attempts <= 0) {
        return settle(first, "drift");
    }
    await ops.reparse(moduleDir);
    const second = await probeModule(moduleDir, ops);
    return second.drift ? reattempt(moduleDir, ops, ops.attempts - 1, second) : settle(second, "healed");
};

const reportHeal = function reportHeal(total: number, buckets: Readonly<Record<HealState, string[]>>): void {
    if (buckets.healed.length > 0) {
        process.stdout.write(healedModules(buckets.healed));
    }
    if (buckets.rewritten.length > 0) {
        process.stdout.write(rewrittenModules(buckets.rewritten));
    }
    if (buckets.drift.length > 0) {
        process.stderr.write(driftModules(buckets.drift));
        process.exitCode = FAILURE_EXIT;
        return;
    }
    process.stdout.write(modulesClean(total));
};

export const runHexCheck = async function runHexCheck(ops: CheckOps): Promise<void> {
    const collected: ModuleFindings[] = [];
    const buckets: Record<HealState, string[]> = { clean: [], drift: [], healed: [], rewritten: [] };
    const svgs = new Map<string, Map<string, string>>();
    await ops.pool(ops.modules, async (moduleDir) => {
        const result = await healModule(moduleDir, ops);
        collected.push(result.findings);
        svgs.set(moduleDir, result.svgs);
        buckets[result.state].push(ops.title(moduleDir));
    });
    ops.writeSvgs(svgs);
    if (!ops.masterOk(collected)) {
        ops.writeMaster();
    }
    reportHeal(ops.modules.length, buckets);
};

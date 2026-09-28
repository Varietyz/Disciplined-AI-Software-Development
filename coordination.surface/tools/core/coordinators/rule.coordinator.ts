import type { RegisteredRule, RuleContext, Stage, StageResult } from "../types/rule.types.ts";
import type { RuleOutcome, RuleRun, RunOptions } from "../types/pipeline.types.ts";
import { STAGES } from "../types/rule.types.ts";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { toPosix } from "../iterators/file.iterator.ts";
import { writeRuleReport } from "../reporters/rule.reporter.ts";

const SAT_OUT = { bypassed: false, findings: [], incomparable: false, written: [] } as const;

const bypassedStage = function bypassedStage(registered: RegisteredRule, stage: Stage): StageResult {
    return {
        bypassed: true,
        findings: 0,
        healed: 0,
        invariant: registered.declaration.invariant,
        rule: registered.id,
        stage,
    };
};

const handedPaths = function handedPaths(registered: RegisteredRule, run: RuleRun): string[] {
    const { declaration } = registered;
    const jurisdiction = run.byJurisdiction[declaration.jurisdiction];
    const scoped =
        declaration.extensions.length === 0
            ? jurisdiction
            : jurisdiction.filter((path) =>
                  declaration.extensions.some((ext) => path.length > ext.length && path.endsWith(ext)),
              );

    const extra = (declaration.reads ?? []).filter(
        (wanted) => !scoped.includes(wanted) && existsSync(resolve(run.options.repoRoot, wanted)),
    );
    return extra.length === 0 ? [...scoped] : [...scoped, ...extra];
};

const checkRule = function checkRule(registered: RegisteredRule, stage: Stage, run: RuleRun): RuleOutcome {
    const { declaration } = registered;
    const { options } = run;
    const handed = handedPaths(registered, run);
    const context: RuleContext = {
        exists: (path: string) => existsSync(resolve(options.repoRoot, path)),
        id: registered.id,
        paths: handed,
        read: run.read,
        repoRoot: options.repoRoot,
        taxonomy: run.taxonomy,
    };
    const started = process.hrtime.bigint();
    const result = declaration.check(context, options.fix);
    const elapsed = Number((process.hrtime.bigint() - started) / 1000n) / 1000;

    writeRuleReport(options.repoRoot, registered.id, {
        authoritative: run.authoritative,
        derivations: result.derivations,
        findings: result.findings,
        healed: result.healed,
        invariant: declaration.invariant,
        mechanism: toPosix(options.repoRoot, registered.path),
        rule: registered.id,
        scanned: handed.length,
        scope: run.scope,
        stage: declaration.stage,
        verdict: result.findings.length === 0 ? "pass" : "fail",
    });

    return {
        bypassed: false,
        findings: result.findings,
        incomparable: false,
        stage: {
            bypassed: false,
            elapsed,
            findings: result.findings.length,
            healed: result.healed.length,
            invariant: declaration.invariant,
            rule: registered.id,
            stage,
        },
        written: result.healed,
    };
};

export const walkRule = function walkRule(registered: RegisteredRule, stage: Stage, run: RuleRun): RuleOutcome {
    const { bypass } = run.options;
    if (bypass.includes(registered.id) || bypass.includes(stage)) {
        return { ...SAT_OUT, bypassed: true, stage: bypassedStage(registered, stage) };
    }

    if (registered.declaration.wholeScopeOnly === true && !run.authoritative) {
        return { ...SAT_OUT, incomparable: true, stage: bypassedStage(registered, registered.declaration.stage) };
    }

    return checkRule(registered, stage, run);
};

export const selectedRules = function selectedRules(
    rules: readonly RegisteredRule[],
    options: RunOptions,
): { registered: RegisteredRule; stage: Stage }[] {
    return STAGES.filter((stage) => options.stage === null || options.stage === stage).flatMap((stage) =>
        rules
            .filter((registered) => registered.declaration.stage === stage)
            .filter((registered) => options.ruleId === null || options.ruleId === registered.id)
            .map((registered) => ({ registered, stage })),
    );
};

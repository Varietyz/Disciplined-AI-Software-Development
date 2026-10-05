import type { DetectedEcosystem, QualityOutcome, RunQualityOptions } from "#types/quality.types";
import type { RunnerContext, ToolRunner } from "#types/tool.types";
import { buildCanonIndex, canonFor } from "#core/resolvers/canon.resolver";
import { defaultPathsFor, detectEcosystems } from "#core/resolvers/scope.resolver";
import { renderHuman, renderJson } from "#core/formatters/report.formatter";
import type { Finding } from "#types/finding.types";
import { NO_ECOSYSTEM } from "#configuration/strings/tool.strings";
import { loadTools } from "#core/loaders/tool.loader";
import { selectableTools } from "#core/loaders/dependency.loader";

const detectFor = function detectFor(options: RunQualityOptions): DetectedEcosystem[] {
    return options.ecosystems && options.ecosystems.length > 0
        ? options.ecosystems.map((ecosystem) => ({ ecosystem, languageId: ecosystem }))
        : detectEcosystems(options.root);
};

const contextFor = function contextFor(
    options: RunQualityOptions,
    matches: readonly DetectedEcosystem[],
    election: { elected: boolean | undefined },
): RunnerContext {
    const { elected } = election;
    const [primary] = matches;
    if (primary === undefined) {
        throw new Error(NO_ECOSYSTEM);
    }
    return {
        backup: options.backup,
        dryRun: options.dryRun,
        ecosystem: primary.ecosystem,
        elected,
        env: options.env,
        fix: options.fix,
        languageId: primary.languageId,
        paths: options.paths ?? [...new Set(matches.flatMap((match) => defaultPathsFor(match.ecosystem)))],
        root: options.root,
    };
};

const matchesFor = function matchesFor(
    runner: ToolRunner,
    detected: readonly DetectedEcosystem[],
): DetectedEcosystem[] {
    return detected.filter((entry) => runner.ecosystems.includes(entry.ecosystem));
};

const decorateCanon = function decorateCanon(findings: readonly Finding[]): void {
    const canonIndex = buildCanonIndex();
    for (const finding of findings) {
        const canon = canonFor(finding.ruleId, canonIndex);
        if (canon.length > 0) {
            finding.canon = canon;
        }
    }
};

export const runQuality = async function runQuality(options: RunQualityOptions): Promise<QualityOutcome> {
    const detected = detectFor(options);
    const selectable = selectableTools();
    const elected = new Set(options.selectableActive);
    const active = (await loadTools()).filter(
        (runner) => (!options.only || options.only.includes(runner.tool)) && matchesFor(runner, detected).length > 0,
    );
    const results = await Promise.all(
        active.map(async (runner) =>
            runner.run(
                contextFor(options, matchesFor(runner, detected), {
                    elected: selectable.has(runner.tool) ? elected.has(runner.tool) : undefined,
                }),
            ),
        ),
    );
    const findings = results.flatMap((result) => result.findings);
    const fixedCount = results.reduce((sum, result) => sum + result.fixedCount, 0);
    decorateCanon(findings);
    const report =
        options.reporter === "json"
            ? renderJson(findings, fixedCount)
            : renderHuman(
                  results.map((result) => result.output),
                  findings,
                  fixedCount,
              );
    const hasErrors = findings.some((finding) => finding.severity === "error" && !finding.advisory);
    return { exitCode: hasErrors ? 1 : 0, findings, report };
};

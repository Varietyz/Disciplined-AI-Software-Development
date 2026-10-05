import type {
    BuiltModule,
    FileEntry,
    ModuleBuild,
    ModuleReportBuild,
    ModuleScope,
    RepoContext,
} from "#types/package.types";
import { buildAnalysis, buildFindings } from "#core/formatters/report.formatter";
import { codeGraph, codeInsight } from "#core/analyzers/code.analyzer";
import { entriesFor, testUsesOf } from "#core/loaders/source.loader";
import { sortedEdges, unresolvedNames } from "#core/selectors/code.selector";
import { NESTED_SUFFIX } from "#configuration/constants/report.constants";
import type { PageOutput } from "#types/page.types";
import type { WalkCell } from "#types/walk.types";
import { basename } from "node:path";
import { buildGroup } from "#core/converters/folder.converter";
import { definitionRecords } from "#core/converters/definition.converter";
import { diagnose } from "#core/coordinators/code.coordinator";
import { keyOf } from "#core/formatters/definition.formatter";
import { metricsOf } from "#core/counters/report.counter";
import { planNode } from "#core/converters/page.converter";
import { renderOne } from "#core/coordinators/page.coordinator";
import { titleFor } from "#core/resolvers/package.resolver";

type Rendered = readonly [string, PageOutput];

const walkArtifacts = function walkArtifacts<T>(
    rendered: readonly Rendered[],
    main: (output: PageOutput) => T,
    nested: (output: PageOutput) => T,
): Map<string, T> {
    const out = new Map<string, T>();
    for (const [base, output] of rendered) {
        if (output.mainSvg.length > 0) {
            out.set(base, main(output));
        }
        if (output.nestedSvg.length > 0) {
            out.set(`${base}${NESTED_SUFFIX}`, nested(output));
        }
    }
    return out;
};

export const buildModule = function buildModule(entries: readonly FileEntry[], build: ModuleBuild): BuiltModule {
    const symbols = entries.flatMap((entry) => entry.symbols);
    const records = entries.flatMap((entry) => entry.records);
    const insight = codeInsight(symbols, records);
    const graph = codeGraph(symbols);
    const diagnosed = diagnose(symbols, { graph, records, testUses: build.testUses ?? new Set() });
    const findings = [...(build.extraFindings ?? []), ...diagnosed].sort(
        (left, right) => right.relevance - left.relevance || JSON.stringify(left).localeCompare(JSON.stringify(right)),
    );
    const context = { fanIn: build.fanIn ?? new Map<string, number>(), findings, graph, insight, title: build.title };
    const rendered = planNode(buildGroup(entries, "", build.moduleName), []).map((page): Rendered => [
        page.page,
        renderOne(page, context),
    ]);
    return {
        analysis: buildAnalysis({ findingsCount: findings.length, graph, insight, title: build.title }),
        cells: walkArtifacts<WalkCell[]>(
            rendered,
            (output) => output.mainCells,
            (output) => output.nestedCells,
        ),
        findings: buildFindings(build.title, findings),
        findingsData: findings,
        pages: new Map(rendered.map(([base, output]): [string, string] => [base, output.html])),
        report: {
            definitions: definitionRecords(insight, graph),
            edges: sortedEdges(graph),
            findings,
            metrics: metricsOf({
                edges: graph.edges,
                findings,
                symbols: insight.symbols,
                unresolved: graph.external.length,
            }),
            module: build.title,
            pages: rendered.map(([, output]) => output.report),
            unresolvedCalls: unresolvedNames(graph),
        },
        svgs: walkArtifacts<string>(
            rendered,
            (output) => output.mainSvg,
            (output) => output.nestedSvg,
        ),
    };
};

export const buildModuleReport = async function buildModuleReport(
    moduleDir: string,
    ctx: RepoContext,
    scope: ModuleScope,
): Promise<ModuleReportBuild> {
    const entries = await entriesFor(moduleDir, scope.pruned);
    const fanIn = new Map(
        entries.flatMap((entry) =>
            entry.symbols.flatMap((symbol): [string, number][] => {
                const count = ctx.fanIn.get(keyOf(moduleDir, symbol.name));
                return count === undefined ? [] : [[symbol.name, count]];
            }),
        ),
    );
    const testUses = await testUsesOf(moduleDir, scope.pruned);
    const title = titleFor(scope.root, moduleDir);
    const built = buildModule(entries, {
        extraFindings: ctx.importCycles.get(moduleDir) ?? [],
        fanIn,
        moduleName: basename(moduleDir),
        testUses,
        title,
    });
    return { built, entries, title };
};

import { FALLBACK_STATE, HIGH_SEVERITY, MEDIUM_SEVERITY } from "#configuration/constants/report.constants";
import type { HexPage, Nested, PageOutput, PageParts, RenderContext, TreeNode } from "#types/page.types";
import type { PageRender, ReportPage } from "#types/report.types";
import { nestedTip, pageLabel } from "#configuration/strings/report.strings";
import type { CodeFinding } from "#types/code.types";
import { FINDING_KINDS } from "#configuration/strings/code.strings";
import type { FileEntry } from "#types/package.types";
import type { WalkNode } from "#types/walk.types";
import { assertHardened } from "#core/validators/markup.validator";
import { increment } from "#core/counters/base.counter";
import { keyOf } from "#core/formatters/definition.formatter";
import { metricsOf } from "#core/counters/report.counter";
import { pageBaseName } from "#core/converters/page.converter";
import { renderHexGrid } from "#core/renderers/walk.renderer";
import { renderPage } from "#core/renderers/report.renderer";
import { stateOf } from "#core/classifiers/syntax.classifier";
import { subtreeFiles } from "#core/converters/folder.converter";
import { syntaxDistribution } from "#core/analyzers/syntax.analyzer";
import { walkCells } from "#core/converters/walk.converter";
import { walkSubtitle } from "#configuration/strings/walk.strings";

const guarded = function guarded(
    nodes: readonly WalkNode[],
    flagged: ReadonlyMap<string, string>,
    label: string,
): string {
    if (nodes.length === 0) {
        return "";
    }
    const svg = renderHexGrid(nodes, { flagged, title: label });
    assertHardened(svg, label);
    return svg;
};

const dominantState = function dominantState(files: readonly FileEntry[]): string {
    const counts = new Map<string, number>();
    for (const node of files.flatMap((entry) => entry.walk)) {
        increment(counts, node.state ?? stateOf(node.label));
    }
    return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? FALLBACK_STATE;
};

const nestedFor = function nestedFor(child: TreeNode, ctx: RenderContext): Nested {
    const files = subtreeFiles(child);
    const fileSet = new Set(files.map((entry) => entry.rel));
    const defs = ctx.insight.symbols.filter((stat) => fileSet.has(stat.file)).length;
    const subFindings = ctx.findings.filter((finding) => fileSet.has(finding.file));
    const severity = subFindings.some((finding) => finding.severity === HIGH_SEVERITY)
        ? HIGH_SEVERITY
        : MEDIUM_SEVERITY;
    const node: WalkNode = {
        depth: 0,
        file: child.rel,
        label: child.kind,
        name: child.rel,
        role: "node",
        state: dominantState(files),
        tip: nestedTip(child.rel, child.count, defs, subFindings.length),
    };
    const page = child.kind === "dir" ? pageBaseName(child.rel) : "";
    return {
        child: { anomalies: subFindings.length, count: child.count, defs, label: child.name, page },
        flagged: subFindings.length > 0,
        node,
        severity,
    };
};

const flagMap = function flagMap(findings: readonly CodeFinding[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const finding of findings) {
        const keys = finding.kind === FINDING_KINDS.callCycle ? finding.members : [keyOf(finding.file, finding.name)];
        for (const key of keys) {
            map.set(key, finding.severity);
        }
    }
    return map;
};

const toPageRender = function toPageRender(page: HexPage, ctx: RenderContext, parts: PageParts): PageRender {
    const walk = page.inlined.flatMap((entry) => entry.walk);
    const flagged = flagMap(parts.findings);
    const nestedNodes = parts.nested.map((item) => item.node);
    return {
        crumbs: page.crumbs,
        definitions: parts.symbols.length,
        distribution: syntaxDistribution(page.inlined.flatMap((entry) => entry.records)),
        fanIn: ctx.fanIn,
        findings: parts.findings,
        label: parts.label,
        mainCells: walkCells(walk, flagged),
        mainSvg: guarded(walk, flagged, parts.label),
        nested: parts.nested.map((item) => item.child),
        nestedCells: walkCells(nestedNodes, parts.nestedFlags),
        nestedSubtitle: walkSubtitle(nestedNodes.length),
        nestedSvg: guarded(nestedNodes, parts.nestedFlags, parts.label),
        symbols: parts.symbols,
        walkSubtitle: walkSubtitle(walk.length),
    };
};

const toReportPage = function toReportPage(
    page: HexPage,
    ctx: RenderContext,
    render: PageRender,
    files: ReadonlySet<string>,
): ReportPage {
    return {
        crumbs: render.crumbs,
        distribution: render.distribution,
        files: [...files].sort((a, b) => a.localeCompare(b)),
        findings: render.findings,
        id: page.page,
        label: render.label,
        metrics: metricsOf({
            edges: ctx.graph.edges.filter((edge) => files.has(edge.file)),
            findings: render.findings,
            symbols: render.symbols,
            unresolved: ctx.graph.external.filter((call) => files.has(call.file)).length,
        }),
        nested: render.nested,
        rel: page.rel,
        subtitle: render.walkSubtitle,
        walk: render.mainSvg === "" ? null : page.page,
    };
};

export const renderOne = function renderOne(page: HexPage, ctx: RenderContext): PageOutput {
    const label = page.rel === "" ? ctx.title : pageLabel(ctx.title, page.rel);
    const files = new Set(page.inlined.map((entry) => entry.rel));
    const symbols = ctx.insight.symbols.filter((stat) => files.has(stat.file));
    const isRoot = page.rel === "";
    const findings = ctx.findings.filter((finding) => (finding.file === "" ? isRoot : files.has(finding.file)));
    const nested = page.drilled.map((dir) => nestedFor(dir, ctx));
    const nestedFlags = new Map(
        nested
            .filter((item) => item.flagged)
            .map((item) => [keyOf(item.node.file ?? "", item.node.name ?? ""), item.severity]),
    );
    const render = toPageRender(page, ctx, { findings, label, nested, nestedFlags, symbols });
    return {
        html: renderPage(render),
        mainCells: render.mainCells,
        mainSvg: render.mainSvg,
        nestedCells: render.nestedCells,
        nestedSvg: render.nestedSvg,
        report: toReportPage(page, ctx, render, files),
    };
};

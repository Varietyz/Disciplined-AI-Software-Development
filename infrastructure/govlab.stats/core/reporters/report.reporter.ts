import { AUTHORED_ROLES, EXCLUDED_ORDER } from "#configuration/constants/source.constants";
import type { Derived, ReportInput } from "#types/report.types";
import { bucketOf, deriveMetrics } from "#core/converters/metric.converter";
import { humanBytes, num } from "#core/formatters/metric.formatter";
import type { AppStats } from "#types/site.types";
import type { GitStats } from "#types/vcs.types";
import type { State } from "#types/source.types";
import { abstractionSection } from "#core/reporters/metric.reporter";
import { appSection } from "#core/reporters/site.reporter";
import { interactionSection } from "#core/reporters/dependency.reporter";
import path from "node:path";
import { taxonomySection } from "#core/reporters/taxonomy.reporter";
import { verificationSubsections } from "#core/reporters/validation.reporter";

const headerSection = function headerSection(input: ReportInput): string[] {
    const gate = input.verify.available
        ? `gate \`${input.verify.label}\` ${input.verify.ok ? "passing" : "failing"} (${num(input.verify.totals.failed)}/${num(input.verify.totals.steps)})`
        : "gate not recorded";
    const taxonomy = `taxonomy over ${num(input.taxonomy.roots.length)} governed roots`;
    return [
        "---",
        "type: reference",
        "name: codebase-stats",
        "summary: The generated codebase census — authored source, taxonomy conformance, workspace members, governed modules, git history and the derived ratios behind them.",
        "concern: workspace",
        "---",
        "",
        "# Codebase Statistics",
        "",
        `> ${taxonomy} · ${gate}`,
        "",
    ];
};

const authoredRows = function authoredRows(state: State): string[] {
    return AUTHORED_ROLES.map((role) => {
        const bucket = bucketOf(state.authored, role);
        return `| ${role} | ${num(bucket.files)} | ${num(bucket.code)} | ${num(bucket.blank)} | ${humanBytes(bucket.bytes)} |`;
    });
};

const excludedRows = function excludedRows(state: State): string[] {
    return EXCLUDED_ORDER.map((kind) => {
        const bucket = bucketOf(state.excluded, kind);
        const lines = kind === "binary" ? "—" : num(bucket.code);
        return `| ${kind} | ${num(bucket.files)} | ${lines} | ${humanBytes(bucket.bytes)} |`;
    });
};

const unclassifiedRows = function unclassifiedRows(state: State): string[] {
    const rows = [...state.unclassified.entries()].toSorted((a, b) => b[1].files - a[1].files);
    if (rows.length === 0) {
        return [];
    }
    return [
        "| Unclassified extension | Files | Lines |",
        "| --- | ---: | ---: |",
        ...rows.map(([ext, bucket]) => `| \`${ext}\` | ${num(bucket.files)} | ${num(bucket.code)} |`),
        "",
    ];
};

const existenceSection = function existenceSection(input: ReportInput, derived: Derived): string[] {
    const { state, workspace, docs, git, memory, graph } = input;
    return [
        "## I. Existence",
        "",
        "### Authored",
        "",
        "| Role | Files | Lines | Blank | Size |",
        "| --- | ---: | ---: | ---: | ---: |",
        ...authoredRows(state),
        `| **total** | **${num(derived.authoredFiles)}** | **${num(derived.authoredLines)}** | **${num(state.lines.blank)}** | |`,
        "",
        "### Excluded",
        "",
        "| Excluded | Files | Lines | Size |",
        "| --- | ---: | ---: | ---: |",
        ...excludedRows(state),
        "",
        ...unclassifiedRows(state),
        "### Entities",
        "",
        "| Entity | Count |",
        "| --- | ---: |",
        `| workspace members | ${num(input.packages.length)} |`,
        `| governed modules | ${num(workspace.total)} |`,
        `| taxonomy-governed roots | ${num(input.taxonomy.roots.length)} |`,
        `| internal packages | ${num(graph.nodeCount)} |`,
        `| test files | ${num(state.testFiles)} |`,
        `| doc-arch documents | ${num(docs.total)} |`,
        `| memory files | ${memory.present ? num(memory.files) : "n/a"} |`,
        `| commits on \`${git?.branch ?? "(no repo)"}\` | ${git ? num(git.commits) : "0"} |`,
        "",
        "### Derived inventories",
        "",
        "| Inventory | Count | Producer |",
        "| --- | ---: | --- |",
        `| code definitions | ${num(input.analysis.definitions)} | \`${input.analysis.producer}\` |`,
        `| call-graph edges | ${num(input.analysis.edges)} | \`${input.analysis.producer}\` |`,
        `| lint rules catalogued | ${num(input.quality.totalRules)} | \`${input.quality.producer}\` |`,
        `| canonical concepts | ${num(input.quality.concepts)} | \`${input.quality.producer}\` |`,
        "",
    ];
};

const arrangementSection = function arrangementSection(state: State, derived: Derived, app: AppStats): string[] {
    return [
        "## II. Arrangement",
        "",
        "### Areas",
        "",
        "| Area | Files | Lines | Size |",
        "| --- | ---: | ---: | ---: |",
        ...derived.areaRows.map(
            ([area, bucket]) =>
                `| \`${area}\` | ${num(bucket.files)} | ${num(bucket.code)} | ${humanBytes(bucket.bytes)} |`,
        ),
        "",
        "### Shape",
        "",
        "| Measure | Lines |",
        "| --- | ---: |",
        `| mean | ${num(derived.avgLines)} |`,
        `| median | ${num(derived.medianLines)} |`,
        `| 90th percentile | ${num(derived.p90Lines)} |`,
        `| largest | ${num(derived.largestLines)} |`,
        `| max directory depth | ${num(state.maxDepth)} |`,
        "",
        "### Largest source files",
        "",
        "| # | File | Lines |",
        "| ---: | --- | ---: |",
        ...derived.topLargest.map(
            (entry, index) => `| ${index + 1} | \`${entry.path.split(path.sep).join("/")}\` | ${num(entry.lines)} |`,
        ),
        "",
        ...appSection(app),
    ];
};

const dynamicsSection = function dynamicsSection(git: GitStats | null): string[] {
    if (git === null) {
        return ["## III. Dynamics", "", "| Metric | Value |", "| --- | --- |", "| repository | none |", ""];
    }
    return [
        "## III. Dynamics",
        "",
        "| Metric | Value |",
        "| --- | --- |",
        `| branch | \`${git.branch ?? "?"}\` |`,
        `| HEAD | \`${git.head ?? "?"}\` |`,
        `| commits | ${num(git.commits)} |`,
        `| tracked files | ${num(git.tracked)} |`,
        `| first commit | ${git.firstDate ?? "?"} |`,
        `| latest commit | ${git.lastDate ?? "?"} |`,
        `| contributors | ${num(git.contributors.length)} |`,
        "",
    ];
};

export const renderReport = function renderReport(input: ReportInput): string {
    const derived = deriveMetrics(input.state);
    return [
        ...headerSection(input),
        ...existenceSection(input, derived),
        ...arrangementSection(input.state, derived, input.app),
        ...dynamicsSection(input.git),
        ...interactionSection(input.graph, input.analysis),
        "## V. Abstraction",
        "",
        ...taxonomySection(input.taxonomy),
        ...abstractionSection(input, derived),
        ...verificationSubsections(input.verify, input.activeRules, input.typescript),
    ].join("\n");
};

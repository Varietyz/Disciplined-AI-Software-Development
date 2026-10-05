import type { Derived, ReportInput } from "#types/report.types";
import { humanBytes, num, pct } from "#core/formatters/metric.formatter";
import type { DocArchStats } from "#types/document.types";
import type { FindingsStats } from "#types/pattern.types";
import type { MemoryStats } from "#types/agent.types";
import type { QualityStats } from "#types/catalog.types";
import type { WorkspaceStats } from "#types/manifest.types";

const COUNT_TABLE_DIVIDER = "| --- | ---: |";

const sortedCounts = function sortedCounts(map: Map<string, number>): [string, number][] {
    return [...map.entries()].toSorted((a, b) => b[1] - a[1]);
};

const mapRows = function mapRows(map: Map<string, number>, code: (key: string) => string): string[] {
    return sortedCounts(map).map(([key, count]) => `| ${code(key)} | ${num(count)} |`);
};

const fileTypeLines = function fileTypeLines(derived: Derived): string[] {
    return [
        "### File-type mix",
        "",
        "| Extension | Files | Lines | Blank | Size |",
        "| --- | ---: | ---: | ---: | ---: |",
        ...derived.extRows.map(
            ([ext, bucket]) =>
                `| \`${ext}\` | ${num(bucket.files)} | ${num(bucket.code)} | ${num(bucket.blank)} | ${humanBytes(bucket.bytes)} |`,
        ),
        "",
    ];
};

const ratioLines = function ratioLines(input: ReportInput, derived: Derived): string[] {
    const { workspace, memory, taxonomy } = input;
    const sourceTotal = derived.sourceLines + derived.sourceBlank;
    const sourceFiles = input.state.authored.get("source")?.files ?? 0;
    const taxonomyRows = [
        `| taxonomy conformance | ${pct(taxonomy.totals.conformant, taxonomy.totals.assessed)} | ${num(taxonomy.totals.conformant)} of ${num(taxonomy.totals.assessed)} governed |`,
        `| over depth cap | ${pct(taxonomy.totals.overCap, taxonomy.totals.assessed)} | ${num(taxonomy.totals.overCap)} of ${num(taxonomy.totals.assessed)} |`,
        `| at container root | ${pct(taxonomy.totals.atRoot, taxonomy.totals.assessed)} | ${num(taxonomy.totals.atRoot)} of ${num(taxonomy.totals.assessed)} |`,
    ];
    return [
        "### Ratios",
        "",
        "| Ratio | Value | Of |",
        "| --- | ---: | --- |",
        `| blank-line share | ${pct(derived.sourceBlank, sourceTotal)} | ${num(derived.sourceBlank)} of ${num(sourceTotal)} source lines |`,
        `| test files | ${pct(input.state.testFiles, sourceFiles)} | ${num(input.state.testFiles)} of ${num(sourceFiles)} source |`,
        ...taxonomyRows,
        `| modules with a docs block | ${pct(workspace.withDocs, workspace.total)} | ${num(workspace.withDocs)} of ${num(workspace.total)} |`,
        `| modules with a README | ${pct(workspace.withReadme, workspace.total)} | ${num(workspace.withReadme)} of ${num(workspace.total)} |`,
        `| modules declaring governance | ${pct(workspace.withGovernance, workspace.total)} | ${num(workspace.withGovernance)} of ${num(workspace.total)} |`,
        `| memory files indexed | ${pct(memory.indexEntries, memory.files)} | ${num(memory.indexEntries)} of ${num(memory.files)} |`,
        `| empty source files | ${num(derived.emptyFiles)} | — |`,
        "",
    ];
};

const memorySection = function memorySection(memory: MemoryStats): string[] {
    if (!memory.present) {
        return [];
    }
    const types = sortedCounts(memory.byType)
        .map(([key, count]) => `${key} ${num(count)}`)
        .join(" · ");
    return [
        "### Memory",
        "",
        "| Metric | Value |",
        "| --- | --- |",
        `| location | \`${memory.dir.split("\\").join("/")}\` |`,
        `| files | ${num(memory.files)} |`,
        `| index entries | ${num(memory.indexEntries)} |`,
        `| size | ${humanBytes(memory.bytes)} |`,
        `| by type | ${types} |`,
        "",
    ];
};

const docArchLines = function docArchLines(docs: DocArchStats): string[] {
    return [
        "### doc-arch",
        "",
        "| Form | Documents |",
        COUNT_TABLE_DIVIDER,
        ...mapRows(docs.byForm, (key) => `\`${key}\``),
        "",
        "| Status | Documents |",
        COUNT_TABLE_DIVIDER,
        ...mapRows(docs.byStatus, (key) => key),
        "",
    ];
};

const workspaceLines = function workspaceLines(workspace: WorkspaceStats): string[] {
    return [
        "### Governed modules",
        "",
        "| Axis | Modules |",
        COUNT_TABLE_DIVIDER,
        ...mapRows(workspace.byAxis, (key) => `\`${key}\``),
        "",
        "| Maturity | Modules |",
        COUNT_TABLE_DIVIDER,
        ...mapRows(workspace.byMaturity, (key) => key),
        "",
    ];
};

const structuralLines = function structuralLines(findings: FindingsStats, producer: string): string[] {
    const head = ["### Structural findings", "", "| Metric | Value |", "| --- | ---: |"];
    const base = [
        `| producer | \`${producer}\` |`,
        `| modules analyzed | ${num(findings.modules)} |`,
        `| findings | ${num(findings.total)} |`,
    ];
    if (findings.total === 0) {
        return [...head, ...base, ""];
    }
    return [
        ...head,
        ...base,
        `| modules with findings | ${num(findings.modulesWithFindings)} |`,
        "",
        "| Finding kind | Count |",
        COUNT_TABLE_DIVIDER,
        ...mapRows(findings.byKind, (key) => `\`${key}\``),
        "",
    ];
};

const qualityCatalogLines = function qualityCatalogLines(quality: QualityStats): string[] {
    if (!quality.available) {
        return [];
    }
    return [
        "### Rule catalog",
        "",
        "| Metric | Value |",
        COUNT_TABLE_DIVIDER,
        `| producer | \`${quality.producer}\` |`,
        `| rules | ${num(quality.totalRules)} |`,
        `| tools · ecosystems | ${num(quality.tools)} · ${num(quality.ecosystems)} |`,
        `| rules with a canonical concept | ${num(quality.canonicalMapped)} (${pct(quality.canonicalMapped, quality.totalRules)}) |`,
        `| canonical concepts | ${num(quality.concepts)} |`,
        "",
    ];
};

export const abstractionSection = function abstractionSection(input: ReportInput, derived: Derived): string[] {
    return [
        ...fileTypeLines(derived),
        ...ratioLines(input, derived),
        ...structuralLines(input.findings, input.analysis.producer),
        ...workspaceLines(input.workspace),
        ...docArchLines(input.docs),
        ...memorySection(input.memory),
        ...qualityCatalogLines(input.quality),
    ];
};

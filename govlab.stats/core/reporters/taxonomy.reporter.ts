import type { TaxonomyRootStats, TaxonomyStats } from "#types/taxonomy.types";
import { num, pct } from "#core/formatters/metric.formatter";
import { DEPTH_COLUMNS } from "#configuration/constants/taxonomy.constants";

const short = function short(root: string): string {
    const parts = root.split("/");
    return parts.length > 1 ? parts.slice(-2).join("/") : root;
};

const conformanceRows = function conformanceRows(roots: readonly TaxonomyRootStats[]): string[] {
    return roots.map(
        (entry) =>
            `| \`${short(entry.root)}\` | ${num(entry.assessed)} | ${num(entry.conformant)} | ${pct(entry.conformant, entry.assessed)} | ${num(entry.overCap)} | ${num(entry.declared)} · ${num(entry.present)} |`,
    );
};

const depthRows = function depthRows(roots: readonly TaxonomyRootStats[], cap: number): string[] {
    return roots.map((entry) => {
        const cells = DEPTH_COLUMNS.map((depth) => num(entry.depth.get(depth) ?? 0));
        const beyond = [...entry.depth.entries()]
            .filter(([depth]) => depth > cap)
            .reduce((sum, [, count]) => sum + count, 0);
        return `| \`${short(entry.root)}\` | ${cells.join(" | ")} | ${num(beyond)} |`;
    });
};

const containerRows = function containerRows(roots: readonly TaxonomyRootStats[]): string[] {
    return roots.flatMap((entry) =>
        entry.containers.map(
            (container) =>
                `| \`${short(entry.root)}\` | \`${container.name}\` | ${container.kind} | ${num(container.files)} |`,
        ),
    );
};

const conformanceTable = function conformanceTable(stats: TaxonomyStats): string[] {
    const { totals } = stats;
    return [
        "### Taxonomy conformance",
        "",
        "| Root | Assessed | Conformant | Share | Over depth cap | Containers declared · present |",
        "| --- | ---: | ---: | ---: | ---: | ---: |",
        ...conformanceRows(stats.roots),
        `| **total** | **${num(totals.assessed)}** | **${num(totals.conformant)}** | **${pct(totals.conformant, totals.assessed)}** | **${num(totals.overCap)}** | **${num(totals.declared)} · ${num(totals.present)}** |`,
        "",
    ];
};

const vocabularyTable = function vocabularyTable(stats: TaxonomyStats): string[] {
    return [
        "### Taxonomy vocabulary",
        "",
        "| Vocabulary | Declared | Used | Unused |",
        "| --- | ---: | ---: | ---: |",
        ...stats.vocabulary.map(
            (entry) => `| ${entry.name} | ${num(entry.declared)} | ${num(entry.used)} | ${num(entry.unused)} |`,
        ),
        "",
    ];
};

const layerTable = function layerTable(stats: TaxonomyStats): string[] {
    return [
        "### Layer spine",
        "",
        "| Layer | Tagged files |",
        "| --- | ---: |",
        ...stats.layers.map((entry) => `| \`${entry.layer}\` | ${num(entry.files)} |`),
        "",
    ];
};

const depthTable = function depthTable(stats: TaxonomyStats): string[] {
    return [
        "### Depth distribution",
        "",
        `| Root | ${DEPTH_COLUMNS.join(" | ")} | ${stats.maxDepth + 1}+ |`,
        `| --- | ${DEPTH_COLUMNS.map(() => "---:").join(" | ")} | ---: |`,
        ...depthRows(stats.roots, stats.maxDepth),
        "",
    ];
};

const coverageTable = function coverageTable(stats: TaxonomyStats): string[] {
    const total = stats.totals.assessed + stats.ungovernedFiles;
    return [
        "### Taxonomy coverage",
        "",
        "| Source files | Count | Share |",
        "| --- | ---: | ---: |",
        `| under a governed root | ${num(stats.totals.assessed)} | ${pct(stats.totals.assessed, total)} |`,
        `| outside every governed root | ${num(stats.ungovernedFiles)} | ${pct(stats.ungovernedFiles, total)} |`,
        "",
        "| Ungoverned area | Files |",
        "| --- | ---: |",
        ...stats.ungoverned.map((entry) => `| \`${entry.area}\` | ${num(entry.files)} |`),
        "",
    ];
};

const containerTable = function containerTable(stats: TaxonomyStats): string[] {
    return [
        "### Containers",
        "",
        "| Root | Container | Kind | Files |",
        "| --- | --- | --- | ---: |",
        ...containerRows(stats.roots),
        "",
    ];
};

export const taxonomySection = function taxonomySection(stats: TaxonomyStats): string[] {
    return [
        ...coverageTable(stats),
        ...conformanceTable(stats),
        ...vocabularyTable(stats),
        ...layerTable(stats),
        ...depthTable(stats),
        ...containerTable(stats),
    ];
};

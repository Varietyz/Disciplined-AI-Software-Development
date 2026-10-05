import type { ToolTally } from "#types/catalog.types";

const VERSION_MAX = 40;

export const coverageMarkdown = function coverageMarkdown(index: {
    byEcosystem: Record<string, number>;
    ecosystems: number;
    tools: readonly ToolTally[];
    totalRules: number;
}): string {
    const toolRows = index.tools.map(
        (tool) =>
            `| ${tool.tool} | ${tool.ecosystem} | ${String(tool.rules)} | ${tool.version.slice(0, VERSION_MAX)} |`,
    );
    const ecosystemRows = Object.entries(index.byEcosystem)
        .toSorted((a, b) => b[1] - a[1])
        .map(([ecosystem, count]) => `| ${ecosystem} | ${String(count)} |`);
    return [
        "# Rule-catalog coverage",
        "",
        `**${String(index.totalRules)} rules** across **${String(index.tools.length)} tools** and **${String(index.ecosystems)} ecosystems**.`,
        "",
        "| Tool | Ecosystem | Rules | Version |",
        "|---|---|---:|---|",
        ...toolRows,
        "",
        "## By ecosystem",
        "",
        "| Ecosystem | Rules |",
        "|---|---:|",
        ...ecosystemRows,
        "",
    ].join("\n");
};

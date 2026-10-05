import { humanBytes, num } from "#core/formatters/metric.formatter";
import type { AppStats } from "#types/site.types";

export const appSection = function appSection(app: AppStats): string[] {
    if (!app.present) {
        return [];
    }
    return [
        "### Pages",
        "",
        "| Page | Role | Files | Lines | Systems |",
        "| --- | --- | ---: | ---: | ---: |",
        ...app.pages.map(
            (page) =>
                `| \`${page.name}\` | ${page.isRoot ? "root" : "nested"} | ${num(page.files)} | ${num(page.lines)} | ${num(page.systems)} |`,
        ),
        "",
        "| Container | Subsystems |",
        "| --- | ---: |",
        ...app.subsystems.map((entry) => `| \`${entry.container}\` | ${num(entry.folders)} |`),
        "",
        "| Application | Value |",
        "| --- | ---: |",
        `| nested pages | ${num(app.pages.filter((page) => !page.isRoot).length)} |`,
        `| stylesheets | ${num(app.styles)} |`,
        `| source files | ${num(app.sourceFiles)} |`,
        `| source lines | ${num(app.sourceLines)} |`,
        `| asset files | ${num(app.assetFiles)} |`,
        `| asset size | ${humanBytes(app.assetBytes)} |`,
        "",
    ];
};

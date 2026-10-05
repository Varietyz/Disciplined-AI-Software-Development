import { diagramContextFor, loadPackage, packageName, scriptsOf, shapedContext } from "#core/factories/diagram.factory";
import { moduleDepsOf, workspaceRows } from "#core/converters/dependency.converter";
import type { Charts } from "#types/figure.types";
import type { ManifestModule } from "#types/manifest.types";
import { relativePath } from "@ssot/paths";
import { renderCharts } from "#core/formatters/figure.formatter";
import { resolve } from "node:path";
import { shapeOf } from "#core/classifiers/package.classifier";

const chartsPath = function chartsPath(moduleDir: string): string {
    return resolve(moduleDir, relativePath("moduleInfo.charts"));
};

const chartsAt = function chartsAt(moduleDir: string, content: string | null): Charts | null {
    return content === null ? null : { content, path: chartsPath(moduleDir) };
};

const aggregateCharts = function aggregateCharts(
    moduleDir: string,
    relPath: string,
    members: readonly ManifestModule[],
): Charts | null {
    const pkg = loadPackage(moduleDir);
    const content = renderCharts({
        codeGraph: null,
        keepIsolated: true,
        moduleDeps: moduleDepsOf(workspaceRows(members)),
        moduleName: packageName(pkg, relPath),
        typeGraph: { edges: [], nodes: [] },
        ...shapedContext(shapeOf(moduleDir, pkg)),
        ...scriptsOf(pkg),
    });
    return chartsAt(moduleDir, content);
};

export const renderChartsFor = async function renderChartsFor(
    moduleDir: string,
    relPath: string,
    members: readonly ManifestModule[] = [],
): Promise<Charts | null> {
    if (members.length > 0) {
        return aggregateCharts(moduleDir, relPath, members);
    }
    const context = await diagramContextFor(moduleDir, relPath);
    return context === null ? null : chartsAt(moduleDir, renderCharts(context));
};

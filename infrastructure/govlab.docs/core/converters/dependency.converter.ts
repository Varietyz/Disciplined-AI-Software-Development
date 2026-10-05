import { WORKSPACE_MAP, inventoryRow, mermaidFence } from "#configuration/strings/package.strings";
import type { DocumentDecl } from "#types/document.types";
import { MISSING_MATURITY } from "#configuration/constants/figure.constants";
import type { ManifestModule } from "#types/manifest.types";
import type { ModuleDep } from "#types/diagram.types";
import { PACKAGE_SCOPE } from "#configuration/constants/manifest.constants";
import { WORKSPACE_MAP_DOC } from "#configuration/constants/document.constants";
import type { WorkspaceRow } from "#types/figure.types";
import { depGraphOf } from "#core/converters/graph.converter";
import { emitGraph } from "#core/formatters/diagram.formatter";
import { isPlainRecord } from "#core/predicates/record.predicate";

const LINE_BREAK = "\n";

export const scopedDepNames = function scopedDepNames(value: unknown): string[] {
    return Object.keys(isPlainRecord(value) ? value : {}).filter((dep) => dep.startsWith(PACKAGE_SCOPE));
};

const rowOf = function rowOf(module: ManifestModule): WorkspaceRow {
    const { maturity } = module.manifest;
    const { name } = module.pkg;
    return {
        deps: scopedDepNames(module.pkg["dependencies"]),
        group: module.group,
        maturity: typeof maturity === "string" ? maturity : MISSING_MATURITY,
        name: typeof name === "string" ? name : module.slug,
    };
};

export const workspaceRows = function workspaceRows(modules: readonly ManifestModule[]): WorkspaceRow[] {
    return modules.map(rowOf).toSorted((left, right) => left.name.localeCompare(right.name));
};

export const moduleDepsOf = function moduleDepsOf(rows: readonly WorkspaceRow[]): ModuleDep[] {
    return rows.map((row) => ({ deps: row.deps, name: row.name }));
};

export const workspaceMapDoc = function workspaceMapDoc(modules: readonly ManifestModule[]): DocumentDecl {
    const rows = workspaceRows(modules);
    const graph = emitGraph(depGraphOf(moduleDepsOf(rows)));
    const table = [
        ...WORKSPACE_MAP.tableHead,
        ...rows.map((row) => inventoryRow(row.name, row.group, row.maturity, row.deps.length)),
    ].join(LINE_BREAK);
    return {
        ...WORKSPACE_MAP_DOC,
        body: [
            { content: mermaidFence(graph), heading: WORKSPACE_MAP.graphHeading },
            { content: table, heading: WORKSPACE_MAP.inventoryHeading },
        ],
        generated: true,
        lead: WORKSPACE_MAP.lead,
        summary: WORKSPACE_MAP.summary,
        title: WORKSPACE_MAP.title,
    };
};

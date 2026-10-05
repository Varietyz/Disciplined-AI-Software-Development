import type { DiagramContext, PackageShape } from "#types/figure.types";
import { LAYOUT_BY_SHAPE } from "#configuration/constants/figure.constants";
import type { ModuleDep } from "#types/diagram.types";
import { PACKAGE_FILE } from "#configuration/constants/document.constants";
import { deriveCodeGraph } from "#core/coordinators/code.coordinator";
import { deriveTypeGraph } from "#core/analyzers/definition.analyzer";
import { isPlainRecord } from "#core/predicates/record.predicate";
import { readJsonSafe } from "#core/loaders/base.loader";
import { resolve } from "node:path";
import { scopedDepNames } from "#core/converters/dependency.converter";
import { shapeOf } from "#core/classifiers/package.classifier";

export const loadPackage = function loadPackage(moduleDir: string): Record<string, unknown> {
    const parsed = readJsonSafe(resolve(moduleDir, PACKAGE_FILE));
    return isPlainRecord(parsed) ? parsed : {};
};

export const packageName = function packageName(pkg: Record<string, unknown>, fallback: string): string {
    const { name } = pkg;
    return typeof name === "string" ? name : fallback;
};

export const scriptsOf = function scriptsOf(pkg: Record<string, unknown>): { scripts?: Record<string, string> } {
    const declared = pkg["scripts"];
    const entries = Object.entries(isPlainRecord(declared) ? declared : {}).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
    );
    return entries.length > 0 ? { scripts: Object.fromEntries(entries) } : {};
};

export const shapedContext = function shapedContext(shape: PackageShape): Pick<DiagramContext, "layout" | "shape"> {
    return { layout: LAYOUT_BY_SHAPE[shape], shape };
};

const moduleDepsFor = function moduleDepsFor(pkg: Record<string, unknown>, name: string): ModuleDep[] {
    const deps = scopedDepNames(pkg["dependencies"]);
    return [{ deps, name }, ...deps.map((dep) => ({ deps: [], name: dep }))];
};

export const diagramContextFor = async function diagramContextFor(
    moduleDir: string,
    relPath: string,
    label?: string,
): Promise<DiagramContext | null> {
    const pkg = loadPackage(moduleDir);
    const name = label ?? packageName(pkg, relPath);
    const codeGraph = await deriveCodeGraph(moduleDir, pkg);
    const typeGraph = deriveTypeGraph(moduleDir, pkg);
    const scripts = scriptsOf(pkg);
    if (codeGraph === null && typeGraph.edges.length === 0 && scripts.scripts === undefined) {
        return null;
    }
    return {
        codeGraph,
        moduleDeps: moduleDepsFor(pkg, name),
        moduleName: name,
        typeGraph,
        ...shapedContext(shapeOf(moduleDir, pkg)),
        ...scripts,
    };
};

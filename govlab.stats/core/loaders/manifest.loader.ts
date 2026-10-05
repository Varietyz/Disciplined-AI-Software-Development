import type { ModuleInfo, WorkspaceStats } from "#types/manifest.types";
import { README_NAME, ROOT_FORM, UNSPECIFIED_MATURITY } from "#configuration/constants/document.constants";
import { arrayField, field, stringField } from "#core/selectors/field.selector";
import { MANIFEST_FILE } from "#configuration/constants/source.constants";
import { isRecord } from "#core/predicates/record.predicate";
import path from "node:path";
import { posixOf } from "#core/selectors/source.selector";
import { readJson } from "#core/loaders/data.loader";
import { readdirSafe } from "#core/loaders/folder.loader";
import { tally } from "#core/selectors/metric.selector";
import { workspaceMembers } from "#core/resolvers/package.resolver";

const moduleAt = function moduleAt(absDir: string, base: string): ModuleInfo | null {
    const files = new Set(
        readdirSafe(absDir)
            .filter((entry) => entry.isFile())
            .map((entry) => entry.name),
    );
    if (!files.has(MANIFEST_FILE)) {
        return null;
    }
    const rel = path.relative(base, absDir);
    const data = readJson(path.join(absDir, MANIFEST_FILE));
    return {
        axis: rel.split(path.sep).at(0) ?? ROOT_FORM,
        governed:
            arrayField(data, "governedBy").length > 0 || arrayField(field(data, "governance"), "principles").length > 0,
        hasDocs: isRecord(field(data, "docs")),
        hasReadme: files.has(README_NAME),
        maturity: stringField(data, "maturity") || UNSPECIFIED_MATURITY,
        rel: posixOf(rel),
    };
};

export const collectWorkspace = function collectWorkspace(root: string): WorkspaceStats {
    const modules = workspaceMembers(root)
        .map((abs) => moduleAt(abs, root))
        .filter((module): module is ModuleInfo => module !== null);
    return {
        byAxis: tally(modules, (module) => module.axis),
        byMaturity: tally(modules, (module) => module.maturity),
        missingDocs: modules.filter((module) => !module.hasDocs).map((module) => module.rel),
        missingReadme: modules.filter((module) => !module.hasReadme).map((module) => module.rel),
        total: modules.length,
        withDocs: modules.filter((module) => module.hasDocs).length,
        withGovernance: modules.filter((module) => module.governed).length,
        withReadme: modules.filter((module) => module.hasReadme).length,
    };
};

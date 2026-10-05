import {
    CONFIG_TREE,
    EXPORT_JOIN,
    EXPORT_SUFFIX,
    FOLDER_SEPARATOR,
    INFRASTRUCTURE_BRANCH,
    MANIFEST_LABEL_KEY,
    METHODOLOGY_BRANCH,
    NAME_JOIN,
    PACKAGE_EXPORTS_KEY,
    PACKAGE_LICENSE_KEY,
    PACKAGE_NAME_KEY,
    SITE_EXPORT,
    TAB_JOIN,
    TAB_OVERRIDES,
    TREE_PREFIXES,
} from "#configuration/constants/tree.constants";
import { MODULE_MANIFEST_NAME, PACKAGE_MANIFEST_NAME } from "#configuration/constants/loader.constants";
import { ROOT, paths, relativePath } from "@ssot/paths";
import { exclusionOf, isPublished } from "#core/predicates/exclusion.predicate";
import { existsSync, readFileSync } from "node:fs";
import type { AnatomyTreeDeclaration } from "@banes-lab/web/types/anatomy.types.js";
import { CONFIG_TREE_LABEL } from "@banes-lab/web/strings/folder.strings";
import type { DiskFolder } from "#types/structure.types";
import type { PackageExport } from "@banes-lab/web/types/package.types.js";
import { REPOSITORY_TREE } from "@banes-lab/web/assets/link.assets";
import { TREE_TAB } from "@banes-lab/web/ids/anatomy.ids";
import { isRecord } from "#core/selectors/base.selector";
import { join } from "node:path";
import { readTree } from "#core/loaders/structure.loader";
import { shippedEntries } from "#core/loaders/coordination.loader";
import { unlicensedTree } from "#configuration/strings/anatomy.strings";
import { workspaceMembers } from "@govlab/docs";

const manifestOf = function manifestOf(folder: string, manifest: string): Readonly<Record<string, unknown>> {
    const file = join(ROOT, ...folder.split(FOLDER_SEPARATOR), manifest);
    const parsed: unknown = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
    return isRecord(parsed) ? parsed : {};
};

const textIn = function textIn(record: Readonly<Record<string, unknown>>, key: string): string | null {
    const value = record[key];
    return typeof value === "string" && value.length > 0 ? value : null;
};

const exportsIn = function exportsIn(record: Readonly<Record<string, unknown>>): readonly PackageExport[] {
    const map = record[PACKAGE_EXPORTS_KEY];
    if (!isRecord(map)) {
        return [];
    }
    return Object.entries(map).flatMap(([key, target]) => (typeof target === "string" ? [{ key, target }] : []));
};

const overrides = new Map(Object.entries(TAB_OVERRIDES).map(([key, tab]) => [relativePath(key), tab]));

const tabOf = function tabOf(folder: string): string {
    const override = overrides.get(folder);
    if (override !== undefined) {
        return override;
    }
    const name = folder.slice(folder.lastIndexOf(FOLDER_SEPARATOR) + 1);
    const prefix = TREE_PREFIXES.find((candidate) => name.startsWith(candidate)) ?? "";
    return name.slice(prefix.length).split(NAME_JOIN).join(TAB_JOIN);
};

const exportNameOf = function exportNameOf(tab: string): string {
    return tab === TREE_TAB ? SITE_EXPORT : tab.toUpperCase().split(TAB_JOIN).join(EXPORT_JOIN) + EXPORT_SUFFIX;
};

export const publishedKeyOf = function publishedKeyOf(tab: string): string | null {
    const branch = paths[METHODOLOGY_BRANCH];
    if (!isRecord(branch)) {
        return null;
    }
    if (typeof branch[tab] === "string") {
        return `${METHODOLOGY_BRANCH}.${tab}`;
    }
    const nested = branch[INFRASTRUCTURE_BRANCH];
    return isRecord(nested) && typeof nested[tab] === "string"
        ? `${METHODOLOGY_BRANCH}.${INFRASTRUCTURE_BRANCH}.${tab}`
        : null;
};

const repositoryOf = function repositoryOf(tab: string): string | null {
    const key = publishedKeyOf(tab);
    if (key === null) {
        return null;
    }
    const root = relativePath(METHODOLOGY_BRANCH);
    return REPOSITORY_TREE + relativePath(key).slice(root.length + FOLDER_SEPARATOR.length);
};

interface TreeFacts {
    readonly folder: string;
    readonly generatedSources: boolean;
    readonly label: string;
    readonly licenseFolder: string;
    readonly tab: string;
}

const declarationOf = function declarationOf(facts: TreeFacts): AnatomyTreeDeclaration {
    const { folder, generatedSources, label, licenseFolder, tab } = facts;
    const repository = repositoryOf(tab);
    const license = textIn(manifestOf(licenseFolder, PACKAGE_MANIFEST_NAME), PACKAGE_LICENSE_KEY);
    if (repository !== null && license === null) {
        throw new Error(unlicensedTree(tab, licenseFolder));
    }
    const own = manifestOf(folder, PACKAGE_MANIFEST_NAME);
    return {
        exportName: exportNameOf(tab),
        exports: exportsIn(own),
        folder,
        generatedSources,
        label,
        license,
        packageName: textIn(own, PACKAGE_NAME_KEY),
        repository,
        tab,
    };
};

export const readDeclaredTree = function readDeclaredTree(
    declaration: AnatomyTreeDeclaration,
    pruned: (folder: string) => boolean,
): DiskFolder {
    const moduleDir = join(ROOT, declaration.folder);
    const shipped = new Set(shippedEntries(moduleDir));
    return readTree({ excluded: exclusionOf, moduleDir, pruned, root: declaration.folder, shipped });
};

const publishedIn = function publishedIn(folder: DiskFolder, generatedSources: boolean): readonly string[] {
    return [
        ...folder.files.filter((file) => isPublished(file, generatedSources)).map((file) => file.path),
        ...folder.folders.flatMap((child) => publishedIn(child, generatedSources)),
    ];
};

export const publishedPaths = function publishedPaths(
    declaration: AnatomyTreeDeclaration,
    pruned: (folder: string) => boolean,
): readonly string[] {
    return publishedIn(readDeclaredTree(declaration, pruned), declaration.generatedSources);
};

export const treeDeclarations = function treeDeclarations(): readonly AnatomyTreeDeclaration[] {
    const members = workspaceMembers(ROOT).flatMap((folder) => {
        const label = textIn(manifestOf(folder, MODULE_MANIFEST_NAME), MANIFEST_LABEL_KEY);
        return label === null
            ? []
            : [declarationOf({ folder, generatedSources: false, label, licenseFolder: folder, tab: tabOf(folder) })];
    });
    const configs = declarationOf({
        folder: relativePath(CONFIG_TREE.key),
        generatedSources: CONFIG_TREE.generatedSources,
        label: CONFIG_TREE_LABEL,
        licenseFolder: relativePath(CONFIG_TREE.licenseKey),
        tab: CONFIG_TREE.tab,
    });
    const site = members.filter((declaration) => declaration.tab === TREE_TAB);
    return [...site, ...members.filter((declaration) => declaration.tab !== TREE_TAB), configs];
};

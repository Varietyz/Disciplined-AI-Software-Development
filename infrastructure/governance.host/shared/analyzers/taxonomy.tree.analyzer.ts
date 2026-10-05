import type { PlacementFinding, TaxonomyFinding, TaxonomyReport } from "../../types/taxonomy.types.ts";
import {
    containersFor,
    isDeclaredContainer,
    isForeignContainer,
    isGeneratedFolder,
    isIgnoredName,
    isNameExempt,
    isNestedRoot,
    isSpecialContainer,
    vocabularyFor,
} from "../manifests/taxonomy.manifest.ts";
import { existsSync, readdirSync, statSync } from "node:fs";
import { fixtureMarkerOf, isTestRoot, taxonomyRoots, testMarkerOf } from "../manifests/taxonomy.root.manifest.ts";
import { namingFinding, placementFinding, testFinding } from "./taxonomy.analyzer.ts";
import { WORKSPACE_ROOT } from "../resolvers/anchor.resolver.ts";
import { join } from "node:path";

const PATH_SEPARATOR = "/";

interface Children {
    dirs: string[];
    files: string[];
}

const childrenOf = function childrenOf(relDir: string, root?: string): Children {
    const absDir = join(WORKSPACE_ROOT, relDir);
    const named = readdirSync(absDir)
        .filter((name) => !isIgnoredName(name, root))
        .toSorted((a, b) => a.localeCompare(b));
    const dirs = named.filter((name) => statSync(join(absDir, name)).isDirectory());
    return { dirs, files: named.filter((name) => !dirs.includes(name)) };
};

const filesUnder = function filesUnder(relDir: string, root?: string): string[] {
    const { dirs, files } = childrenOf(relDir, root);
    const own = files.map((name) => `${relDir}${PATH_SEPARATOR}${name}`);
    return [...own, ...dirs.flatMap((name) => filesUnder(`${relDir}${PATH_SEPARATOR}${name}`, root))];
};

const carriesMarker = function carriesMarker(basename: string, marker: string, separator: string): boolean {
    const segments = basename.split(separator);
    return segments.length > 2 && segments.at(-2) === marker;
};

export const generatedFolderFindings = function generatedFolderFindings(
    relFolder: string,
    root?: string,
): TaxonomyFinding[] {
    const vocabulary = vocabularyFor(root);
    const marker = vocabulary.generatedFolder?.marker ?? "";
    return filesUnder(relFolder, root)
        .filter(
            (path) => !carriesMarker(path.slice(path.lastIndexOf(PATH_SEPARATOR) + 1), marker, vocabulary.separator),
        )
        .map((path): TaxonomyFinding => ({
            data: { folder: relFolder, marker },
            messageId: "generatedFolderIntruder",
            path,
        }));
};

const at = function at(path: string, finding: PlacementFinding | null): TaxonomyFinding[] {
    return finding === null ? [] : [{ ...finding, path }];
};

const fileFindings = function fileFindings(path: string, root: string, special: boolean): TaxonomyFinding[] {
    const below = path.slice(root.length + 1).split(PATH_SEPARATOR);
    const basename = below.at(-1) ?? "";
    const folders = below.slice(0, -1);
    if (isTestRoot(root) || testMarkerOf(basename) !== undefined || fixtureMarkerOf(basename, root) !== undefined) {
        return at(path, testFinding(basename, folders, root));
    }
    const placement = special ? null : placementFinding(basename, folders, root);
    return [...at(path, placement), ...at(path, namingFinding(basename, folders, root))];
};

const bucketFindings = function bucketFindings(root: string, container: string, files: string[]): TaxonomyFinding[] {
    const relContainer = `${root}${PATH_SEPARATOR}${container}`;
    const nested = childrenOf(relContainer, root).dirs.map((name): TaxonomyFinding => ({
        data: { container, nested: name, root },
        messageId: "nestedInSpecial",
        path: `${relContainer}${PATH_SEPARATOR}${name}`,
    }));
    return [...nested, ...files.flatMap((path) => fileFindings(path, root, true))];
};

const containerFindings = function containerFindings(
    root: string,
    container: string,
    files: string[],
): TaxonomyFinding[] {
    if (!isDeclaredContainer(root, container)) {
        const data = { container, declared: containersFor(root).join(", "), root };
        return [{ data, messageId: "undeclaredContainer", path: `${root}${PATH_SEPARATOR}${container}` }];
    }
    if (isSpecialContainer(root, container)) {
        const direct = files.filter(
            (path) => path.split(PATH_SEPARATOR).length === root.split(PATH_SEPARATOR).length + 2,
        );
        return bucketFindings(root, container, direct);
    }
    return files.flatMap((path) => fileFindings(path, root, false));
};

const rootReport = function rootReport(root: string): TaxonomyReport {
    if (!existsSync(join(WORKSPACE_ROOT, root))) {
        return { assessed: 0, findings: [{ data: { root }, messageId: "missingRoot", path: root }] };
    }
    const children = childrenOf(root, root);
    const outputs = children.dirs.filter((name) => isGeneratedFolder(name, root));
    const dirs = children.dirs.filter(
        (name) => !isNestedRoot(root, name) && !isForeignContainer(root, name) && !outputs.includes(name),
    );
    const missing = containersFor(root)
        .filter((name) => !dirs.includes(name) && !isTestRoot(root))
        .map((container): TaxonomyFinding => ({
            data: { container, root },
            messageId: "missingContainer",
            path: root,
        }));
    const loose = children.files
        .filter((name) => !isNameExempt(name, root))
        .map((name): TaxonomyFinding => ({
            data: { name, root },
            messageId: "looseFileAtRoot",
            path: `${root}${PATH_SEPARATOR}${name}`,
        }));
    const perContainer = dirs.map((name) => filesUnder(`${root}${PATH_SEPARATOR}${name}`, root));
    const findings = dirs.flatMap((name, index) => containerFindings(root, name, perContainer[index] ?? []));
    const generated = outputs.flatMap((name) => generatedFolderFindings(`${root}${PATH_SEPARATOR}${name}`, root));
    const assessed = loose.length + perContainer.reduce((sum, files) => sum + files.length, 0);
    return { assessed, findings: [...missing, ...loose, ...findings, ...generated] };
};

export const taxonomyReport = function taxonomyReport(): TaxonomyReport {
    const reports = taxonomyRoots()
        .toSorted((a, b) => a.localeCompare(b))
        .map(rootReport);
    return {
        assessed: reports.reduce((sum, report) => sum + report.assessed, 0),
        findings: reports.flatMap((report) => report.findings),
    };
};

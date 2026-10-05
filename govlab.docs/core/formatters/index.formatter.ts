import type { ByGroup, PackageInfo } from "#types/index.types";
import {
    GROUP_ROLES,
    INDEX_HEADINGS,
    INDEX_TABLES,
    INDEX_TEXT,
    composeLine,
    composesPeers,
    concernRow,
    groupRow,
    indexSummary,
    inventoryRow,
    reproduceNote,
    standaloneLine,
} from "#configuration/strings/index.strings";
import { ENTRYPOINT_FILES } from "#configuration/constants/invocation.constants";
import { relativePath } from "@ssot/paths";

const MIN_COMPOSER_DEPS = 2;
const PURPOSE_TREE_MAX = 80;
const CONCERN_MAX = 110;
const LINE_BREAK = "\n";
const BLOCK_BREAK = "\n\n";
const FENCE = "```";
const SENTENCE_END = ".";
const PEER_JOIN = "` + `";
const NO_SIBLINGS = "—";
const BRANCH = "├── ";
const LAST_BRANCH = "└── ";
const PIPE_INDENT = "│   ";
const BLANK_INDENT = "    ";
const FOLDER_MARK = "/";
const PURPOSE_JOIN = " — ";

export const roleOf = function roleOf(group: string): string {
    if (group === relativePath("app.root")) {
        return GROUP_ROLES.application;
    }
    return group === relativePath("govlab.root") ? GROUP_ROLES.tooling : GROUP_ROLES.unclassified;
};

const branchAt = function branchAt(isLast: boolean): string {
    return isLast ? LAST_BRANCH : BRANCH;
};

const firstSentence = function firstSentence(text: string): string {
    return text.split(SENTENCE_END)[0] ?? "";
};

const sortedGroups = function sortedGroups(byGroup: ByGroup): string[] {
    return Object.keys(byGroup).toSorted((left, right) => left.localeCompare(right));
};

const treeLine = function treeLine(prefix: string, pkg: PackageInfo, isLast: boolean): string {
    const tag = pkg.siblingDeps.length >= MIN_COMPOSER_DEPS ? composesPeers(pkg.siblingDeps.length) : "";
    const purpose =
        pkg.purpose === null ? "" : `${PURPOSE_JOIN}${firstSentence(pkg.purpose).slice(0, PURPOSE_TREE_MAX)}`;
    return `${prefix}${branchAt(isLast)}${pkg.slug}${tag}${purpose}`;
};

const groupTree = function groupTree(group: string, packages: readonly PackageInfo[], isLastGroup: boolean): string[] {
    const prefix = isLastGroup ? BLANK_INDENT : PIPE_INDENT;
    return [
        `${branchAt(isLastGroup)}${group}${FOLDER_MARK}`,
        ...packages.map((pkg, index) => treeLine(prefix, pkg, index === packages.length - 1)),
    ];
};

const renderTree = function renderTree(byGroup: ByGroup): string {
    const groups = sortedGroups(byGroup);
    return [
        INDEX_TEXT.treeRoot,
        ...groups.flatMap((group, index) => groupTree(group, byGroup[group] ?? [], index === groups.length - 1)),
    ].join(LINE_BREAK);
};

const dependencyBlock = function dependencyBlock(pkg: PackageInfo): string {
    const lines = pkg.siblingDeps.map((dep, index) => `${branchAt(index === pkg.siblingDeps.length - 1)}${dep}`);
    return [pkg.name, ...lines].join(LINE_BREAK);
};

const renderDependencies = function renderDependencies(packages: readonly PackageInfo[]): string {
    const composers = packages.filter((pkg) => pkg.siblingDeps.length > 0);
    return composers.length === 0 ? INDEX_TEXT.noComposers : composers.map(dependencyBlock).join(BLOCK_BREAK);
};

const renderInventory = function renderInventory(packages: readonly PackageInfo[]): string {
    const rows = packages.map((pkg) =>
        inventoryRow({
            exports: pkg.barrelExports,
            group: pkg.group,
            loc: pkg.sourceLoc,
            name: pkg.name,
            siblings: pkg.siblingDeps.length === 0 ? NO_SIBLINGS : String(pkg.siblingDeps.length),
            sources: pkg.sourceFiles,
        }),
    );
    return [...INDEX_TABLES.inventory, ...rows].join(LINE_BREAK);
};

const concernOf = function concernOf(pkg: PackageInfo): string {
    return (pkg.purpose === null ? pkg.description : firstSentence(pkg.purpose)).slice(0, CONCERN_MAX);
};

const renderConcerns = function renderConcerns(packages: readonly PackageInfo[]): string {
    return [...INDEX_TABLES.concerns, ...packages.map((pkg) => concernRow(concernOf(pkg), pkg.name))].join(LINE_BREAK);
};

const renderGroups = function renderGroups(byGroup: ByGroup): string {
    const rows = sortedGroups(byGroup).map((group) => groupRow(group, roleOf(group), (byGroup[group] ?? []).length));
    return [...INDEX_TABLES.groups, ...rows].join(LINE_BREAK);
};

const summaryOf = function summaryOf(packages: readonly PackageInfo[]): string {
    return indexSummary({
        composers: packages.filter((pkg) => pkg.siblingDeps.length >= MIN_COMPOSER_DEPS).length,
        exports: packages.reduce((sum, pkg) => sum + pkg.barrelExports, 0),
        leaves: packages.filter((pkg) => pkg.siblingDeps.length === 0).length,
        loc: packages.reduce((sum, pkg) => sum + pkg.sourceLoc, 0),
        packages: packages.length,
    });
};

const compositionLines = function compositionLines(packages: readonly PackageInfo[]): string[] {
    const composers = packages.filter((pkg) => pkg.siblingDeps.length >= MIN_COMPOSER_DEPS);
    const leaves = packages.filter((pkg) => pkg.siblingDeps.length === 0);
    return [
        INDEX_HEADINGS.composition,
        "",
        INDEX_TEXT.composeIntro,
        "",
        ...composers.map((pkg) => composeLine(pkg.name, pkg.siblingDeps.join(PEER_JOIN))),
        "",
        INDEX_TEXT.standaloneIntro,
        "",
        ...leaves.map((pkg) =>
            standaloneLine(pkg.name, pkg.purpose === null ? pkg.description : firstSentence(pkg.purpose)),
        ),
    ];
};

export const renderIndexMarkdown = function renderIndexMarkdown(
    packages: readonly PackageInfo[],
    byGroup: ByGroup,
): string {
    const entrypoint = [relativePath("govlab.docs.entrypoints"), ENTRYPOINT_FILES.index].join(FOLDER_MARK);
    return [
        INDEX_HEADINGS.title,
        "",
        summaryOf(packages),
        "",
        INDEX_HEADINGS.groups,
        "",
        renderGroups(byGroup),
        "",
        INDEX_HEADINGS.tree,
        "",
        FENCE,
        renderTree(byGroup),
        FENCE,
        "",
        INDEX_HEADINGS.dependencies,
        "",
        FENCE,
        renderDependencies(packages),
        FENCE,
        "",
        INDEX_HEADINGS.inventory,
        "",
        renderInventory(packages),
        "",
        INDEX_HEADINGS.concerns,
        "",
        INDEX_TEXT.concernsNote,
        "",
        renderConcerns(packages),
        "",
        ...compositionLines(packages),
        "",
        INDEX_HEADINGS.reproduce,
        "",
        reproduceNote(entrypoint),
        "",
    ].join(LINE_BREAK);
};

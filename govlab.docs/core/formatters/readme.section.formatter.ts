import type {
    ApiNote,
    ConceptRecord,
    Domain,
    FlatRecord,
    PackageJson,
    PrincipleRecord,
    PublicMember,
    RenderContext,
    RepoMetrics,
} from "#types/readme.types";
import {
    README_HEADINGS,
    README_TEXT,
    RELATION_LABELS,
    REPO_LABELS,
    metricsLine,
} from "#configuration/strings/readme.strings";
import { bullets, titleCase } from "#core/formatters/markdown.formatter";

const METRIC_SEPARATOR = " · ";
const LIST_SEPARATOR = ", ";
const NOTE_JOIN = " — ";
const RULE = "---";
const TICK = "`";

const byText = function byText(left: string, right: string): number {
    return left.localeCompare(right);
};

const surfaceLine = function surfaceLine(member: PublicMember, notes: ReadonlyMap<string, string>): string {
    const head =
        member.signature && member.signature !== member.name
            ? `\`${member.signature}\``
            : `\`${member.name}\` (${member.kind})`;
    const note = notes.get(member.name) ?? "";
    return `- ${head}${note.length > 0 ? NOTE_JOIN + note : ""}`;
};

const axisBlock = function axisBlock(
    axis: string,
    surface: readonly PublicMember[],
    notes: ReadonlyMap<string, string>,
): string {
    const lines = surface.filter((member) => member.axis === axis).map((member) => surfaceLine(member, notes));
    return `### ${titleCase(axis)}\n\n${lines.join("\n")}`;
};

export const renderApi = function renderApi(surface: readonly PublicMember[], apiNotes?: readonly ApiNote[]): string {
    const notes = new Map((apiNotes ?? []).map((note) => [note.name, note.note]));
    const axes = [...new Set(surface.map((member) => member.axis))];
    if (axes.length <= 1) {
        return surface.map((member) => surfaceLine(member, notes)).join("\n");
    }
    return axes.map((axis) => axisBlock(axis, surface, notes)).join("\n\n");
};

export const renderDeps = function renderDeps(pkg: PackageJson): string {
    const deps = Object.keys(pkg.dependencies ?? {}).toSorted(byText);
    if (deps.length > 0) {
        return bullets(deps.map((dep) => `\`${dep}\``));
    }
    return Object.keys(pkg).length === 0 ? README_TEXT.noLocalPackage : README_TEXT.leaf;
};

const relationClause = function relationClause(label: string, list: readonly string[] | undefined): string {
    return list !== undefined && list.length > 0 ? ` ${label} ${list.join(LIST_SEPARATOR)}.` : "";
};

const principleLine = function principleLine(record: PrincipleRecord): string {
    const relations = [
        relationClause(RELATION_LABELS.reinforces, record.reinforces),
        relationClause(RELATION_LABELS.enables, record.enables),
        relationClause(RELATION_LABELS.tensions, record.tensions_with),
        relationClause(RELATION_LABELS.conflicts, record.conflicts_with),
    ].join("");
    return `- **${record.name}** — _${record.category}_ · ${record.severity}.${relations}`;
};

export const renderPrinciples = function renderPrinciples(records: readonly PrincipleRecord[]): string {
    return `## ${README_HEADINGS.principles}\n\n${README_TEXT.principlesIntro}\n\n${records.map(principleLine).join("\n")}`;
};

export const renderConcepts = function renderConcepts(records: readonly ConceptRecord[]): string {
    const lines = records
        .toSorted((left, right) => byText(left.dimension, right.dimension) || byText(left.id, right.id))
        .map((record) => `- **${record.id}** — _${record.dimension}_`);
    return `## ${README_HEADINGS.concepts}\n\n${README_TEXT.conceptsIntro}\n\n${lines.join("\n")}`;
};

export const renderDomains = function renderDomains(records: readonly Domain[]): string {
    const byMeta = new Map<string, string[]>();
    for (const domain of records) {
        byMeta.set(domain.meta, [...(byMeta.get(domain.meta) ?? []), domain.sub]);
    }
    const lines = [...byMeta]
        .toSorted((left, right) => byText(left[0], right[0]))
        .map(([meta, subs]) => `- **${meta}** — ${subs.toSorted(byText).join(LIST_SEPARATOR)}`);
    return `## ${README_HEADINGS.domains}\n\n${README_TEXT.domainsIntro}\n\n${lines.join("\n")}`;
};

const textRow = function textRow(label: string, value: string | undefined, code: boolean): string[] {
    if (value === undefined || value.length === 0) {
        return [];
    }
    const shown = code ? TICK + value + TICK : value;
    return [`- **${label}**: ${shown}`];
};

const numberRow = function numberRow(label: string, value: number | undefined): string[] {
    return value === undefined ? [] : [`- **${label}**: ${value}`];
};

const languageRow = function languageRow(languages: FlatRecord | undefined): string[] {
    const entries = Object.entries(languages ?? {});
    if (entries.length === 0) {
        return [];
    }
    const counts = entries.map(([extension, count]) => `${extension} ${count}`).join(LIST_SEPARATOR);
    return [`- **${REPO_LABELS.languages}**: ${counts}`];
};

export const renderRepoMetrics = function renderRepoMetrics(repo: RepoMetrics | null): string {
    if (!repo) {
        return "";
    }
    const rows = [
        ...textRow(REPO_LABELS.branch, repo.branch, true),
        ...numberRow(REPO_LABELS.commits, repo.commits),
        ...numberRow(REPO_LABELS.contributors, repo.contributors),
        ...textRow(REPO_LABELS.created, repo.created, false),
        ...textRow(REPO_LABELS.lastCommit, repo.lastCommit, false),
        ...textRow(REPO_LABELS.latestTag, repo.latestTag, true),
        ...numberRow(REPO_LABELS.files, repo.files),
        ...languageRow(repo.languages),
    ];
    if (rows.length === 0) {
        return "";
    }
    return `## ${README_HEADINGS.repository}\n\n${README_TEXT.repositoryNote}\n\n${rows.join("\n")}`;
};

export const renderMetrics = function renderMetrics(context: RenderContext): string {
    const deps = Object.keys(context.pkg.dependencies ?? {}).length;
    const stats = [
        ...(context.maturity === "" ? [] : [context.maturity]),
        ...metricsLine(context.surface.length, deps, context.principles.length, context.concepts.length),
    ];
    return `${RULE}\n\n${stats.join(METRIC_SEPARATOR)}`;
};

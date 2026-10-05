import type { FlatRecord, RepoMetrics } from "#types/readme.types";
import {
    INSIDE_WORK_TREE,
    NO_EXTENSION,
    TOP_LANGUAGES,
    VCS_BINARY,
    VCS_QUERIES,
} from "#configuration/constants/vcs.constants";
import { extname } from "node:path";
import { spawnSync } from "node:child_process";

const LINE_BREAK = "\n";
const EXTENSION_OFFSET = 1;

const vcsQuery = function vcsQuery(cwd: string, args: readonly string[]): string {
    const result = spawnSync(VCS_BINARY, [...args], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return result.status === 0 ? result.stdout.trim() : "";
};

const linesOf = function linesOf(text: string): string[] {
    return text.split(LINE_BREAK).filter((line) => line.length > 0);
};

const extensionOf = function extensionOf(file: string): string {
    const extension = extname(file);
    return extension.length > EXTENSION_OFFSET ? extension.slice(EXTENSION_OFFSET) : NO_EXTENSION;
};

const byCountThenName = function byCountThenName(left: [string, number], right: [string, number]): number {
    const byCount = right[1] - left[1];
    return byCount === 0 ? left[0].localeCompare(right[0]) : byCount;
};

const languageBuckets = function languageBuckets(files: readonly string[]): FlatRecord {
    const counts = new Map<string, number>();
    for (const file of files) {
        const extension = extensionOf(file);
        counts.set(extension, (counts.get(extension) ?? 0) + 1);
    }
    const top = [...counts].toSorted(byCountThenName).slice(0, TOP_LANGUAGES);
    return Object.fromEntries(top.map(([extension, count]) => [extension, String(count)]));
};

const optionalField = function optionalField(key: string, value: string | undefined): FlatRecord {
    return value !== undefined && value.length > 0 ? { [key]: value } : {};
};

const fileMetrics = function fileMetrics(files: readonly string[]): RepoMetrics {
    return files.length > 0 ? { files: files.length, languages: languageBuckets(files) } : {};
};

const gitMetrics = function gitMetrics(dir: string): RepoMetrics {
    const authors = linesOf(vcsQuery(dir, VCS_QUERIES.authors));
    const commits = vcsQuery(dir, VCS_QUERIES.commits);
    return {
        ...optionalField("branch", vcsQuery(dir, VCS_QUERIES.branch)),
        ...(commits.length > 0 ? { commits: Number(commits) } : {}),
        ...(authors.length > 0 ? { contributors: new Set(authors).size } : {}),
        ...optionalField("created", linesOf(vcsQuery(dir, VCS_QUERIES.created)).at(-1)),
        ...fileMetrics(linesOf(vcsQuery(dir, VCS_QUERIES.tracked))),
        ...optionalField("lastCommit", vcsQuery(dir, VCS_QUERIES.lastCommit)),
        ...optionalField("latestTag", vcsQuery(dir, VCS_QUERIES.latestTag)),
    };
};

export const deriveRepoMetrics = function deriveRepoMetrics(dir: string): RepoMetrics | null {
    if (vcsQuery(dir, VCS_QUERIES.inside) !== INSIDE_WORK_TREE) {
        return null;
    }
    const metrics = gitMetrics(dir);
    return Object.keys(metrics).length > 0 ? metrics : null;
};

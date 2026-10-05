import type { Contributor, GitStats, RepoStats } from "#types/vcs.types";
import {
    INSIDE_WORK_TREE,
    SHORTLOG_SEPARATOR,
    VCS_BINARY,
    VCS_QUERIES,
    WORKSPACE_LABEL,
} from "#configuration/constants/vcs.constants";
import { LINE_BREAK } from "#configuration/constants/source.constants";
import { spawnSync } from "node:child_process";

const vcsQuery = function vcsQuery(cwd: string, args: readonly string[]): string | null {
    const result = spawnSync(VCS_BINARY, [...args], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return result.status === 0 ? result.stdout.trim() : null;
};

const parseShortlog = function parseShortlog(text: string | null): Contributor[] {
    return (text ?? "").split(LINE_BREAK).flatMap((line): Contributor[] => {
        const trimmed = line.trim();
        const tab = trimmed.indexOf(SHORTLOG_SEPARATOR);
        if (tab === -1) {
            return [];
        }
        const count = Number(trimmed.slice(0, tab).trim());
        return [{ count: Number.isFinite(count) ? count : 0, who: trimmed.slice(tab + 1).trim() }];
    });
};

const repoStats = function repoStats(cwd: string): RepoStats | null {
    if (vcsQuery(cwd, VCS_QUERIES.inside) !== INSIDE_WORK_TREE) {
        return null;
    }
    const tracked = vcsQuery(cwd, VCS_QUERIES.tracked);
    return {
        branch: vcsQuery(cwd, VCS_QUERIES.branch),
        commits: Number(vcsQuery(cwd, VCS_QUERIES.commits) ?? "0"),
        firstDate: vcsQuery(cwd, VCS_QUERIES.firstDate),
        head: vcsQuery(cwd, VCS_QUERIES.head),
        label: WORKSPACE_LABEL,
        lastDate: vcsQuery(cwd, VCS_QUERIES.lastDate),
        shortlog: vcsQuery(cwd, VCS_QUERIES.shortlog),
        tracked: tracked === null ? 0 : tracked.split(LINE_BREAK).filter((line) => line.length > 0).length,
    };
};

export const collectGit = function collectGit(root: string): GitStats | null {
    const repo = repoStats(root);
    if (repo === null) {
        return null;
    }
    return { ...repo, contributors: parseShortlog(repo.shortlog).toSorted((a, b) => b.count - a.count) };
};

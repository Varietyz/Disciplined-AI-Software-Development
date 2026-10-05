export const VCS_BINARY = "git";

export const VCS_DIRECTORY = ".git";

export const INSIDE_WORK_TREE = "true";

export const TOP_LANGUAGES = 6;

export const NO_EXTENSION = "(none)";

export const VCS_QUERIES = {
    authors: ["log", "--format=%ae"],
    branch: ["rev-parse", "--abbrev-ref", "HEAD"],
    commits: ["rev-list", "--count", "HEAD"],
    created: ["log", "--max-parents=0", "--format=%cI"],
    inside: ["rev-parse", "--is-inside-work-tree"],
    lastCommit: ["log", "-1", "--format=%cI"],
    latestTag: ["describe", "--tags", "--abbrev=0"],
    tracked: ["ls-files"],
} as const;

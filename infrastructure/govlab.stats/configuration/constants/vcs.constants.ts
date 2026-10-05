export const VCS_BINARY = "git";

export const WORKSPACE_LABEL = "banes-lab";

export const INSIDE_WORK_TREE = "true";

export const SHORTLOG_SEPARATOR = "\t";

export const VCS_QUERIES = {
    branch: ["rev-parse", "--abbrev-ref", "HEAD"],
    commits: ["rev-list", "--count", "HEAD"],
    firstDate: ["log", "--reverse", "--max-parents=0", "-1", "--format=%as"],
    head: ["rev-parse", "--short", "HEAD"],
    inside: ["rev-parse", "--is-inside-work-tree"],
    lastDate: ["log", "-1", "--format=%as"],
    shortlog: ["shortlog", "-sne", "--all"],
    tracked: ["ls-files"],
} as const;

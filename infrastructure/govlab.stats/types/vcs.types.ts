export interface RepoStats {
    branch: string | null;
    commits: number;
    firstDate: string | null;
    head: string | null;
    label: string;
    lastDate: string | null;
    shortlog: string | null;
    tracked: number;
}

export interface Contributor {
    count: number;
    who: string;
}

export interface GitStats extends RepoStats {
    contributors: Contributor[];
}

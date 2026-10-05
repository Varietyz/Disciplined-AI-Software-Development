export const CENSUS_COMMAND = "npm run codebase:stats --";

export const CENSUS_SUMMARY =
    "Walk the workspace, measure every surface the census covers, and write the generated codebase statistics document.";

export const wroteCensus = function wroteCensus(target: string): string {
    return `codebase:stats wrote ${target}`;
};

export const authoredLine = function authoredLine(files: string, lines: string, size: string, modules: string): string {
    return `  ${files} authored files · ${lines} lines · ${size} · ${modules} governed modules`;
};

export const taxonomyLine = function taxonomyLine(conformant: string, assessed: string, ungoverned: string): string {
    return `  taxonomy ${conformant}/${assessed} conformant · ${ungoverned} ungoverned`;
};

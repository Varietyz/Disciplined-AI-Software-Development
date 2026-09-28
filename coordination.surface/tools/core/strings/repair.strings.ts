export const unclaimedRegion = function unclaimedRegion(path: string): string {
    return (
        `REFUSED  ${path} is in a folder only runs write, and every run there holds a claim; this write holds ` +
        "none. Start it through a run so it holds a claim.\n"
    );
};

export const outsideScope = function outsideScope(path: string, declared: string): string {
    return (
        `REFUSED  ${path} is outside the scope this run declared (${declared}). A peer that stays clear of that ` +
        "scope relies on the run staying inside it. Widen the scope, or repair the file in a run that covers it.\n"
    );
};

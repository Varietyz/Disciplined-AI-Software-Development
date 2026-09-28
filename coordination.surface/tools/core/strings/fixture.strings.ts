export const fixtureModuleMissing = function fixtureModuleMissing(target: string): string {
    return `ABSENT  ${target} does not exist, so there is no fixture set to add to.\n`;
};

export const notAPair = function notAPair(pair: string): string {
    return (
        `REFUSED  ${pair} is not a rule/kind pair, such as \`board/staleMarker\`. A fixture proves one kind of ` +
        "finding, so the certifier can report each kind a rule emits on its own.\n"
    );
};

export const halfMissing = function halfMissing(missing: "accepted" | "fired"): string {
    return (
        `REFUSED  The body has no ${missing} sample. A fixture needs both: a sample the check must fire on and one ` +
        "it must accept, so the check is shown to tell them apart. Start each sample on its own line with " +
        "`FIRES <path>` or `ACCEPTS <path>`, followed by its text.\n"
    );
};

export const fixtureContended = function fixtureContended(target: string): string {
    return (
        `CONTENDED  ${target} changed since you read it, so nothing was written. Read the file again, then run the ` +
        "command again.\n"
    );
};

export const setMissing = function setMissing(target: string): string {
    return (
        `REFUSED  ${target} has no fixture set (an exported array closed by \`];\`) for the entry to join, so the ` +
        "tool cannot place it. Add the set first.\n"
    );
};

export const fixtureAdded = function fixtureAdded(pair: string, target: string): string {
    return (
        `FIXTURE  ${pair} was added to ${target} with a fired and an accepted sample. The samples are yours to ` +
        "keep accurate; if one names a seat, make sure its verdict does not depend on who happens to be seated.\n"
    );
};

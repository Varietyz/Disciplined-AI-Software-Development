export const itemNotFound = function itemNotFound(item: string, target: string): string {
    return (
        `REFUSED  ${item} is not an item on ${target}, which is the surface this command searched. The board is the ` +
        "default; an item in a venue is marked by naming that venue with `--file <venue>`.\n"
    );
};

export const notAddressed = function notAddressed(item: string, agent: string): string {
    return (
        `REFUSED  ${item} is not addressed to ${agent}, so ${agent} has nothing to mark. A mark records that an ` +
        "addressee was handed the item, and the item stays until every addressee has marked it.\n"
    );
};

export const alreadyMarked = function alreadyMarked(agent: string, item: string): string {
    return `CLEAR  ${agent} has already marked ${item}. Nothing was written.\n`;
};

export const marked = function marked(agent: string, item: string): string {
    return (
        `MARK  ${agent} is recorded as having been handed ${item}. Each addressee marks its own letter, and the ` +
        "item is removed only after the last addressee has marked it, so no seat loses a change another seat " +
        "read first.\n"
    );
};

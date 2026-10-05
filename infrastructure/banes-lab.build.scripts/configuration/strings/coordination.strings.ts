export const memberMissing = function memberMissing(member: string): string {
    return `coordination: the member ${member} does not exist, so there is no package to supply.`;
};

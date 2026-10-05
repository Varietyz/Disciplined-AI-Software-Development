export const unresolvedPanel = function unresolvedPanel(title: string, name: string): string {
    return `The panel "${title}" cites ${name}, which resolves to no single definition with a served source.`;
};

export const unresolvedCitation = function unresolvedCitation(fragment: string): string {
    return `A link on this route cites ${fragment}, which resolves to no single definition.`;
};

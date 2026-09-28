export const citationUntyped = function citationUntyped(text: string, kinds: readonly string[]): string {
    return (
        `REFUSED  "${text}" is not a reference the tool can check. Write the kind, a colon, then the member. ` +
        `Kinds: ${kinds.join(", ")}\n`
    );
};

export const citationKindUnknown = function citationKindUnknown(kind: string, kinds: readonly string[]): string {
    return `REFUSED  "${kind}" is not a reference kind the tool checks. Kinds: ${kinds.join(", ")}\n`;
};

export const citationUnresolved = function citationUnresolved(kind: string, member: string): string {
    return `REFUSED  ${kind}:${member} does not resolve: the tool found nothing under that name.\n`;
};

import { CONCEPT_PREFIX } from "#configuration/constants/canon.constants";

const JSON_INDENT = 4;

export const canonRefsModule = function canonRefsModule(entries: readonly [string, string[]][]): string {
    return `const CANON_REFS = new Map<string, string[]>(${JSON.stringify(entries, null, JSON_INDENT)});

export const isRegisteredConcept = function isRegisteredConcept(concept: string): boolean {
    return CANON_REFS.has(concept);
};

export const canonRefsFor = function canonRefsFor(concepts: readonly string[]): string[] {
    const out: string[] = [];
    for (const concept of concepts) {
        const refs = CANON_REFS.get(concept);
        if (refs) {
            out.push(...refs);
        } else {
            out.push(\`${CONCEPT_PREFIX}\${concept}\`);
        }
    }
    return out;
};
`;
};

export type StringCase = readonly [string, string];

export const unmatched = function unmatched(cases: readonly StringCase[]): StringCase[] {
    return cases.filter(([text, part]) => !text.includes(part));
};

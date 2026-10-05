export const unknownTag = function unknownTag(axis: string, value: string): string {
    return `unknown ${axis} tag "${value}"`;
};

export const unknownRung = function unknownRung(value: string): string {
    return `unknown reasoning rung "${value}"`;
};

export const AXIS_NAMES = { analysis: "analysis", ontology: "ontology", representation: "representation" } as const;

export const AXIS_ARGV_SUMMARY =
    "Regenerate the pattern axis vocabulary from the reasoning ontology into its generated constants module.";

export const axisGenerated = function axisGenerated(file: string, counts: string): string {
    return `generated ${file}: ${counts}\n`;
};

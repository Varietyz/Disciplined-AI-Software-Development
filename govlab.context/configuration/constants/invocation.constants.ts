export const ENTRYPOINT_FILES = {
    algorithm: "algorithm.entrypoint.ts",
    grammar: "grammar.entrypoint.ts",
    ontology: "ontology.entrypoint.ts",
} as const;

export const FLAGS = { debug: "--debug", list: "--list", strict: "--strict" } as const;

export const SAMPLE = 25;

export const TRAIL_SAMPLE = 6;

export const FAILURE_EXIT = 1;

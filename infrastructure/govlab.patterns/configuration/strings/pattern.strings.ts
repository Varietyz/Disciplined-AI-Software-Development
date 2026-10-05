export const faceRegistered = function faceRegistered(name: string): string {
    return `pattern collection "${name}" is already registered`;
};

export const faceCycle = function faceCycle(name: string): string {
    return `pattern collection dependency cycle at "${name}"`;
};

export const faceUnregistered = function faceUnregistered(name: string): string {
    return `pattern collection "${name}" is not registered`;
};

export const PATTERN_ARGV_SUMMARY =
    "Inspect, plan, validate, analyze or synthesize a record dataset through the pattern substrate.";

export const COMMAND_POSITIONAL = "the operation: inspect, plan, validate, analyze or synthesize";

export const SOURCE_POSITIONAL = "the data file or folder of .json and .jsonl sources";

export const PATTERN_FLAGS = {
    count: "the number of records synthesize draws",
    mapping: "a JSON file assigning representations to fields",
    output: "the file the result is written to, in place of stdout",
    schema: "a JSON schema file validate checks the records against",
    seed: "the seed synthesize draws from",
    window: "the window size analyze writes rolling snapshots at",
} as const;

export const unknownCommand = function unknownCommand(command: string): string {
    return `unknown operation "${command}". Pass one of inspect, plan, validate, analyze or synthesize.`;
};

export const analyzeRefusal = function analyzeRefusal(fields: string): string {
    return `No field maps to a representation, so there is nothing to analyze. Unrepresentable fields: ${fields}. Provide a --mapping file assigning representations, or reshape the data so its fields carry scalar, list or object values.`;
};

export const analyzeWrote = function analyzeWrote(findings: string, output: string): string {
    return `[govlab.patterns] ${findings} findings → ${output}\n`;
};

export const windowWrote = function windowWrote(count: string, findings: string, file: string): string {
    return `[govlab.patterns] window ${count}: ${findings} findings → ${file}\n`;
};

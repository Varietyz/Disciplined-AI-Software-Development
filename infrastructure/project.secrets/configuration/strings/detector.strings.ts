export const duplicateDetector = function duplicateDetector(kind: string): string {
    return `detectors: the kind ${kind} is registered twice. Each kind is one predicate file, so remove the second registration.`;
};

export const missingDetectors = function missingDetectors(kinds: readonly string[]): string {
    return `detectors: no predicate file registers ${kinds.join(", ")}. Add one file per declared kind under the detectors folder.`;
};

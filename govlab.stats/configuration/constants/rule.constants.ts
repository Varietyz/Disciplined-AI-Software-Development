export const DISPOSITION = {
    advisory: "advisory",
    excluded: "excluded",
    fullGate: "full-gate",
    selectable: "selectable",
} as const;

export const LOCAL_PREFIX = "local/";

export const SAMPLE_SEGMENTS: readonly string[] = ["src", "representative.ts"];

export const OFF_SEVERITY = "off";

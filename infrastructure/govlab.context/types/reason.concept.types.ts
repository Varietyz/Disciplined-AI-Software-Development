import type { CycleRecursion } from "#types/reason.node.types";

export interface Dimension {
    id: string;
    question: string;
    mathNature: string;
    mathDomains: string[];
    aliases?: string[];
}

export interface Lens {
    id: string;
    label?: string;
    question: string;
    nature: string;
    universalAxis: string;
    mathDomains: string[];
    mathFields: string[];
    surfaces?: string[];
    detectedBy?: string[];
    aliases?: string[];
}

export interface Mode {
    id: string;
    practice: string;
    question?: string;
    aliases?: string[];
}

export interface Representation {
    id: string;
    label?: string;
    expression: string;
    aliases?: string[];
}

export interface MathDomain {
    id: string;
    studies: string;
    question: string;
    aliases?: string[];
}

export interface PatternType {
    id: string;
    label?: string;
    viewpoint: string;
    aliases?: string[];
}

export interface Model {
    id: string;
    question: string;
    sequence: string[];
    stepKind: string;
    recursion?: CycleRecursion;
    aliases?: string[];
}

export interface UniversalAxis {
    id: string;
    question: string;
    subsumes: string[];
    aliases?: string[];
}

export interface ReasonMaps {
    patternOperations: string[];
    invariants: Record<string, string[]>;
    foundations: { sequence: string[]; layers: Record<string, string[]> };
}

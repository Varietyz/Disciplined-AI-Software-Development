import type { DETECTOR_KINDS, EXCLUSION_REASONS, TOKEN_SHAPES } from "#configuration/constants/detector.constants";

export type DetectorKind = (typeof DETECTOR_KINDS)[number];

export type ExclusionReason = (typeof EXCLUSION_REASONS)[number];

export type TokenShape = (typeof TOKEN_SHAPES)[number];

export type TokenAlphabet = TokenShape["alphabet"];

export interface Detector {
    readonly detects: (value: string) => boolean;
    readonly kind: DetectorKind;
}

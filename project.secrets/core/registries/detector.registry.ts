import type { Detector, DetectorKind } from "#types/detector.types";
import { duplicateDetector } from "#configuration/strings/detector.strings";

const detectors = new Map<DetectorKind, Detector>();

export const defineDetector = function defineDetector(detector: Detector): Detector {
    if (detectors.has(detector.kind)) {
        throw new Error(duplicateDetector(detector.kind));
    }
    detectors.set(detector.kind, detector);
    return detector;
};

export const registeredDetectors = function registeredDetectors(): readonly Detector[] {
    return [...detectors.values()];
};

import { DETECTOR_KINDS, DETECTOR_SUFFIX } from "#configuration/constants/detector.constants";
import type { Detector } from "#types/detector.types";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { missingDetectors } from "#configuration/strings/detector.strings";
import { pathToFileURL } from "node:url";
import { readdirSync } from "node:fs";
import { registeredDetectors } from "#core/registries/detector.registry";

export const loadDetectors = async function loadDetectors(): Promise<readonly Detector[]> {
    const folder = absolutePath("project.secrets.detectors");
    const files = readdirSync(folder)
        .filter((name) => name.endsWith(DETECTOR_SUFFIX))
        .toSorted((left, right) => left.localeCompare(right));
    await Promise.all(
        files.map(async (name) => {
            await import(pathToFileURL(join(folder, name)).href);
        }),
    );
    const detectors = registeredDetectors();
    const missing = DETECTOR_KINDS.filter((kind) => !detectors.some((detector) => detector.kind === kind));
    if (missing.length > 0) {
        throw new Error(missingDetectors(missing));
    }
    return detectors;
};

export const detectedKinds = function detectedKinds(value: string, detectors: readonly Detector[]): readonly string[] {
    return detectors.filter((detector) => detector.detects(value)).map((detector) => detector.kind);
};

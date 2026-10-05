import { isRecord, recordAt, stringArrayField } from "#core/selectors/record.selector";
import { EXCLUDED_ECOSYSTEM } from "#configuration/constants/ecosystem.constants";
import type { LanguageProfile } from "#types/ecosystem.types";
import { absolutePath } from "@ssot/paths";
import { jsonRecord } from "#core/parsers/record.parser";
import { readFileSync } from "node:fs";

const CLASSIFICATION_FILE = "ecosystem.data.json";

const profileOf = function profileOf(id: string, entry: unknown): LanguageProfile[] {
    if (!isRecord(entry) || entry["kind"] === EXCLUDED_ECOSYSTEM) {
        return [];
    }
    return [{ id, markers: stringArrayField(entry, "markers") }];
};

export const loadEcosystems = function loadEcosystems(): Record<string, unknown> {
    const parsed = jsonRecord(readFileSync(absolutePath("govlab.quality.data", CLASSIFICATION_FILE), "utf8"));
    return recordAt(parsed, "ecosystems");
};

export const loadProfiles = function loadProfiles(): LanguageProfile[] {
    return Object.entries(loadEcosystems()).flatMap(([id, entry]) => profileOf(id, entry));
};

export const detectProfiles = function detectProfiles(rootFiles: readonly string[]): LanguageProfile[] {
    const files = new Set(rootFiles);
    return loadProfiles().filter((profile) => profile.markers.some((marker) => files.has(marker)));
};

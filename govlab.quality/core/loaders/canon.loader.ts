import type {
    CanonicalData,
    CanonicalSettingRecord,
    ConflictInstance,
    MappingRow,
    OwnershipSurface,
} from "#types/canon.types";
import { absolutePath } from "@ssot/paths";
import { jsonRecord } from "#core/parsers/record.parser";
import { readFileSync } from "node:fs";

const SETTINGS_FILE = "canonical-settings.generated.json";
const ROWS_FILE = "mapping-rows.generated.json";
const VALUES_FILE = "canon.data.json";
const SURFACES_FILE = "surface.data.json";

const readGenerated = function readGenerated(file: string): Record<string, unknown> {
    return jsonRecord(readFileSync(absolutePath("govlab.quality.generated", file), "utf8"));
};

const readData = function readData(file: string): Record<string, unknown> {
    return jsonRecord(readFileSync(absolutePath("govlab.quality.data", file), "utf8"));
};

const isListOf = function isListOf<T>(value: unknown): value is T[] {
    return Array.isArray(value);
};

const listOf = function listOf<T>(value: unknown): T[] {
    return isListOf<T>(value) ? value : [];
};

export const loadCanonicalData = function loadCanonicalData(): CanonicalData {
    const compiled = readGenerated(SETTINGS_FILE);
    const rows = readGenerated(ROWS_FILE);
    const values = readData(VALUES_FILE);
    const surfaces = readData(SURFACES_FILE);
    return {
        conflicts: listOf<ConflictInstance>(surfaces["conflicts"]),
        ownership: listOf<OwnershipSurface>(surfaces["surfaces"]),
        rows: [...listOf<MappingRow>(rows["rows"]), ...listOf<MappingRow>(values["rows"])],
        settings: [
            ...listOf<CanonicalSettingRecord>(compiled["settings"]),
            ...listOf<CanonicalSettingRecord>(values["settings"]),
        ],
    };
};

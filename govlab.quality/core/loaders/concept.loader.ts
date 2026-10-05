import { isRecord, stringArrayField, stringField } from "#core/selectors/record.selector";
import type { ConceptDefinition } from "#types/concept.types";
import { absolutePath } from "@ssot/paths";
import { jsonRecord } from "#core/parsers/record.parser";
import { readFileSync } from "node:fs";

const CONCEPT_FILE = "concept.data.json";
const EXEMPLAR_FILE = "exemplar.data.json";

const readData = function readData(file: string): unknown {
    return JSON.parse(readFileSync(absolutePath("govlab.quality.data", file), "utf8"));
};

const toDefinition = function toDefinition(value: unknown): ConceptDefinition[] {
    if (!isRecord(value)) {
        return [];
    }
    return [
        {
            cwe: stringArrayField(value, "cwe"),
            dimension: stringField(value, "dimension"),
            exclude: stringArrayField(value, "exclude"),
            id: stringField(value, "id"),
            phrases: stringArrayField(value, "phrases"),
            words: stringArrayField(value, "words"),
        },
    ];
};

export const loadConceptDefinitions = function loadConceptDefinitions(): ConceptDefinition[] {
    const raw = readData(CONCEPT_FILE);
    return Array.isArray(raw) ? raw.flatMap(toDefinition) : [];
};

export const loadExemplars = function loadExemplars(): Record<string, unknown> {
    return jsonRecord(readFileSync(absolutePath("govlab.quality.data", EXEMPLAR_FILE), "utf8"));
};

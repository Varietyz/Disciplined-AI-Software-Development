import type { ConceptKnob, KnobConcept } from "#types/canon.types";
import { isRecord, recordAt, stringField } from "#core/selectors/record.selector";
import { absolutePath } from "@ssot/paths";
import { jsonRecord } from "#core/parsers/record.parser";
import { readFileSync } from "node:fs";

const CONCEPT_KNOB_FILE = "knob.concept.data.json";

const toKnob = function toKnob(value: unknown): ConceptKnob {
    const record = isRecord(value) ? value : {};
    const { fidelity, fixed, knob, provenance, variant } = record;
    return {
        default: record["default"],
        fidelity: typeof fidelity === "string" ? fidelity : null,
        knob: typeof knob === "string" ? knob : null,
        ...(typeof provenance === "string" ? { provenance } : {}),
        ...(typeof fixed === "boolean" ? { fixed } : {}),
        ...(typeof variant === "string" ? { variant } : {}),
    };
};

const toKnobConcept = function toKnobConcept(value: unknown): KnobConcept {
    const record = isRecord(value) ? value : {};
    const tools = Object.fromEntries(
        Object.entries(recordAt(record, "tools")).map(([tool, knob]) => [tool, toKnob(knob)]),
    );
    return {
        tools,
        valueType: stringField(record, "valueType"),
        ...(record["enum"] === undefined ? {} : { enum: record["enum"] }),
    };
};

export const loadKnobConcepts = function loadKnobConcepts(): Record<string, KnobConcept> {
    const parsed = jsonRecord(readFileSync(absolutePath("govlab.quality.data", CONCEPT_KNOB_FILE), "utf8"));
    return Object.fromEntries(
        Object.entries(recordAt(parsed, "concepts")).map(([id, value]) => [id, toKnobConcept(value)]),
    );
};

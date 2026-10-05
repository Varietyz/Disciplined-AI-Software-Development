import { ENTRY_ANSWER, VALUE_ANSWER } from "#configuration/constants/environment.constants";
import type { EntryAnswer, FieldLabel, ValueAnswer } from "#types/environment.types";

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isFieldLabel = function isFieldLabel(value: unknown): value is FieldLabel {
    return isRecord(value) && typeof value["label"] === "string";
};

export const isValueAnswer = function isValueAnswer(value: unknown): value is ValueAnswer {
    return isRecord(value) && value["answer"] === VALUE_ANSWER && typeof value["value"] === "string";
};

export const isEntryAnswer = function isEntryAnswer(value: unknown): value is EntryAnswer {
    if (!isRecord(value) || value["answer"] !== ENTRY_ANSWER) {
        return false;
    }
    const { entry } = value;
    return isRecord(entry) && Array.isArray(entry["fields"]) && entry["fields"].every(isFieldLabel);
};

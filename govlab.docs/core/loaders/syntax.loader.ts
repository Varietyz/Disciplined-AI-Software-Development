import type { Recognizer } from "#types/code.types";
import { absolutePath } from "@ssot/paths";
import { isRecord } from "#core/predicates/record.predicate";
import { loadExports } from "#core/loaders/plugin.loader";

const EXPORT_KEY = "recognizer";

const isRecognizer = function isRecognizer(value: unknown): value is Recognizer {
    return isRecord(value) && typeof value["name"] === "string" && typeof value["classify"] === "function";
};

export const loadRecognizers = async function loadRecognizers(): Promise<Recognizer[]> {
    const recognizers = await loadExports(absolutePath("govlab.docs.plugins"), EXPORT_KEY, isRecognizer);
    return recognizers.toSorted((left, right) => left.name.localeCompare(right.name));
};

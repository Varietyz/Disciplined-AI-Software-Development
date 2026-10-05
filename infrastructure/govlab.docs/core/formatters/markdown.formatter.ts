import { exampleLabel } from "#configuration/strings/readme.strings";
import { isApiNote } from "#core/predicates/readme.predicate";
import { isRecordArray } from "#core/predicates/record.predicate";

const WORD_JOIN = "-";
const DEFAULT_LANG = "js";
const FENCE = "```";
const RECORD_SEPARATOR = "\n\n";
const DEFAULT_KEY = "default";
const NOTE_KEY = "note";
const LANG_KEY = "lang";
const INTENT_KEY = "intent";
const CODE_KEY = "code";
const OPTION_KEY = "option";
const QUICK_START_FIELD = "quickStart";
const CONFIGURATION_FIELD = "configuration";
const API_NOTES_FIELD = "apiNotes";
const NOTE_JOIN = " — ";
const OPTION_SEPARATOR = ", ";
const LIST_JOIN = ", ";
const LAST_JOIN = " and ";

export const bullets = function bullets(items: readonly string[]): string {
    return items.map((item) => `- ${item}`).join("\n");
};

export const titleCase = function titleCase(id: string): string {
    return id
        .split(WORD_JOIN)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const recordLines = function recordLines(record: Readonly<Record<string, string>>): string {
    return Object.entries(record)
        .map(([key, value]) => `- **${key}**: ${value}`)
        .join("\n");
};

export const renderRenderable = function renderRenderable(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }
    if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) {
        return bullets(value);
    }
    return isRecordArray(value) ? value.map(recordLines).join(RECORD_SEPARATOR) : "";
};

const quickStartBlock = function quickStartBlock(entry: Readonly<Record<string, string>>): string {
    const lang = entry[LANG_KEY] ?? DEFAULT_LANG;
    return `${FENCE}${lang}${exampleLabel(entry[INTENT_KEY] ?? "")}\n${entry[CODE_KEY] ?? ""}\n${FENCE}`;
};

export const renderQuickStart = function renderQuickStart(value: unknown): string {
    return isRecordArray(value) ? value.map(quickStartBlock).join(RECORD_SEPARATOR) : renderRenderable(value);
};

const optionSpans = function optionSpans(option: string): string {
    const spans = option.split(OPTION_SEPARATOR).map((key) => `\`${key}\``);
    const last = spans.pop() ?? "";
    return spans.length === 0 ? last : `${spans.join(LIST_JOIN)}${LAST_JOIN}${last}`;
};

const configurationLine = function configurationLine(entry: Readonly<Record<string, string>>): string {
    const fallback = entry[DEFAULT_KEY];
    const defaulted = fallback === undefined ? "" : ` (default: \`${fallback}\`)`;
    const note = entry[NOTE_KEY] ?? "";
    const noted = note === "" ? "" : NOTE_JOIN + note;
    return `- ${optionSpans(entry[OPTION_KEY] ?? "")}${defaulted}${noted}`;
};

export const renderConfiguration = function renderConfiguration(value: unknown): string {
    return isRecordArray(value) ? value.map(configurationLine).join("\n") : renderRenderable(value);
};

export const renderFieldFragment = function renderFieldFragment(key: string, value: unknown): string {
    if (key === QUICK_START_FIELD) {
        return renderQuickStart(value);
    }
    if (key === CONFIGURATION_FIELD) {
        return renderConfiguration(value);
    }
    if (key === API_NOTES_FIELD) {
        return (Array.isArray(value) ? value : [])
            .filter(isApiNote)
            .map((note) => note.note)
            .join("\n");
    }
    return renderRenderable(value);
};

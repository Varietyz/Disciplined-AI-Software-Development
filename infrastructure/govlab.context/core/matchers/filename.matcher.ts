import {
    FOLDER_SEPARATOR,
    HYPHEN,
    PLAIN_SEGMENTS,
    SEGMENT_SEPARATOR,
    VARIANT_SEGMENTS,
    WORD_CHARS,
} from "#configuration/constants/lexicon.constants";
import type { PlacedFile } from "#types/lexicon.types";

const holdsOnlyWordChars = function holdsOnlyWordChars(text: string): boolean {
    for (let index = 0; index < text.length; index += 1) {
        if (!WORD_CHARS.has(text.charAt(index))) {
            return false;
        }
    }
    return true;
};

const isWord = function isWord(text: string): boolean {
    return text.length > 0 && !text.startsWith(HYPHEN) && !text.endsWith(HYPHEN) && holdsOnlyWordChars(text);
};

const fileParts = function fileParts(file: string): Omit<PlacedFile, "folder"> | null {
    const segments = file.split(SEGMENT_SEPARATOR);
    if (segments.length !== PLAIN_SEGMENTS && segments.length !== VARIANT_SEGMENTS) {
        return null;
    }
    if (!segments.every(isWord)) {
        return null;
    }
    const [subject = "", second = ""] = segments;
    return {
        extension: segments.at(-1) ?? "",
        subject,
        tag: segments.at(-2) ?? "",
        variant: segments.length === VARIANT_SEGMENTS ? second : null,
    };
};

export const placedFileOf = function placedFileOf(path: string): PlacedFile | null {
    const cut = path.indexOf(FOLDER_SEPARATOR);
    if (cut <= 0 || cut !== path.lastIndexOf(FOLDER_SEPARATOR)) {
        return null;
    }
    const folder = path.slice(0, cut);
    const parts = fileParts(path.slice(cut + 1));
    return parts === null || !isWord(folder) || parts.subject === parts.tag ? null : { ...parts, folder };
};

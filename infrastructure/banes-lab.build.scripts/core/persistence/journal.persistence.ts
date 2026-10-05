import { EMPTY_JOURNAL, parseJournal } from "#core/converters/journal.converter";
import { existsSync, readFileSync } from "node:fs";
import type { Journal } from "#types/journal.types";
import { absolutePath } from "@ssot/paths";
import { writeCanonicalJson } from "@govlab/canonical-write";

export const readJournal = function readJournal(file = absolutePath("app.journal")): Journal {
    return existsSync(file) ? parseJournal(readFileSync(file, "utf8")) : EMPTY_JOURNAL;
};

export const persistJournal = async function persistJournal(
    journal: Journal,
    file = absolutePath("app.journal"),
): Promise<void> {
    await writeCanonicalJson(file, journal);
};

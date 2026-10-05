import { JSON_SWITCH, REVEAL_WORDS, SHOW_WORDS, VAULT_BINARY } from "#configuration/constants/environment.constants";
import { answerMalformed, vaultRefused } from "#configuration/strings/environment.strings";
import { isEntryAnswer, isValueAnswer } from "#core/predicates/environment.predicate";
import { execFileSync } from "node:child_process";

const reasonOf = function reasonOf(error: unknown): string {
    if (typeof error === "object" && error !== null && "stderr" in error) {
        const stderr = String(error.stderr).trim();
        if (stderr.length > 0) {
            return stderr;
        }
    }
    return error instanceof Error ? error.message : String(error);
};

const ask = function ask(entry: string, words: readonly string[]): unknown {
    try {
        const output = execFileSync(VAULT_BINARY, [...words, JSON_SWITCH], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
        });
        return JSON.parse(output);
    } catch (error: unknown) {
        throw new Error(vaultRefused(entry, reasonOf(error)), { cause: error });
    }
};

export const fieldLabels = function fieldLabels(entry: string): ReadonlySet<string> {
    const answer = ask(entry, [...SHOW_WORDS, entry]);
    if (!isEntryAnswer(answer)) {
        throw new Error(answerMalformed(entry));
    }
    return new Set(answer.entry.fields.map((field) => field.label));
};

export const revealField = function revealField(entry: string, label: string): string {
    const answer = ask(entry, [...REVEAL_WORDS, entry, label]);
    if (!isValueAnswer(answer)) {
        throw new Error(answerMalformed(entry));
    }
    return answer.value;
};

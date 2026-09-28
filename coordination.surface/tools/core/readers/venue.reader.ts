import { existsSync, readFileSync } from "node:fs";
import { boardRecords } from "../analyzers/board.analyzer.ts";
import { resolve } from "node:path";

const AGENT_LABEL = "Agent ";

const SIGN_OFF_COLON_LIMIT = 4;

const SIGN_OFF_LETTER_LIMIT = 2;

export const SIGN_OFF_BANNER = "═══════════════════ SIGN-OFF";

export const textIfPresent = function textIfPresent(absolute: string): string {
    return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
};

export const surfaceText = function surfaceText(repoRoot: string, relative: string): string {
    return textIfPresent(resolve(repoRoot, relative));
};

export const signOffSection = function signOffSection(venue: string): string[] {
    const lines = venue.split("\n");
    const opens = lines.findIndex((line) => line.startsWith(SIGN_OFF_BANNER));
    return opens === -1 ? [] : lines.slice(opens + 1);
};

const isSignOffLetter = function isSignOffLetter(letter: string): boolean {
    const first = letter.charAt(0);
    return letter.length > 0 && letter.length <= SIGN_OFF_LETTER_LIMIT && first >= "A" && first <= "Z";
};

const signOffEntry = function signOffEntry(line: string): [string, string] | null {
    const colon = line.indexOf(":");
    const letter = colon <= 0 || colon > SIGN_OFF_COLON_LIMIT ? "" : line.slice(0, colon).trim();
    return isSignOffLetter(letter) ? [letter, line.slice(colon + 1).trim()] : null;
};

export const signOffLines = function signOffLines(venue: string): Map<string, string> {
    const entries = signOffSection(venue)
        .map(signOffEntry)
        .filter((entry): entry is [string, string] => entry !== null);
    return new Map(entries.toReversed());
};

export const venueRecords = function venueRecords(venue: string): Map<string, ReadonlyMap<string, string>> {
    return new Map(
        boardRecords(venue)
            .filter((record) => record.kind === "agent")
            .map((record): [string, ReadonlyMap<string, string>] => [
                record.label.slice(AGENT_LABEL.length).trim(),
                record.fields,
            ]),
    );
};

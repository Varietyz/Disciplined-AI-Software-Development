import { INHERITED_BANNER, LIST_MARKER } from "../constants/blocking.constants.ts";
import { fencedFlags } from "../predicates/fence.predicate.ts";

export const SUCCESSOR_FIELD = "SUCCESSOR:";

const SECTION_HEADING = "## ";

const SUCCESSOR_WORD = "SUCCESSOR";

const successorSectionClose = function successorSectionClose(
    lines: readonly string[],
    fenced: readonly boolean[],
): number {
    const opens = lines.findIndex((line) => {
        const trimmed = line.trim();
        return trimmed.startsWith(SECTION_HEADING) && trimmed.includes(SUCCESSOR_WORD);
    });
    if (opens === -1) {
        return -1;
    }

    const ends = lines.findIndex((line, index) => {
        const trimmed = line.trim();
        return index > opens && trimmed.startsWith(SECTION_HEADING) && !trimmed.includes(SUCCESSOR_WORD);
    });
    const end = ends === -1 ? lines.length : ends;
    return fenced.findLastIndex((flag, index) => flag && index > opens && index < end);
};

export const successorWritten = function successorWritten(before: string, declaration: string): string | null {
    const fenced = fencedFlags(before);
    const lines = before.split("\n");
    const at = lines.findIndex((line, index) => fenced[index] !== true && line.trim().startsWith(SUCCESSOR_FIELD));
    if (at !== -1) {
        return [...lines.slice(0, at), declaration, ...lines.slice(at + 1)].join("\n");
    }

    const close = successorSectionClose(lines, fenced);
    return close === -1 ? null : [...lines.slice(0, close + 1), "", declaration, ...lines.slice(close + 1)].join("\n");
};

export const lastInheritedItem = function lastInheritedItem(lines: readonly string[]): number {
    const trimmed = lines.map((line) => line.trim());
    const opens = trimmed.findIndex((line) => line.startsWith(INHERITED_BANNER));
    const first = trimmed.findIndex((line, index) => index > opens && line.startsWith(LIST_MARKER));
    if (opens === -1 || first === -1) {
        return -1;
    }

    const closes = trimmed.findIndex(
        (line, index) => index > first && line.startsWith("═") && !line.startsWith(INHERITED_BANNER),
    );
    const end = closes === -1 ? trimmed.length : closes;
    return trimmed.findLastIndex((line, index) => index >= first && index < end && line.startsWith(LIST_MARKER));
};

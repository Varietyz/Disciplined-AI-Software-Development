import { BOARD_PATH } from "../constants/board.constants.ts";
import { activeLetters } from "../resolvers/board.resolver.ts";

import { blockOf } from "../transformers/board.transformer.ts";
import { readFileSync } from "node:fs";
import { readerSet } from "../inspectors/board.inspector.ts";
import { resolve } from "node:path";
import { writeRepair } from "../writers/repair.writer.ts";

export const writeBoardIfUnmoved = function writeBoardIfUnmoved(
    repoRoot: string,
    witnessed: string,
    rendered: string,
): boolean {
    const current = readFileSync(resolve(repoRoot, BOARD_PATH), "utf8");
    if (current !== witnessed) {
        return false;
    }

    return writeRepair({ declared: "", repoRoot }, BOARD_PATH, rendered).written;
};

export const authorOf = function authorOf(id: string): string {
    const cut = id.indexOf("-");
    return cut === -1 ? id : id.slice(0, cut);
};

export const closureText = function closureText(
    closes: string,
    ref: string,
    source: string,
    agent: string,
    index: string,
): string | null {
    const span = blockOf(source, closes);
    if (span === null) {
        return null;
    }

    const lines = source.split("\n").slice(span.from, span.to - 1);
    const readers = lines.flatMap((line) => readerSet(line));

    if (readers.length > 0 && !readers.includes(agent)) {
        const active = activeLetters(source, index);
        const stranded = readers.every((reader) => !active.has(reader));

        if (!stranded) {
            return (
                `NOTREADER  ${closes} is addressed to ${readers.join(", ")}, not to ${agent}. An item is closed by a ` +
                "seat it was addressed to"
            );
        }

        if (authorOf(closes) !== agent) {
            return (
                `NOTREADER  ${closes} is addressed to ${readers.join(", ")}, and none of them is active. Only its ` +
                `author can close it now, and ${agent} did not write it`
            );
        }

        return (
            `CLOSES ${closes} — stranded, every addressee inactive · ${ref}\n` +
            "NOTE  re-addressing is the default and closing is the exception: the seat left, the work did not. " +
            "Close only where the item's request is genuinely dead, and extract before you do\n"
        );
    }

    return `CLOSES ${closes} — handled · ${ref}`;
};

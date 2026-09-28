import { existsSync, readFileSync } from "node:fs";
import { halfStated, rosterMissing, rowMalformed, rowMissing, undeclaredHalf } from "../strings/conduct.strings.ts";

import { FAILING_QUESTIONS } from "../constants/conduct.constants.ts";
import { resolve } from "node:path";
import { writeRepair } from "../writers/repair.writer.ts";

const ROW = "| `";

const CELL = "|";

const UNBUILT = "none";

const ABSENT = "—";

interface HalfRequest {
    readonly repoRoot: string;
    readonly target: string;
    readonly slug: string;
    readonly value: string;
    readonly registered: readonly string[];
}

interface HalfOutcome {
    readonly code: number;
    readonly message: string;
}

const rowSlug = function rowSlug(line: string): string {
    if (!line.startsWith(ROW)) {
        return "";
    }

    const rest = line.slice(ROW.length);
    const close = rest.indexOf("`");
    return close === -1 ? "" : rest.slice(0, close);
};

export const isDeclaredHalf = function isDeclaredHalf(value: string, registered: readonly string[]): boolean {
    return value === UNBUILT || value === ABSENT || FAILING_QUESTIONS.includes(value) || registered.includes(value);
};

export const withThirdCell = function withThirdCell(line: string, value: string): string | null {
    const cells = line.split(CELL);
    if (cells.length < 5) {
        return null;
    }

    cells[3] = ` \`${value}\` `;
    return cells.join(CELL);
};

export const runHalf = function runHalf(request: HalfRequest): HalfOutcome {
    const absolute = resolve(request.repoRoot, request.target);
    if (!existsSync(absolute)) {
        return { code: 2, message: rosterMissing(request.target) };
    }

    if (!isDeclaredHalf(request.value, request.registered)) {
        return { code: 2, message: undeclaredHalf(request.value, FAILING_QUESTIONS) };
    }

    const source = readFileSync(absolute, "utf8");
    const lines = source.split("\n");
    const at = lines.findIndex((line) => rowSlug(line) === request.slug);

    if (at === -1) {
        return { code: 2, message: rowMissing(request.slug, request.target) };
    }

    const written = withThirdCell(lines[at] ?? "", request.value);
    if (written === null) {
        return { code: 2, message: rowMalformed(request.slug) };
    }

    const outcome = writeRepair(
        { declared: "whole", repoRoot: request.repoRoot },
        request.target,
        [...lines.slice(0, at), written, ...lines.slice(at + 1)].join("\n"),
    );
    if (!outcome.written) {
        return { code: 2, message: outcome.refusal ?? "" };
    }

    return { code: 0, message: halfStated(request.slug, request.value) };
};

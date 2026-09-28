import {
    ROW_INCOMPLETE,
    contractMissing,
    idTaken,
    noTaskRows,
    planMissing,
    rowAppended,
} from "../strings/task.strings.ts";
import { existsSync, readFileSync } from "node:fs";

import { PLANNING_TEMPLATE } from "../constants/checklist.constants.ts";
import { readRowMarkers } from "../readers/template.reader.ts";
import { resolve } from "node:path";
import { writeRepair } from "../writers/repair.writer.ts";

const TASK_MARKER = "- [ ] ";

const PLACEHOLDER = "<unwritten>";

const OWNER_MARKER = "*owner:*";

const FIELD_DIVIDER = " · ";

interface TaskRequest {
    readonly repoRoot: string;
    readonly target: string;
    readonly id: string;
    readonly statement: string;
    readonly owner: string;
}

interface TaskOutcome {
    readonly code: number;
    readonly message: string;
}

const isDeclared = function isDeclared(source: string, id: string): boolean {
    for (const line of source.split("\n")) {
        if (!line.trimStart().startsWith(TASK_MARKER)) {
            continue;
        }
        if (line.trimStart().slice(TASK_MARKER.length).startsWith(`${id} `)) {
            return true;
        }
    }

    return false;
};

const lastTaskLine = function lastTaskLine(lines: readonly string[]): number {
    let at = -1;

    for (let index = 0; index < lines.length; index += 1) {
        if ((lines[index] ?? "").trimStart().startsWith(TASK_MARKER)) {
            at = index;
        }
    }

    return at;
};

export const runTask = function runTask(request: TaskRequest): TaskOutcome {
    const absolute = resolve(request.repoRoot, request.target);

    if (!existsSync(absolute)) {
        return { code: 2, message: planMissing(request.target) };
    }

    if (request.id.trim().length === 0 || request.statement.trim().length === 0) {
        return { code: 2, message: ROW_INCOMPLETE };
    }

    const source = readFileSync(absolute, "utf8");

    if (isDeclared(source, request.id.trim())) {
        return { code: 2, message: idTaken(request.id, request.target) };
    }

    const lines = source.split("\n");
    const at = lastTaskLine(lines);
    if (at === -1) {
        return { code: 2, message: noTaskRows(request.target) };
    }

    const template = resolve(request.repoRoot, PLANNING_TEMPLATE);
    const markers = existsSync(template) ? readRowMarkers(readFileSync(template, "utf8")) : [];
    if (markers.length === 0) {
        return { code: 2, message: contractMissing(PLANNING_TEMPLATE) };
    }

    const fields = markers
        .map((marker) => `${marker} ${marker === OWNER_MARKER ? request.owner : PLACEHOLDER}`)
        .join(FIELD_DIVIDER);

    const row = `${TASK_MARKER}${request.id.trim()} ${request.statement.trim()}. ${fields}`;
    const written = [...lines.slice(0, at + 1), row, ...lines.slice(at + 1)];

    const outcome = writeRepair({ declared: "whole", repoRoot: request.repoRoot }, request.target, written.join("\n"));
    if (!outcome.written) {
        return { code: 2, message: outcome.refusal ?? "" };
    }

    return { code: 0, message: rowAppended(request.id, request.target) };
};

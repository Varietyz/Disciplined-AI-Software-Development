import { AWAITING_MARKER, UNREAD_MARKER } from "../constants/blocking.constants.ts";

import {
    NEEDS_FIELD_EMPTY,
    NEEDS_FIELD_MISSING,
    NEEDS_NO_RECORD,
    alreadyRead,
    alreadySigned,
    moveFailed,
    moved,
    needOutstanding,
    notConvened,
    readMarked,
    rosterContended,
    rosterLinesMissing,
    signOffBlockMissing,
    signOffContended,
    signOffRowAdded,
    signatureContended,
    signed,
    venueMissingForRead,
    venueMissingForSign,
} from "../strings/converge.strings.ts";
import { existsSync, linkSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { boardRecords } from "../analyzers/board.analyzer.ts";

const NEEDS_FIELD = "Needs";

const ABSENT = "—";

export const TOOL_STAMP = "[written by the sign form]";

interface SignRequest {
    readonly target: string;
    readonly absolute: string;
    readonly agent: string;
    readonly text: string;
}

interface SignOutcome {
    readonly message: string;
    readonly code: number;
}

const signOffLine = function signOffLine(lines: readonly string[], agent: string): number {
    const opener = `${agent}:`;
    return lines.findIndex(
        (line) => line.startsWith(opener) && (line.length === opener.length || line.charAt(opener.length) === " "),
    );
};

const SIGN_OFF_HEADING = "SIGN-OFF";

const OWNER_ROW = "owner:";

const PLACEHOLDER = "<unsigned>";

const holdsRecord = function holdsRecord(venue: string, agent: string): boolean {
    return boardRecords(venue).some((record) => record.kind === "agent" && record.label.endsWith(` ${agent}`));
};

const isSignOffRow = function isSignOffRow(line: string): boolean {
    const cut = line.indexOf(":");
    if (cut <= 0) {
        return false;
    }

    for (let index = 0; index < cut; index += 1) {
        const character = line.charAt(index);
        if (character < "A" || character > "Z") {
            return false;
        }
    }

    return true;
};

const withSignOffRow = function withSignOffRow(lines: readonly string[], agent: string): string[] | null {
    const banner = lines.findIndex((line) => line.includes(SIGN_OFF_HEADING));
    if (banner === -1) {
        return null;
    }

    const at = lines.findLastIndex(
        (line, index) => index > banner && (isSignOffRow(line) || line.startsWith(OWNER_ROW)),
    );
    const row = `${agent}:     ${PLACEHOLDER}`;
    if (at === -1) {
        return [...lines.slice(0, banner + 1), "", row, ...lines.slice(banner + 1)];
    }

    const insert = (lines[at] ?? "").startsWith(OWNER_ROW) ? at : at + 1;

    return [...lines.slice(0, insert), row, ...lines.slice(insert)];
};

const outstandingNeed = function outstandingNeed(venue: string, agent: string): string {
    const record = boardRecords(venue).find((held) => held.kind === "agent" && held.label.endsWith(` ${agent}`));
    if (record === undefined) {
        return NEEDS_NO_RECORD;
    }

    const needs = record.fields.get(NEEDS_FIELD);
    if (needs === undefined) {
        return NEEDS_FIELD_MISSING;
    }

    const stated = needs.trim();
    if (stated === ABSENT) {
        return "";
    }
    return stated.length === 0 ? NEEDS_FIELD_EMPTY : stated;
};

const NOT_READ = UNREAD_MARKER;

const AWAITING = AWAITING_MARKER;

const TOKEN_BREAKS = new Set([" ", ",", "\t"]);

export const letters = function letters(line: string, opener: string): string[] {
    const out: string[] = [];

    let token = "";
    for (const character of `${line.slice(opener.length)} `) {
        if (!TOKEN_BREAKS.has(character)) {
            token += character;
            continue;
        }

        if (token.length > 0 && token !== ABSENT && !out.includes(token)) {
            out.push(token);
        }
        token = "";
    }

    return out;
};

export const rosterLine = function rosterLine(opener: string, held: readonly string[]): string {
    const pad = opener === NOT_READ ? "        " : " ";
    return `${opener}${pad}${held.length === 0 ? ABSENT : held.join(" ")}`;
};

export const runArchiveMove = function runArchiveMove(
    absolute: string,
    destination: string,
    target: string,
): SignOutcome {
    try {
        linkSync(absolute, destination);
    } catch (error) {
        return { code: 2, message: moveFailed(target, String(error)) };
    }

    unlinkSync(absolute);

    return { code: 0, message: moved(target) };
};

export const runReadMark = function runReadMark(request: SignRequest): SignOutcome {
    if (!existsSync(request.absolute)) {
        return { code: 2, message: venueMissingForRead(request.target) };
    }

    const before = readFileSync(request.absolute, "utf8");
    const lines = before.split("\n");

    const notReadAt = lines.findIndex((line) => line.startsWith(NOT_READ));
    const awaitingAt = lines.findIndex((line) => line.startsWith(AWAITING));

    if (notReadAt === -1 || awaitingAt === -1) {
        return { code: 2, message: rosterLinesMissing(request.target) };
    }

    const pending = letters(lines[notReadAt] ?? "", NOT_READ).filter((letter) => letter !== request.agent);
    const done = letters(lines[awaitingAt] ?? "", AWAITING);

    if (done.includes(request.agent)) {
        return { code: 0, message: alreadyRead(request.agent, request.target) };
    }

    const written = [...lines];
    written[notReadAt] = rosterLine(NOT_READ, pending);
    written[awaitingAt] = rosterLine(AWAITING, [...done, request.agent]);

    const witness = readFileSync(request.absolute, "utf8");
    if (witness !== before) {
        return { code: 2, message: rosterContended(request.target) };
    }

    writeFileSync(request.absolute, written.join("\n"), "utf8");

    return { code: 0, message: readMarked(request.agent, request.target) };
};

export const runSignature = function runSignature(request: SignRequest): SignOutcome {
    if (!existsSync(request.absolute)) {
        return { code: 2, message: venueMissingForSign(request.target) };
    }

    const before = readFileSync(request.absolute, "utf8");
    const lines = before.split("\n");
    const at = signOffLine(lines, request.agent);

    if (at === -1) {
        if (!holdsRecord(before, request.agent)) {
            return { code: 2, message: notConvened(request.agent, request.target) };
        }

        const raised = withSignOffRow(lines, request.agent);
        if (raised === null) {
            return { code: 2, message: signOffBlockMissing(request.target) };
        }

        const witnessed = readFileSync(request.absolute, "utf8");
        if (witnessed !== before) {
            return { code: 2, message: signOffContended(request.target) };
        }

        writeFileSync(request.absolute, raised.join("\n"), "utf8");

        return { code: 0, message: signOffRowAdded(request.agent, request.target) };
    }

    const need = outstandingNeed(before, request.agent);
    if (need.length > 0) {
        return { code: 2, message: needOutstanding(request.agent, request.target, need) };
    }

    const signature = `${request.agent}:     ${request.text} ${TOOL_STAMP}`;
    if ((lines[at] ?? "") === signature) {
        return { code: 0, message: alreadySigned(request.agent, request.target) };
    }

    const written = [...lines.slice(0, at), signature, ...lines.slice(at + 1)].join("\n");

    const witness = readFileSync(request.absolute, "utf8");
    if (witness !== before) {
        return { code: 2, message: signatureContended(request.target) };
    }

    writeFileSync(request.absolute, written, "utf8");

    return { code: 0, message: signed(request.agent, request.target, TOOL_STAMP) };
};

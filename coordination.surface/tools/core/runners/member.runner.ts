import { existsSync, readFileSync, writeFileSync } from "node:fs";

import {
    headingTaken,
    memberAdded,
    memberContended,
    regionMissing,
    surfaceMissing,
} from "../strings/member.strings.ts";
import { appendSection } from "../formatters/text.formatter.ts";

interface MemberRequest {
    readonly target: string;
    readonly absolute: string;
    readonly heading: string;
    readonly body: string;
}

interface MemberOutcome {
    readonly message: string;
    readonly code: number;
}

const MEMBER_MARKER = "## ";

const REGION_LEAD = "═";

const REGION_WORD = "ROWS";

const regionAt = function regionAt(lines: readonly string[]): number {
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index] ?? "";
        if (line.startsWith(REGION_LEAD) && line.includes(REGION_WORD)) {
            return index;
        }
    }
    return -1;
};

export const runMember = function runMember(request: MemberRequest): MemberOutcome {
    if (!existsSync(request.absolute)) {
        return { code: 2, message: surfaceMissing(request.target) };
    }

    const before = readFileSync(request.absolute, "utf8");
    const lines = before.split("\n");

    if (regionAt(lines) === -1) {
        return { code: 2, message: regionMissing(request.target) };
    }

    if (before.includes(`${MEMBER_MARKER}${request.heading}`)) {
        return { code: 2, message: headingTaken(request.heading, request.target) };
    }

    const written = appendSection(before, `${MEMBER_MARKER}${request.heading}`, request.body);

    const witness = readFileSync(request.absolute, "utf8");
    if (witness !== before) {
        return { code: 2, message: memberContended(request.target) };
    }

    writeFileSync(request.absolute, written, "utf8");

    return { code: 0, message: memberAdded(request.heading, request.target) };
};

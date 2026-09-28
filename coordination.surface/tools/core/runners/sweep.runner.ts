import {
    DISCHARGE_NEEDS_REF,
    dischargeContended,
    dischargeNotVenue,
    dischargeRefUnresolved,
    dischargeRefUntyped,
    dischargeSettled,
    discharged,
} from "../strings/board.strings.ts";
import { SWEEP_CONTENDED, sweepHeld, swept } from "../strings/sweep.strings.ts";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { itemSpans, seenItems, spanText, withoutSpans } from "../resolvers/sweep.resolver.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import { EXTRACTION_KIND } from "../validators/archive.validator.ts";
import { resolve } from "node:path";
import { wasDelivered } from "../registries/snapshot.registry.ts";

const HEADING = "\n## board sweep: items every addressee has written past\n\n";

const DIRECTIVES_HEADING = "DIRECTIVES";

interface SweepOutcome {
    readonly swept: readonly string[];
    readonly message: string;
}

interface DischargeRequest {
    readonly target: string;
    readonly absolute: string;
    readonly archive: string;
    readonly clause: string;
    readonly ref: string | null;
}

interface DischargeScan {
    readonly inside: boolean;
    readonly dropping: boolean;
    readonly removed: number;
    readonly keep: boolean;
}

const DISCHARGE_START: DischargeScan = { dropping: false, inside: false, keep: true, removed: 0 };

export const runSweep = function runSweep(repoRoot: string, absolute: string, archive: string): SweepOutcome {
    if (!existsSync(absolute)) {
        return { message: "", swept: [] };
    }

    const before = readFileSync(absolute, "utf8");

    const written = seenItems(itemSpans(before));
    if (written.length === 0) {
        return { message: "", swept: [] };
    }

    const held: string[] = [];
    const seen: typeof written = [];

    for (const span of written) {
        const unread = span.to.filter((reader) => !wasDelivered(repoRoot, reader, span.key));
        if (unread.length === 0) {
            seen.push(span);
            continue;
        }
        held.push(`${span.key} → ${unread.join(", ")}`);
    }

    const holdNote = held.length === 0 ? "" : sweepHeld(held);

    if (seen.length === 0) {
        return { message: holdNote, swept: [] };
    }

    const entries = seen.map(
        (span) =>
            `\n### ${span.key} — to ${span.to.join(", ")} · every addressee was handed this item in a delivered read\n\n${spanText(before, span)}\n`,
    );

    const witness = readFileSync(absolute, "utf8");
    if (witness !== before) {
        return { message: SWEEP_CONTENDED, swept: [] };
    }

    const target = resolve(repoRoot, archive);
    appendFileSync(target, existsSync(target) ? entries.join("") : `${HEADING}${entries.join("")}`, "utf8");

    writeFileSync(absolute, withoutSpans(before, seen), "utf8");

    const keys = seen.map((span) => span.key);

    return { message: `${holdNote}${swept(keys)}`, swept: keys };
};

const isBoundaryLine = function isBoundaryLine(trimmed: string): boolean {
    return trimmed.startsWith("#") || trimmed.startsWith("═");
};

const dischargeLine = function dischargeLine(state: DischargeScan, line: string, clause: string): DischargeScan {
    const trimmed = line.trim();
    if (isBoundaryLine(trimmed) && trimmed.includes(DIRECTIVES_HEADING)) {
        return { ...state, inside: true, keep: true };
    }

    const inside = state.inside && !isBoundaryLine(trimmed);
    if (inside && trimmed.startsWith("- ") && trimmed.includes(clause)) {
        return { dropping: true, inside, keep: false, removed: state.removed + 1 };
    }

    const continues = state.dropping && line.startsWith(" ") && trimmed.length > 0 && !trimmed.startsWith("- ");
    return { dropping: continues, inside, keep: !continues, removed: state.removed };
};

const dischargeRefusal = function dischargeRefusal(request: DischargeRequest): string | null {
    const { ref, target } = request;
    if (!target.endsWith(BLOCKING_SUFFIX)) {
        return dischargeNotVenue(target);
    }

    if (ref === null || ref.length === 0) {
        return DISCHARGE_NEEDS_REF;
    }

    const separator = ref.indexOf(":");
    const kind = separator === -1 ? "" : ref.slice(0, separator).trim();
    const member = separator === -1 ? "" : ref.slice(separator + 1).trim();
    if (kind !== EXTRACTION_KIND || member.length === 0) {
        return dischargeRefUntyped(ref);
    }

    const filed = existsSync(request.archive) && readFileSync(request.archive, "utf8").includes(member);
    return filed ? null : dischargeRefUnresolved(ref);
};

export const runDischarge = function runDischarge(request: DischargeRequest): { message: string; code: number } {
    const refusal = dischargeRefusal(request);
    if (refusal !== null) {
        return { code: 2, message: refusal };
    }

    const before = readFileSync(request.absolute, "utf8");
    const lines = before.split("\n");
    const kept: string[] = [];
    let state = DISCHARGE_START;
    for (const line of lines) {
        state = dischargeLine(state, line, request.clause);
        if (state.keep) {
            kept.push(line);
        }
    }

    if (state.removed === 0) {
        return { code: 0, message: dischargeSettled(request.target, request.clause) };
    }

    const witness = readFileSync(request.absolute, "utf8");
    if (witness !== before) {
        return { code: 2, message: dischargeContended(request.target) };
    }

    writeFileSync(request.absolute, kept.join("\n"));
    return { code: 0, message: discharged(request.clause, request.target, request.ref ?? "") };
};

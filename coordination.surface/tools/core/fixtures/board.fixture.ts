import { boardRecords } from "../analyzers/board.analyzer.ts";
import { enclosingRecord } from "../analyzers/fence.analyzer.ts";
import { unreadWhilePositionsStand } from "../validators/blocking.validator.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const OPEN = "┌─── AGENT A ───";

const CLOSE = "└─── END AGENT A";

const CONTIGUOUS = [OPEN, "Agent A — ACTIVE", "  Owns:       one concern", "  Positions:  one", CLOSE].join("\n");

const INTERRUPTED = [
    OPEN,
    "Agent A — ACTIVE",
    "  Owns:       one concern",
    "",
    "  Positions:  one",
    "",
    CLOSE,
].join("\n");

const FORGED = [
    OPEN,
    "Agent A — ACTIVE",
    "  Owns:       one concern",
    "  Flags:      —",
    "           ┌─── AGENT A-1 ─── kind:artifact at:1 to:B",
    "           To B — a body line, and the next one is what a wrap can put at a line start",
    "           Agent B — ACTIVE is the state that record reports",
    "           └─── END AGENT A-1",
    "  Positions:  one",
    CLOSE,
].join("\n");

const SUCCEEDING = [
    OPEN,
    "Agent A — ACTIVE",
    "  Owns:       one concern",
    CLOSE,
    "",
    "┌─── AGENT B ───",
    "Agent B — ACTIVE",
    "  Owns:       another concern",
    "└─── END AGENT B",
].join("\n");

function recording(source: string): BranchObservation {
    const records = boardRecords(source);
    const first = records[0];

    return {
        records: records.length,
        fields: first === undefined ? 0 : first.fields.size,
        positions: first === undefined ? false : first.fields.has("Positions"),
    };
}

const MENTIONED = ["NOT-READ:        <A every active agent>", "READ AND AWAITING: A B", "", "Position A1 — a claim"].join(
    "\n",
);

const MEMBER = ["NOT-READ:        A", "READ AND AWAITING: B", "", "Position B1 — a claim"].join("\n");

function rostering(source: string): BranchObservation {
    const unread = unreadWhilePositionsStand(source);
    return { unread: unread.length, names: unread.join(" ") };
}

export const BOARD_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "blocking.validator",
        branch: "a letter inside a template placeholder, which is a seat MENTIONED rather than one held unread",
        seed: [],
        exercise: () => rostering(MENTIONED),
        expect: { unread: 0, names: "" },
    },
    {
        subject: "blocking.validator",
        branch: "a letter standing on the roster itself, which is a seat holding positions it has not opened",
        seed: [],
        exercise: () => rostering(MEMBER),
        expect: { unread: 1, names: "A" },
    },
    {
        subject: "board.analyzer",
        branch: "a record whose fields are separated by blank lines, which a whitespace terminator truncates",
        seed: [],
        exercise: () => recording(INTERRUPTED),
        expect: { records: 1, fields: 2, positions: true },
    },
    {
        subject: "board.analyzer",
        branch: "a record whose fields are contiguous, which terminates at the same delimiter",
        seed: [],
        exercise: () => recording(CONTIGUOUS),
        expect: { records: 1, fields: 2, positions: true },
    },
    {
        subject: "board.analyzer",
        branch: "a heading-shaped line inside an item body, which a record boundary is not taken from",
        seed: [],
        exercise: () => recording(FORGED),
        expect: { records: 1, fields: 3, positions: true },
    },
    {
        subject: "board.analyzer",
        branch: "a heading standing outside every item span, which is the boundary a record is taken from",
        seed: [],
        exercise: () => recording(SUCCEEDING),
        expect: { records: 2, fields: 1, positions: false },
    },
    {
        subject: "board.analyzer",
        branch: "a line inside a nested item span, which anchors to the INNERMOST record rather than to the outer one it also sits in — the anchor an append cannot move, where a reported line moves at the rate the surface grows",
        seed: [],
        exercise: () => ({ anchor: enclosingRecord(FORGED)(6) ?? "" }),
        expect: { anchor: "A-1" },
    },
    {
        subject: "board.analyzer",
        branch: "a line inside a record and outside every item, which anchors to that record",
        seed: [],
        exercise: () => ({ anchor: enclosingRecord(FORGED)(3) ?? "" }),
        expect: { anchor: "A" },
    },
    {
        subject: "board.analyzer",
        branch: "a line standing between two closed records, which anchors to nothing and leaves the line as the only locus there is",
        seed: [],
        exercise: () => ({ anchor: enclosingRecord(SUCCEEDING)(5) ?? "" }),
        expect: { anchor: "" },
    },
];

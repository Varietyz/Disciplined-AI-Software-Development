import type { Finding } from "../types/segment.types.ts";
import { ROSTER } from "../constants/conduct.constants.ts";
import type { RosterRow } from "../types/coverage.types.ts";

const decideObserver = function decideObserver(slug: string, cell: string): string {
    return (
        `${slug} names ${cell} as what observes its checkable half, and no registered check and no entry point ` +
        "carries that name. The cell's vocabulary is the set of things that OBSERVE — a registered check id, an " +
        "id the pipeline's own steps emit, or an entry point named by its command — plus the two markers, and " +
        "every member of the first three resolves against something derived on each run. So a cell naming an " +
        "observer that no longer resolves reads exactly like one that does: the entry states an enforcement " +
        "claim, a reader confirms it, and the set the claim is about says otherwise, with the disagreement " +
        "invisible from either side. Name the observer as the thing it actually resolves to, or move the cell " +
        "to the marker that states the half is unbuilt — and where an observer was renamed rather than " +
        "withdrawn, the cell follows the rename, since the name is the operand this join resolves against"
    );
};

const decideUnstated = function decideUnstated(slug: string): string {
    return (
        `${slug} carries no value in its third cell, so its enforcement half is UNSTATED rather than absent. ` +
        "The cell draws from a closed set of three and each member is a different claim: a registered gate id " +
        "names what OBSERVES the checkable half, the unbuilt marker states that the half is decidable and nobody " +
        "has built it, which is enforcement debt and belongs in a countable backlog, and the absent marker states " +
        "that the entry was assessed and has no checkable half at all. An EMPTY cell states none of the three, so " +
        "an oversight and a considered assessment read identically and the debt figure counts neither. Populate it " +
        "with the member the entry warrants. THIS CHECK READS PRESENCE AND CLAIMS NOTHING MORE: whether the value " +
        "is the RIGHT one is a walk over the entry against the four-question instrument, and whether it NAMES a " +
        "registered observer is decided by the coverage walk, which reads the rule sources this check does not"
    );
};

export const unstatedFinding = function unstatedFinding(row: RosterRow): Finding {
    return {
        actual: `${row.slug} carries no third cell`,
        expected: null,
        healed: false,
        line: row.line,
        locus: row.slug,
        path: ROSTER,
        remediation: {
            action: "declare",
            decide: decideUnstated(row.slug),
            deterministic: false,
            from: row.slug,
            target: ROSTER,
            to: null,
        },
        rule: "conduct/unstatedHalf",
        stack: [
            { check: "row", resolved: row.slug },
            { check: "cell", resolved: "absent" },
        ],
    };
};

export const unresolvedFinding = function unresolvedFinding(row: RosterRow): Finding {
    return {
        actual: `${row.slug} names ${row.cell} as its observer and no registered check carries that id`,
        expected: null,
        healed: false,
        line: row.line,
        locus: row.slug,
        path: ROSTER,
        remediation: {
            action: "declare",
            decide: decideObserver(row.slug, row.cell),
            deterministic: false,
            from: row.cell,
            target: ROSTER,
            to: null,
        },
        rule: "conduct/unresolvedObserver",
        stack: [
            { check: "row", resolved: row.slug },
            { check: "cell", resolved: row.cell },
            { check: "registered", resolved: "absent" },
        ],
    };
};

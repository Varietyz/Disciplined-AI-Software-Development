import type { Finding, Remediation } from "../types/segment.types.ts";
import type { Reference } from "../types/reference.types.ts";

const remediate = function remediate(reference: Reference, path: string, candidate: string | null): Remediation {
    if (candidate !== null) {
        return {
            action: "rename",
            decide: null,
            deterministic: true,
            from: reference.target,
            target: path,
            to: candidate,
        };
    }

    return {
        action: "rename",
        decide:
            "the referenced file does not exist and no single file in the tree carries its basename — " +
            "locate the intended target, or drop the reference if what it pointed at is gone",
        deterministic: false,
        from: reference.target,
        target: path,
        to: null,
    };
};

export const unresolvedFinding = function unresolvedFinding(
    path: string,
    reference: Reference,
    candidates: readonly string[],
): Finding {
    const candidate = candidates.length === 1 ? (candidates[0] ?? null) : null;
    return {
        actual: reference.target,
        expected: candidate,
        healed: false,
        line: reference.line,
        locus: reference.locus,
        path,
        remediation: remediate(reference, path, candidate),
        rule: "reference/unresolved",
        stack: [
            { check: "scheme", resolved: "in-tree" },
            { check: "rootRelative", resolved: "absent" },
            { check: "documentRelative", resolved: "absent" },
            { check: "basenameCandidates", resolved: String(candidates.length) },
        ],
    };
};

export const cycleFinding = function cycleFinding(cycle: readonly string[], graphSize: number): Finding {
    const entry = cycle[0] ?? "";
    return {
        actual: `${cycle.join(" > ")} > ${entry}`,
        expected: null,
        healed: false,
        line: 1,
        locus: cycle.join(" > "),
        path: entry,
        remediation: {
            action: "none",
            decide: "a closed citation loop has no entry point, so a reader following the graph to understand the subject is returned to where they started and no document in the loop is the one that states the thing. Break it by deciding which document OWNS the subject and making the others cite it one-way — never by deleting a citation to satisfy the count, because the loop is a statement that ownership was never settled",
            deterministic: false,
            from: entry,
            target: entry,
            to: null,
        },
        rule: "reference/citationCycle",
        stack: [
            { check: "graph", resolved: String(graphSize) },
            { check: "cycleLength", resolved: String(cycle.length) },
        ],
    };
};

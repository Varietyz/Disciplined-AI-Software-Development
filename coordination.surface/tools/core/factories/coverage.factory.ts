import type { DeclaredRule } from "../types/rule.types.ts";
import type { Finding } from "../types/segment.types.ts";
import { ROSTER } from "../constants/conduct.constants.ts";
import { UNBUILT_HALF } from "../validators/coverage.validator.ts";

export const coverageFinding = function coverageFinding(
    kind: string,
    path: string,
    rule: DeclaredRule,
    actual: string,
    decide: string,
): Finding {
    return {
        actual,
        expected: null,
        healed: false,
        line: rule.line,
        locus: rule.slug,
        path,
        remediation: { action: "declare", decide, deterministic: false, from: rule.slug, target: path, to: null },
        rule: `coverage/${kind}`,
        stack: [
            { check: "declared", resolved: rule.slug },
            { check: "gate", resolved: rule.gate },
            { check: kind, resolved: "failed" },
        ],
    };
};

export const unbuiltFinding = function unbuiltFinding(half: { readonly slug: string; readonly line: number }): Finding {
    return coverageFinding(
        "unbuiltCheckableHalf",
        ROSTER,
        { gate: UNBUILT_HALF, line: half.line, locked: false, slug: half.slug },
        `${half.slug} declares a checkable half that no gate observes`,
        "the entry states that this half is decidable from an artifact and that nothing decides it, which is enforcement debt rather than a settled question — build the check and name it here, or, if the comparison turns out not to be decidable after all, correct the entry so it claims only what is true. A half described in prose is visible to a reader and invisible to every count, which is how a named-but-unbuilt check sits outside the backlog forever while the roster reads as complete",
    );
};

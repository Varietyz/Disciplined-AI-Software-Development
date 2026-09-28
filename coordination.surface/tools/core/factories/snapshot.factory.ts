import type { Finding } from "../types/segment.types.ts";
import { SNAPSHOT_STEP } from "../readers/snapshot.reader.ts";

export const shortenedFinding = function shortenedFinding(
    path: string,
    missing: readonly string[],
    declared: string,
): Finding {
    return {
        actual: `${path} carried members this run cannot find, and its declared removal authority is none`,
        expected: "every member the prior extent carried, still present",
        healed: false,
        line: 0,
        locus: missing[0] ?? path,
        path,
        remediation: {
            action: "declare",
            decide: "restore the members the prior extent carried, or state that the surface's declared lifetime is wrong and change the DECLARATION rather than the content — a surface whose removal authority is none has no party permitted to take a member out of it, so a member that has gone was taken by an operation the declaration forbids. THE COMPARISON IS THREE-VALUED AND ONLY ONE VALUE IS THIS FINDING: unchanged, shortened, and not-comparable are distinct states, and a run whose range differs from the retained one refuses to compute rather than reporting either of the first two, because a comparison across differing ranges answers a question nobody asked. A member that has MOVED under a frozen root is reported as relocated rather than as shortened, since leaving the active tree and leaving the repository are different operations and the extent can tell them apart",
            deterministic: false,
            from: path,
            target: path,
            to: null,
        },
        rule: `${SNAPSHOT_STEP}/shortenedGovernedSurface`,
        stack: [
            { check: "declaredLifetime", resolved: declared },
            { check: "removalAuthority", resolved: "none" },
            { check: "priorExtent", resolved: "retained by the comparison that emits it" },
            { check: "absentNow", resolved: missing.join(" · ") },
        ],
    };
};

export const frozenFinding = function frozenFinding(
    path: string,
    difference: readonly string[],
    declared: string,
): Finding {
    return {
        actual: `${path} differs from the extent retained for it, and its declared mutability is frozen`,
        expected: "the extent retained for this surface, unchanged in either direction",
        healed: false,
        line: 0,
        locus: difference[0] ?? path,
        path,
        remediation: {
            action: "declare",
            decide: "revert the write, or change the DECLARATION that says this surface is frozen. A frozen surface needs no threshold and no shortening test, because its refusal is unconditional: any difference in either direction violates it, so an ADDITION fails here exactly as a removal does. That is why this member consults no extent to DECIDE — the decision is equality — and retains one only so that a difference is observable at all, which is the one thing no property of the surface itself can supply",
            deterministic: false,
            from: path,
            target: path,
            to: null,
        },
        rule: `${SNAPSHOT_STEP}/frozenSurfaceWritten`,
        stack: [
            { check: "declaredLifetime", resolved: declared },
            { check: "mutability", resolved: "frozen" },
            { check: "differenceKind", resolved: "any" },
            { check: "differing", resolved: difference.join(" · ") },
        ],
    };
};

import { BLOCKING_SUFFIX, VENUE_ARCHIVE } from "../core/constants/blocking.constants.ts";

import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { citedAbsolute, contendedCitations } from "../core/validators/claim.validator.ts";
import { lifetimeOf, surfacePath } from "../../config/surface.config.ts";
import type { Contention } from "../core/types/claim.types.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { statSync } from "node:fs";

const BOARD = surfacePath("board");

const finding = function finding(path: string, contention: Contention): Finding {
    return {
        actual: `${contention.key} cites ${contention.cited}, which moved after the claim landed`,
        expected: "a citation whose surface has not moved since the claim was written",
        healed: false,
        line: 0,
        locus: contention.key,
        path,
        remediation: {
            action: "declare",
            decide:
                "the claim's OPERANDS are untouched and what is withdrawn is its STANDING to be quoted — a stale claim " +
                "arrives marked rather than refused, so it costs a reader a glance instead of a read and a reply. Re-read " +
                "the cited surface and either restate the claim against what it now says or leave it standing as a record " +
                "of what was true when it landed. THE STAMP RECORDS WHEN THE TOOL OBSERVED THE SURFACE, which is the " +
                "moment the claim LANDED rather than the moment its author read it, so a claim already stale when composed " +
                "is outside this and stays outside it",
            deterministic: false,
            from: contention.cited,
            target: path,
            to: null,
        },
        rule: "claim/contendedCitation",
        stack: [
            { check: "stamped", resolved: String(contention.stamped) },
            { check: "moved", resolved: String(contention.moved) },
        ],
    };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const findings: Finding[] = [];
        const fanIn: Record<string, string> = {};

        const surfaces = context.paths.filter(
            (path) => path === BOARD || (path.endsWith(BLOCKING_SUFFIX) && !path.startsWith(VENUE_ARCHIVE)),
        );

        const modified = (cited: string): number | null => {
            const absolute = citedAbsolute(context.repoRoot, cited);
            return absolute === null ? null : statSync(absolute).mtimeMs;
        };

        const withdrawn: Record<string, string> = {};

        for (const path of surfaces) {
            const walked = contendedCitations(context.read(path), modified);
            const permanent = lifetimeOf(path)?.retention === "accumulating";

            for (const contention of walked.contended) {
                if (permanent) {
                    withdrawn[`${path} · ${contention.key}`] =
                        `cites ${contention.cited}, which moved after the claim landed`;
                    continue;
                }
                findings.push(finding(path, contention));
            }

            for (const entry of walked.fanIn) {
                fanIn[`${path} · ${entry.cited}`] =
                    `${String(entry.citations)} citation(s), ${String(entry.contended)} contended`;
            }
        }

        return {
            derivations: {
                fanIn,
                reads: "a citation carries the cited surface's state at the moment the claim landed; fan-in is the count of claims resting on one surface and contended is how many of those the surface has moved under",
                standingContract:
                    "A CITATION SITS ON AN ITEM MARKER BY CONSTRUCTION, so whether its claim can be RESTATED is decided " +
                    "by the declared retention of the surface holding that item. Where the surface ACCUMULATES, the item " +
                    "is permanent by its own declared lifetime: the computed remediation offers restating the claim, " +
                    "which that lifetime forbids, or leaving it standing, which changes nothing — so the finding is " +
                    "unclearable from the moment it is raised, and a run reporting many of them is red on a value nothing " +
                    "can move. A permanent red teaches every reader to discount the color and the cost lands on the " +
                    "findings beside it rather than on itself, so the standing is WITHDRAWN HERE as a derivation and the " +
                    "reader who is about to quote a claim is still told its operand moved. Where the surface is " +
                    "CURRENT-TRUTH the item is drainable by its handler, the claim can be withdrawn with it, and the " +
                    "finding stands. The verdict on the claim is untouched in both cases — what is withdrawn is its " +
                    "standing to be quoted, which is the only thing a moved operand actually damages",
                surfaces,
                withdrawnStandings: withdrawn,
            },
            findings,
            healed: [],
        };
    },
    extensions: [".md"],
    heals: false,
    invariant: "a claim whose cited surface moved after it landed is reported rather than quoted",
    jurisdiction: "all",
    kinds: ["contendedCitation"],
    readsTree:
        "the question is when a cited surface was last MODIFIED, which is a property of the tree rather than of any " +
        "file's contents — a context read returns the text and never the moment, so no declared input can supply it and " +
        "no synthetic sample can carry it. The tree read is bounded to the paths already named by stamps on the surfaces " +
        "this walk was handed, so it reaches nothing a claim does not itself cite",

    stage: "content",
};

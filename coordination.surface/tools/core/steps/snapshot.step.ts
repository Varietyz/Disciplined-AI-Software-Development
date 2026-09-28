import type { StepOptions, StepOutcome } from "../types/rule.types.ts";
import { ANCHOR_KINDS } from "../analyzers/snapshot.analyzer.ts";
import { SNAPSHOT_STEP } from "../readers/snapshot.reader.ts";
import { comparison } from "../comparators/snapshot.comparator.ts";
import { writeRuleReport } from "../reporters/rule.reporter.ts";

const STEP = SNAPSHOT_STEP;

export const KINDS: readonly string[] = [`${STEP}/shortenedGovernedSurface`, `${STEP}/frozenSurfaceWritten`];

const INVARIANT =
    "a surface whose declared lifetime forbids removal never loses a member between runs, and one whose declared mutability is frozen never changes at all, decided by comparing the current extent against the extent this comparison itself retained rather than by any property of the surface's name or path";

export const snapshotStage = function snapshotStage(options: StepOptions, paths: readonly string[]): StepOutcome {
    if (options.bypass.includes(STEP)) {
        return {
            findings: [],
            stage: { bypassed: true, findings: 0, healed: 0, invariant: INVARIANT, rule: STEP, stage: "meta" },
        };
    }

    const { carried, current, findings, memberless, renamed, retained, surfaces, verdicts } = comparison(
        options,
        paths,
    );

    writeRuleReport(options.repoRoot, STEP, {
        authoritative: options.authoritative,
        derivations: {
            anchorRange:
                "a member is addressed ONLY by an ALLOCATED id — the per-writer record fence, whose key a tool issues and other surfaces cite — because an allocated key is the one identity in this tree whose stability is enforced rather than conventional. EVERY AUTHORED IDENTITY FAILS THE SAME WAY. A heading's identity IS its prose, so rewording a title reads as removing a member. A table row's identity is its first cell, which an author rewrites whenever the row's subject changes. Both are the same shape: a surface may declare mutability OWNER-REWRITABLE and removal NONE at once, which is a member whose IDENTITY may be rewritten while its CONTENT may not be removed, and no identity anchor can represent that state. A rename detector would be the wrong repair — matching a vanished key to a new one by position or by resemblance is the layout and heuristic pair this tree refuses — so the operand narrows instead. THE PRICE IS LARGE AND IS STATED RATHER THAN HIDDEN: only surfaces carrying per-writer records get member-level observation, which is the venues and the board; the accumulator, the agenda, the templates and every other declared surface fall back to a PATH-level extent, where losing the whole file is observed and losing one entry inside it is NOT. Recovering them needs an allocated id per entry, which is a change to those surfaces rather than to this comparison",
            appearanceBound:
                "A FILE APPEARING UNDER A FROZEN ROOT IS FIRST-SEEN RATHER THAN A DIFFERENCE, AND THAT IS CORRECT RATHER THAN A GAP — WHICH IS WORTH STATING BECAUSE THE OPPOSITE IS THE OBVIOUS READING. The comparison ranges over the surfaces the retained extent NAMES, so a path present now and absent from that extent has nothing to be compared against and is recorded as first-seen. The frozen axis therefore observes what happens to a surface it already tracks — a member added or removed — and never observes a surface ARRIVING. That is the right shape for this root, because an archive ACCRETES by design: a venue moving into it is the one operation the whole surface exists to receive, so a check firing on an appearance would report the correct operation as a defect on every convergence. WHAT IS GIVEN UP IS THE APPEARANCE THAT WAS NOT AN ARCHIVAL, and nothing here distinguishes the two — the discriminator is the PROVENANCE of the write rather than any property of the file, so it is not available to a comparison over extents. Published rather than left implicit, because a frozen declaration reads as forbidding every write and this mechanism observes only the ones that land inside a surface it already holds",
            carriedToANewPath: renamed,
            comparability:
                "a comparison is taken only where the retained extent was measured over the SAME range AND under the SAME anchor kinds. The second operand matters because narrowing what counts as a member made every retained extent report its dropped kind as a lost member, so a change to the DEFINITION of a member is a change of range by another name — and a comparison across two definitions produces a confident shortening on every surface at once, which is the loudest possible false positive from the smallest possible edit",
            comparedAgainst:
                retained === null ? "no prior extent — this run is the first that could take one" : retained.range,
            markBound:
                "A MEMBERLESS SURFACE THAT IS ABSENT IS IDENTIFIED AS MOVED ONLY WHERE ITS CONTENT MARK IS CARRIED BY A PATH THE PRIOR EXTENT DID NOT HOLD, AND A MATCH IS PROOF RATHER THAN A GUESS. The mark is derived from the surface's own bytes, so an equal mark on a path that was not in the baseline is the same content under a new name — which is a move, decidable, with no candidate ranking and no nearest-neighbor reasoning anywhere in it. WHAT THIS RECOVERS IS EXACTLY ONE OF THE THREE COLLAPSED CASES AND THE OTHER TWO ARE UNCHANGED: a rename that preserves content is now named, while a rename that also edits the content, an archive and a deletion remain one undistinguished absence reported as not-comparable. So the published loss shrinks rather than closing, which is stated because a mechanism that recovers part of a gap reads as having closed it. The asymmetry is deliberate: a MATCH can only be produced by identical content, so this adds no verdict that could be wrong, and the absence of a match asserts nothing at all rather than asserting a deletion",
            measuredThisRun: { anchorKinds: ANCHOR_KINDS, range: options.scope, surfaces },
            memberlessAndAbsent: memberless,
            memberlessBound:
                "A SURFACE WHOSE PRIOR EXTENT NAMED NO MEMBER AND WHICH IS ABSENT NOW IS REPORTED AS NOT-COMPARABLE, AND THAT IS A PUBLISHED LOSS OF COVERAGE RATHER THAN A CLEAN RESULT. Anchors are the only operand this comparison has, so a surface that carried none gives it nothing to compare: a rename, an archive and a deletion all present as the same absence, and every one of them is consistent with the extent. The earlier form called that case SHORTENED and named the PATH ITSELF as the missing member, which asserts that members went missing from a surface the extent recorded as holding none — a claim with no operand behind it, and one that fires on every ordinary rename of a surface nobody has written to yet. On a renumbered venue, the true reading is that the file moved and the false reading is that a governed surface lost content its declaration forbids anyone to remove. What is given up is the genuine deletion of a memberless governed surface, which this step no longer distinguishes from its rename; what is kept is that every finding it does emit names a member the prior extent actually held. The paths are published here so the case is loud rather than absent, and a mechanism that can tell the three apart resolves it by an operand other than anchors",
            persistence:
                "A SHORTENED SURFACE KEEPS ITS PRIOR EXTENT IN THE BASELINE rather than the extent that lost a member, so the finding STANDS until the member is restored. Accepting the shortened state would make the violation its own baseline, the next run would compare the loss against itself and report unchanged, and the refusal would be a one-run window on a surface whose whole declaration is that it never loses anything — a mechanism that observes the loss, records it correctly, and then forgets it. A RELOCATED surface leaves the baseline, because its members are now carried by the frozen path that received them and retaining both would report the move twice",
            population:
                "every path in this run's scope whose DECLARED lifetime forbids removal or declares the surface frozen, resolved through the lifetime resolver rather than matched against a name — so a surface entering that class enters this population by a declaration edit and a surface leaving it leaves with no edit here, and a path the declaration does not reach contributes nothing rather than a passing comparison",
            reached: [...current.keys()],
            retainedExtent: carried,
            retention:
                "the prior extent lives in THIS report and nowhere else, so it is an operand of the comparison that emits it rather than a record of the past — remove the comparison and the value stops being written. A NARROWED RUN CARRIES THE RETAINED EXTENT THROUGH UNCHANGED and publishes what it measured beside it under its own name, because a narrowed measurement written into the baseline is a report about a different subject wearing the same name — and the baseline it would replace is the only thing a later whole-scope run has to compare against, so the destruction would be performed by the cheapest and most correct-feeling action available",
            verdicts,
        },
        findings,
        healed: [],
        invariant: INVARIANT,
        rule: STEP,
        scanned: current.size,
        scope: options.scope,
        stage: "meta",
        verdict: findings.length === 0 ? "pass" : "fail",
    });

    return {
        findings,
        stage: {
            bypassed: false,
            findings: findings.length,
            healed: 0,
            invariant: INVARIANT,
            rule: STEP,
            stage: "meta",
        },
    };
};

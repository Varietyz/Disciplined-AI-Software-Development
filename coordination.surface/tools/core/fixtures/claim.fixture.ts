import { surfacePath } from "../../../config/surface.config.ts";
import { writeSetsOverlap } from "../registries/claim.registry.ts";
import { contradictedContracts } from "../validators/governance.validator.ts";
import { contendedCitations } from "../validators/claim.validator.ts";
import { worstOf } from "../comparators/gate.comparator.ts";
import type { BranchFixture, BranchObservation, GateFixture } from "../types/fixture.types.ts";

const BOARD = surfacePath("board");

const CITED = "a-cited-surface.md";

const STALE_ITEM =
    `┌─── AGENT A ───\nAgent A — ACTIVE\n  Owns:    probe\n  Status:  probe\n  Blocked: —\n  Flags:   —\n  Refs:    —\n` +
    `  ┌─── AGENT A-1 ─── kind:artifact at:1000 to:* cites:${CITED}@1000\n  a claim resting on a surface that moved\n` +
    `  └─── END AGENT A-1\n└─── END AGENT A\n`;

const CURRENT_ITEM = STALE_ITEM.split(`cites:${CITED}@1000`).join(`cites:${CITED}@9999999999999`);

function walking(stamp: number, moved: number | null): BranchObservation {
    const source =
        `┌─── AGENT A-1 ─── kind:artifact at:1000 to:* cites:${CITED}@${String(stamp)}\n` + "a claim\n└─── END AGENT A-1\n";

    const walked = contendedCitations(source, () => moved);

    return {
        contended: walked.contended.length,
        fanIn: walked.fanIn.length,
        counted: walked.fanIn[0]?.citations ?? 0,
        key: walked.contended[0]?.key ?? "",
    };
}

export const CLAIM_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "claim.validator",
        branch: "a cited surface that moved after the claim landed, which withdraws the claim's standing and not its operands",
        seed: [],
        exercise: () => walking(1000, 2000),
        expect: { contended: 1, fanIn: 1, counted: 1, key: "A-1" },
    },
    {
        subject: "claim.validator",
        branch: "a cited surface untouched since the claim landed, counted in the fan-in and contended by nothing",
        seed: [],
        exercise: () => walking(2000, 2000),
        expect: { contended: 0, fanIn: 1, counted: 1, key: "" },
    },
    {
        subject: "claim.validator",
        branch: "a cited surface that no longer resolves, where a missing file is not evidence that a claim went stale",
        seed: [],
        exercise: () => walking(1000, null),
        expect: { contended: 0, fanIn: 1, counted: 1, key: "" },
    },
    {
        subject: "claim.registry",
        branch: "two whole-scope runs, whose write sets are the same tree, so a healing run HOLDS while the other is live",
        seed: [],
        exercise: () => ({ held: writeSetsOverlap("whole", "whole") }),
        expect: { held: true },
    },
    {
        subject: "claim.registry",
        branch: "a live whole-scope run against a narrowed one, where the wider write set contains the narrower and holds it whichever side declared it",
        seed: [],
        exercise: () => ({
            heldByWider: writeSetsOverlap("whole", "tools"),
            heldByNarrower: writeSetsOverlap("tools", "whole"),
        }),
        expect: { heldByWider: true, heldByNarrower: true },
    },
    {
        subject: "claim.registry",
        branch: "two runs over DISJOINT narrow scopes, which mutate nothing in common and therefore hold each other not at all — the positive control, because a predicate that holds every pair has been shown to refuse rather than to discriminate",
        seed: [],
        exercise: () => ({ held: writeSetsOverlap("tools", "config") }),
        expect: { held: false },
    },
    {
        subject: "gate.runner",
        branch: "two fixtures declaring ONE kind where the second PROVES and the first did not — the published map is written per fixture, so a plain assignment keeps whichever landed last and a cell resolving its proof there reads a verdict a sibling refutes",
        seed: [],
        exercise: () => ({ held: worstOf("silent", "proven") }),
        expect: { held: "silent" },
    },
    {
        subject: "gate.runner",
        branch: "the same pair in the other order, which a last-write map gets RIGHT and which is why the defect is invisible — the two orders must agree or the value depends on fixture order rather than on the judgements",
        seed: [],
        exercise: () => ({ held: worstOf("proven", "silent") }),
        expect: { held: "silent" },
    },
    {
        subject: "gate.runner",
        branch: "two fixtures that both clear, which must stay cleared — an aggregation returning the worst of everything would report every multi-fixture kind as broken, which is a check that refuses rather than discriminates",
        seed: [],
        exercise: () => ({ held: worstOf("proven", "exempt") }),
        expect: { held: "exempt" },
    },
    {
        subject: "gate.runner",
        branch: "the first judgement of a kind nothing has judged yet, which takes the arriving state rather than treating an absent prior as a clear one",
        seed: [],
        exercise: () => ({ held: worstOf(undefined, "proven") }),
        expect: { held: "proven" },
    },
    {
        subject: "governance.validator",
        branch: "a DECLARED contract naming its subject key and asserting composite-keyed, beside an array whose members carry no separator — a description and its operand written by ONE producer into ONE file, so the two carry identical provenance and a reader has nothing to prefer one with",
        seed: [],
        exercise: () => ({
            contradicted: contradictedContracts({
                provenKinds: ["literal", "placement"],
                provenKindsShape: { subject: "provenKinds", property: "composite-keyed" },
            }).length,
        }),
        expect: { contradicted: 1 },
    },
    {
        subject: "governance.validator",
        branch: "the same declaration beside an array whose members DO carry the separator, which is the claim being true and is the positive control — a check firing on every declaration would have refused the honest one too",
        seed: [],
        exercise: () => ({
            contradicted: contradictedContracts({
                provenKinds: ["literal/rawPath", "purity/leafClimbsOut"],
                provenKindsShape: { subject: "provenKinds", property: "composite-keyed" },
            }).length,
        }),
        expect: { contradicted: 0 },
    },
    {
        subject: "governance.validator",
        branch: "PROSE that merely mentions the property, which is USE against MENTION and is why the claim is read from a declared field rather than scanned out of a sentence — a token scan cannot tell a key asserting composite-keyed from a key saying the composite operand is elsewhere, and the second is what the honest note beside this very report says",
        seed: [],
        exercise: () => ({
            contradicted: contradictedContracts({
                provenKinds: ["literal", "placement"],
                provenKindsNote: "the composite-keyed operand is kindVerdicts, and this array is not it",
            }).length,
        }),
        expect: { contradicted: 0 },
    },
];

export const CLAIM_GATE_FIXTURES: readonly GateFixture[] = [
    {
        rule: "claim",
        kind: "contendedCitation",
        onDisk: true,
        fires: [
            { path: BOARD, text: STALE_ITEM },
            { path: CITED, text: "a surface written after the claim\n" },
        ],
        passes: [
            { path: BOARD, text: CURRENT_ITEM },
            { path: CITED, text: "a surface written before the claim\n" },
        ],
    },
];

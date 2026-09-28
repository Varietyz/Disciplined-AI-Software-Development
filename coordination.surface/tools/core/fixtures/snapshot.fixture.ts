import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
    contentDivides,
    contentIsImmutable,
    lifetimeOf,
    parseVenueLifetime,
    regionAdmitsRewrite,
    surfacePath,
    type RegionSection,
} from "../../../config/surface.config.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import { ruleReportName } from "../reporters/rule.reporter.ts";
import { snapshotStage } from "../steps/snapshot.step.ts";
import type { BranchFixture, BranchObservation, Sample } from "../types/fixture.types.ts";

const SCOPE = "whole";

const SURFACE = "probe.blocking.md";

const MOVED = "probe-renamed.blocking.md";

const DECLARED = lifetimeOf(SURFACE);

const LIFETIME = DECLARED === null ? "" : `${DECLARED.retention} · ${DECLARED.mutability} · ${DECLARED.removal}`;

const PAIRED = "┌─── AGENT A ───\nbody\n└─── END AGENT A\n┌─── AGENT B ───\nbody\n└─── END AGENT B\n";

const SINGLE = "┌─── AGENT A ───\nbody\n└─── END AGENT A\n";

const MEMBERLESS = "a governed surface carrying no record delimiter at all\n";

const MARK_SEED = 5381;

const MARK_SHIFT = 33;

const MARK_MODULUS = 4294967296;

function markOf(source: string): string {
    let held = MARK_SEED;
    for (const character of source) held = (held * MARK_SHIFT + (character.codePointAt(0) ?? 0)) % MARK_MODULUS;
    return String(held);
}

function labelOf(path: string): string {
    const declared = lifetimeOf(path);
    return declared === null ? "" : `${declared.retention} · ${declared.mutability} · ${declared.removal}`;
}

function retained(
    surfaces: Readonly<Record<string, { anchors: readonly string[]; mark: string; lifetime?: string }>>,
): Sample {
    const held: Record<string, unknown> = {};
    for (const [path, extent] of Object.entries(surfaces)) {
        held[path] = { lifetime: extent.lifetime ?? LIFETIME, anchors: extent.anchors, mark: extent.mark };
    }

    return {
        path: `${GENERATED_DIR}/${ruleReportName("snapshot")}`,
        text: JSON.stringify({
            rule: "snapshot",
            verdict: "pass",
            derivations: { retainedExtent: { range: SCOPE, anchorKinds: ["record"], surfaces: held } },
        }),
    };
}

function verdictOf(root: string, path: string): string {
    const emitted = resolve(root, GENERATED_DIR, ruleReportName("snapshot"));
    if (!existsSync(emitted)) return "";

    const parsed: unknown = JSON.parse(readFileSync(emitted, "utf8"));
    if (typeof parsed !== "object" || parsed === null) return "";

    const derivations = (parsed as { derivations?: unknown }).derivations;
    if (typeof derivations !== "object" || derivations === null) return "";

    const verdicts = (derivations as { verdicts?: unknown }).verdicts;
    if (typeof verdicts !== "object" || verdicts === null) return "";

    const held = (verdicts as Record<string, unknown>)[path];
    return typeof held === "string" ? held : "";
}

function exercise(root: string, paths: readonly string[], watched: string): BranchObservation {
    const outcome = snapshotStage(
        { repoRoot: root, scope: SCOPE, bypass: [], fix: false, scanned: paths.length, authoritative: true },
        paths,
    );
    const first = outcome.findings[0];

    return {
        findings: outcome.findings.length,
        kind: first === undefined ? "" : first.rule,
        locus: first === undefined ? "" : first.locus,
        verdict: verdictOf(root, watched),
    };
}

const BOTH_ANCHORS = { anchors: ["record:A", "record:B"], mark: markOf(PAIRED) };

const ARCHIVED = `${surfacePath("venue_archive")}/probe.blocking.md`;

const ARCHIVED_LIFETIME = labelOf(ARCHIVED);

const ARCHIVED_BOTH = { anchors: ["record:A", "record:B"], mark: markOf(PAIRED), lifetime: ARCHIVED_LIFETIME };

function reaches(slot: string, member: string): BranchObservation {
    const root = surfacePath(slot);

    return {
        root: lifetimeOf(root) !== null,
        member: lifetimeOf(`${root}/${member}`) !== null,
    };
}

function immutability(target: string): BranchObservation {
    return { immutable: contentIsImmutable(target) };
}

function splitting(target: string): BranchObservation {
    return { divides: contentDivides(target) };
}

function rewritableAt(target: string, span: "item" | "field"): BranchObservation {
    return { admits: regionAdmitsRewrite(target, span) };
}

function rewritableIn(target: string, span: "item" | "row", section: RegionSection | null): BranchObservation {
    return { admits: regionAdmitsRewrite(target, span, section) };
}

const TABLE_HEAD = "| region | span | section | retention | mutability | removal | why |\n|---|---|---|---|---|---|---|\n";

const DEFAULT_ROW = "| the file default | — | — | `accumulating` | `append-only` | `none` | the reason |\n";

const REGION_ROW = "| directive | `item` | `DIRECTIVES` | `discharged` | `owner-rewritable` | `handler` | the reason |\n";

function parsing(source: string): BranchObservation {
    try {
        const held = parseVenueLifetime(source);
        return { failed: false, regions: held.regions.length, mutability: held.fileDefault.mutability };
    } catch {
        return { failed: true, regions: 0, mutability: "" };
    }
}

export const SNAPSHOT_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "surface.config",
        branch: "a surface declared OWNER-REWRITABLE, where deciding immutability from retention and removal alone classifies content its own writer corrects every round as content that cannot change — and the skip built on it then suppresses findings a party could act on, which is the opposite of the unreachable-remediation reason the skip exists for",
        seed: [],
        exercise: () => immutability(SURFACE),
        expect: { immutable: false },
    },
    {
        subject: "surface.config",
        branch: "a surface declared FROZEN, which is the population the skip was built for and must still resolve immutable",
        seed: [],
        exercise: () => immutability(surfacePath("venue_archive")),
        expect: { immutable: true },
    },
    {
        subject: "surface.config",
        branch: "a surface whose declared lifetime DIVIDES, where scanning it whole reports findings on an append-only region no party may rewrite and skipping it whole abandons the region its owner corrects every round",
        seed: [],
        exercise: () => splitting(SURFACE),
        expect: { divides: true },
    },
    {
        subject: "surface.config",
        branch: "a surface declaring one lifetime for all of its content, which must NOT divide — a split reported where none is declared would silence a region on nobody's authority",
        seed: [],
        exercise: () => splitting(surfacePath("venue_archive")),
        expect: { divides: false },
    },
    {
        subject: "surface.config",
        branch: "the ITEM region of a surface whose file-level lifetime is owner-rewritable, which is the whole point of a per-region declaration — a mechanism resolving the FILE gets the field's answer and reports that a position may be rewritten, so a rule whose repair is a rewrite fires forever on a span nothing may rewrite",
        seed: [],
        exercise: () => rewritableAt(SURFACE, "item"),
        expect: { admits: false },
    },
    {
        subject: "surface.config",
        branch: "the FIELD region of that same surface, which is the positive control and must still admit a rewrite — a region resolver answering false everywhere would silence a region its owner corrects every round, which is the failure the file-level resolver has in the other direction",
        seed: [],
        exercise: () => rewritableAt(SURFACE, "field"),
        expect: { admits: true },
    },
    {
        subject: "surface.config",
        branch: "a lifetime table carrying its file default and one region, which is the derivation replacing a copy — the configuration held the same values as the template because a party copied one into the other, and two declarations of one fact disagree the moment either moves",
        seed: [],
        exercise: () => parsing(`${TABLE_HEAD}${DEFAULT_ROW}${REGION_ROW}`),
        expect: { failed: false, regions: 1, mutability: "append-only" },
    },
    {
        subject: "surface.config",
        branch: "a table carrying regions and NO file default, which must FAIL THE LOAD rather than fall back — a fallback here reinstates the copy the derivation exists to remove and does it silently, on the one surface every mechanism joins on",
        seed: [],
        exercise: () => parsing(`${TABLE_HEAD}${REGION_ROW}`),
        expect: { failed: true, regions: 0, mutability: "" },
    },
    {
        subject: "surface.config",
        branch: "a row whose mutability is outside the closed set, which is SKIPPED rather than admitted — a value the vocabulary does not carry resolves in no mechanism while reading as a region that exists, so admitting it would put an ungoverned lifetime into the one operand every join reads",
        seed: [],
        exercise: () =>
            parsing(`${TABLE_HEAD}${DEFAULT_ROW}| probe | \`item\` | — | \`accumulating\` | \`carved\` | \`none\` | r |\n`),
        expect: { failed: false, regions: 0, mutability: "append-only" },
    },
    {
        subject: "surface.config",
        branch: "an ITEM inside the directives section, which carries a lifetime opposite to the item that is a position — a directive is discharged by completion and removed by its handler where a position stands forever, and the two are the same SPAN in the same file, so keying on span alone would have applied one region's lifetime to the other's members",
        seed: [],
        exercise: () => rewritableIn(SURFACE, "item", "DIRECTIVES"),
        expect: { admits: true },
    },
    {
        subject: "surface.config",
        branch: "the same span with NO section named, which must fall past every section-scoped region to the file default — a query that cannot say where it is looking is told nothing rather than told the wrong thing, and this is what keeps a position append-only now that a directive region exists beside it",
        seed: [],
        exercise: () => rewritableIn(SURFACE, "item", null),
        expect: { admits: false },
    },
    {
        subject: "surface.config",
        branch: "a ROW inside the lifetime section, which is frozen where the roster line is a rewritable row in the same file — the second pair proving the section is doing the work, because both members share a span and differ only in place",
        seed: [],
        exercise: () => rewritableIn(SURFACE, "row", "LIFETIME"),
        expect: { admits: false },
    },
    {
        subject: "surface.config",
        branch: "the item region of a surface declaring NO regions at all, which falls back to the file's own lifetime rather than to a default nobody declared",
        seed: [],
        exercise: () => rewritableAt(surfacePath("venue_archive"), "item"),
        expect: { admits: false },
    },
    {
        subject: "surface.config",
        branch: "a root declaring a lifetime for a directory OF MEMBERS, where resolving for the node alone reads as coverage from either end while every file a party actually writes resolves to nothing",
        seed: [],
        exercise: () => reaches("models", "coupling.model.md"),
        expect: { root: true, member: true },
    },
    {
        subject: "surface.config",
        branch: "the same shape on the root every seat is told to read before its first edit, which is the member class furthest from the declaration that governs it",
        seed: [],
        exercise: () => reaches("roles", "probe.a.role.md"),
        expect: { root: true, member: true },
    },
    {
        subject: "snapshot.step",
        branch: "a governed surface carrying every member the retained extent named",
        seed: [{ path: SURFACE, text: PAIRED }, retained({ [SURFACE]: BOTH_ANCHORS })],
        exercise: (root) => exercise(root, [SURFACE], SURFACE),
        expect: { findings: 0, kind: "", locus: "", verdict: "unchanged" },
    },
    {
        subject: "snapshot.step",
        branch: "a governed surface that lost a member the retained extent named",
        seed: [{ path: SURFACE, text: SINGLE }, retained({ [SURFACE]: BOTH_ANCHORS })],
        exercise: (root) => exercise(root, [SURFACE], SURFACE),
        expect: { findings: 1, kind: "snapshot/shortenedGovernedSurface", locus: "record:B", verdict: "shortened" },
    },
    {
        subject: "snapshot.step",
        branch: "a surface whose declared mutability is frozen, carrying every member its retained extent named",
        seed: [{ path: ARCHIVED, text: PAIRED }, retained({ [ARCHIVED]: ARCHIVED_BOTH })],
        exercise: (root) => exercise(root, [ARCHIVED], ARCHIVED),
        expect: { findings: 0, kind: "", locus: "", verdict: "unchanged" },
    },
    {
        subject: "snapshot.step",
        branch: "a surface whose declared mutability is frozen, differing from its retained extent",
        seed: [{ path: ARCHIVED, text: SINGLE }, retained({ [ARCHIVED]: ARCHIVED_BOTH })],
        exercise: (root) => exercise(root, [ARCHIVED], ARCHIVED),
        expect: { findings: 1, kind: "snapshot/frozenSurfaceWritten", locus: "record:B", verdict: "shortened" },
    },
    {
        subject: "snapshot.step",
        branch: "a memberless surface absent from its path whose content mark is carried elsewhere",
        seed: [
            { path: MOVED, text: MEMBERLESS },
            retained({ [SURFACE]: { anchors: [], mark: markOf(MEMBERLESS) } }),
        ],
        exercise: (root) => exercise(root, [MOVED], SURFACE),
        expect: { findings: 0, kind: "", locus: "", verdict: "relocated" },
    },
    {
        subject: "snapshot.step",
        branch: "a memberless surface absent from its path with its mark carried nowhere",
        seed: [retained({ [SURFACE]: { anchors: [], mark: markOf(MEMBERLESS) } })],
        exercise: (root) => exercise(root, [], SURFACE),
        expect: { findings: 0, kind: "", locus: "", verdict: "not-comparable" },
    },
];

import { AGENT_INDEX, BOARD_PATH, COMMS_TEMPLATE, PROJECTION_HOST } from "../core/constants/board.constants.ts";
import { BLOCKING_SUFFIX, VENUE_ARCHIVE } from "../core/constants/blocking.constants.ts";
import type { BoardRecord, StateDrift } from "../core/types/board.types.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import {
    checkAddressees,
    checkRecord,
    checkStateDrift,
    healStateDrift,
    peerSet,
    stateDrift,
} from "../core/validators/board.validator.ts";
import { checkDelimiters, checkItemFences, checkItemLetters } from "../core/inspectors/fence.inspector.ts";
import {
    checkDuplicateFields,
    checkIndex,
    checkItemAddressing,
    checkMarkers,
    checkReadable,
    checkTemplateDrift,
} from "../core/inspectors/board.inspector.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { boardRecords } from "../core/analyzers/board.analyzer.ts";
import { checkGateState } from "../core/inspectors/report.inspector.ts";
import { checkProjection } from "../core/inspectors/projection.inspector.ts";
import { writeBoardIfUnmoved } from "../core/generators/board.generator.ts";

const NO_DRIFT = "none — no record's marker disagrees with its binding";

const DRIFT_HEALED =
    "HEALED IN THIS RUN — the markers below are what the walk MEASURED before it wrote, retained because " +
    "the heal is a comparison and the earlier state is its operand. They are not a live disagreement, " +
    "and reading them as current state is the reading a derivation invites, which is why the " +
    "disposition sits beside them rather than being inferred from an empty findings list";

const DRIFT_STANDING =
    "STANDING — the markers below disagree with their bindings and this run did not write, so each is " +
    "reported as a finding";

const PROJECTION_ABSENT =
    "ABSENT — no governance document is declared, so the branch that checks the projection does not run";

interface DriftOutcome {
    readonly disposition: string;
    readonly drifts: readonly StateDrift[];
    readonly findings: readonly Finding[];
    readonly healed: readonly string[];
}

const indexOf = function indexOf(context: RuleContext): string {
    return context.exists(AGENT_INDEX) ? context.read(AGENT_INDEX) : "";
};

const driftOutcome = function driftOutcome(
    context: RuleContext,
    fix: boolean,
    source: string,
    records: readonly BoardRecord[],
): DriftOutcome {
    const drifts = stateDrift(records, indexOf(context));
    if (drifts.length === 0) {
        return { disposition: NO_DRIFT, drifts, findings: [], healed: [] };
    }

    const applied = fix && writeBoardIfUnmoved(context.repoRoot, source, healStateDrift(source, drifts));
    if (applied) {
        return { disposition: DRIFT_HEALED, drifts, findings: [], healed: [BOARD_PATH] };
    }

    return { disposition: DRIFT_STANDING, drifts, findings: checkStateDrift(drifts), healed: [] };
};

const projectionFindings = function projectionFindings(
    context: RuleContext,
    venues: readonly string[],
): Finding[] | null {
    const host = PROJECTION_HOST;
    return host === null || !context.exists(host) ? null : checkProjection(context.read(host), venues);
};

const recordFindings = function recordFindings(
    context: RuleContext,
    source: string,
    records: readonly BoardRecord[],
): Finding[] {
    const index = indexOf(context);
    const peers = peerSet(records, index);
    return [
        ...records.flatMap((record) => checkRecord(record, peers)),
        ...checkAddressees(source, index),
        ...checkGateState(source, context.repoRoot),
    ];
};

const surfaceFindings = function surfaceFindings(
    context: RuleContext,
    source: string,
    records: readonly BoardRecord[],
): Finding[] {
    return [
        ...checkDelimiters(source, records),
        ...checkMarkers(source),
        ...checkReadable(source),
        ...checkDuplicateFields(source, records),
        ...checkItemFences(source),
        ...checkItemLetters(source),
        ...checkItemAddressing(source),
        ...(context.exists(AGENT_INDEX) ? checkIndex(records, context.read(AGENT_INDEX)) : []),
        ...(context.exists(COMMS_TEMPLATE) ? checkTemplateDrift(context.read(COMMS_TEMPLATE)) : []),
    ];
};

export const rule: RuleDeclaration = {
    check(context: RuleContext, fix: boolean): RuleResult {
        if (!context.paths.includes(BOARD_PATH)) {
            return {
                derivations: { board: "absent from this run's path set", skippedAsOutOfScope: [BOARD_PATH] },
                findings: [],
                healed: [],
            };
        }

        const source = context.read(BOARD_PATH);
        const records = boardRecords(source);
        const drift = driftOutcome(context, fix, source, records);
        const venues = context.paths
            .filter((path) => path.endsWith(BLOCKING_SUFFIX))
            .filter((path) => !path.startsWith(VENUE_ARCHIVE));
        const projection = projectionFindings(context, venues);

        return {
            derivations: {
                board: "present",
                projection: projection === null ? PROJECTION_ABSENT : "checked",
                recordsWalked: records.map((record) => record.label),
                stateDrift: drift.drifts.map((each) => `${each.letter}: ${each.marker} here, ${each.bound} bound`),
                stateDriftDisposition: drift.disposition,
                venuesSeen: venues,
            },
            findings: [
                ...drift.findings,
                ...(projection ?? []),
                ...recordFindings(context, source, records),
                ...surfaceFindings(context, source, records),
            ],
            healed: [...drift.healed],
        };
    },
    extensions: [],
    heals: true,
    invariant: "the coordination board carries current truth in exactly its declared schema",
    jurisdiction: "all",
    kinds: [
        "badState",
        "danglingAddressee",
        "danglingAnswer",
        "derivedStateDrift",
        "duplicateField",
        "duplicateIndexBinding",
        "extraField",
        "foreignItemLetter",
        "interleavedRecord",
        "malformedItemFence",
        "missingField",
        "oversizedProjection",
        "phantomProjection",
        "repeatedClaim",
        "selfAnswer",
        "staleGateState",
        "staleMarker",
        "templateDrift",
        "undelimitedRecord",
        "unindexedAgent",
        "unreadableField",
        "unresolvedAddressing",
        "unstampedItem",
    ],

    reads:
        PROJECTION_HOST === null
            ? [BOARD_PATH, AGENT_INDEX, COMMS_TEMPLATE]
            : [BOARD_PATH, PROJECTION_HOST, AGENT_INDEX, COMMS_TEMPLATE],

    stage: "content",
};

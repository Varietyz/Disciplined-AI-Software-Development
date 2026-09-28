import { AGENDA, BLOCKING_SUFFIX, VENUE_ARCHIVE, VENUE_TEMPLATE } from "../core/constants/blocking.constants.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { absorptionState, hasReadMark } from "../core/resolvers/converge.resolver.ts";
import { agendaRows, disorderedRows, plannedInvariants } from "../core/readers/agenda.reader.ts";
import { historyPath, surfacePath } from "../../config/surface.config.ts";
import { BOARD_PATH } from "../core/constants/board.constants.ts";
import type { Finding } from "../core/types/segment.types.ts";
import type { VenueScope } from "../core/types/blocking.types.ts";
import { blockingFinding } from "../core/factories/blocking.factory.ts";
import { convergenceEdges } from "../core/validators/converge.validator.ts";
import { venueFindings } from "../core/inspectors/blocking.inspector.ts";

const basenameOf = function basenameOf(path: string): string {
    const cut = path.lastIndexOf("/");
    return cut === -1 ? path : path.slice(cut + 1);
};

const venueFiles = function venueFiles(paths: readonly string[]): string[] {
    return paths
        .filter((path) => path.endsWith(BLOCKING_SUFFIX))
        .filter((path) => basenameOf(path).length > BLOCKING_SUFFIX.length)
        .toSorted((left, right) => left.localeCompare(right, "en"));
};

const isArchived = function isArchived(path: string): boolean {
    return path.startsWith(VENUE_ARCHIVE);
};

const concurrentFindings = function concurrentFindings(opened: readonly string[], open: readonly string[]): Finding[] {
    if (opened.length <= 1) {
        return [];
    }
    return opened.map((path) =>
        blockingFinding(
            "concurrentVenues",
            path,
            `${String(opened.length)} venue files carry a read mark and are therefore OPEN: ${opened.join(", ")} — of the ${String(open.length)} venue files standing, the rest are created and unopened`,
            "exactly one OPENED venue in the active tree, so the hold is serialized",
            "A HOLD IS SERIALIZED OR IT IS NOT A HOLD, AND THIS AXIS MEASURES OPENNESS FROM THE ROSTER RATHER THAN PRESENCE ON THE DISK. The two are different properties over different operands: presence says a file exists, openness says a seat has marked it read and the discussion has begun. A venue is CREATED at convergence and OPENED when its predecessor leaves, so a created-not-opened successor is the intended state of a series that carries a question forward — and an axis reading presence reports it as a violation of an invariant it does not breach. The operand is the roster line, which is where the created-versus-opened distinction is already recorded and checkable from the artifact rather than from a rule. WHAT THIS AXIS STILL DOES NOT REACH, STATED SO A GREEN IS NOT READ AS MORE THAN IT IS: the successor edge reads FILE EXISTENCE, so an early creation still discharges a brake by an act the roster says is not an opening — two mechanisms reading two operands for one concept, with only one of them corrected here. That remains a separate question about what the successor edge is FOR, and its own repair. Converge and archive the predecessor before a second venue is opened; a successor already created is left unmarked until it does",
        ),
    );
};

const distributionFindings = function distributionFindings(repoRoot: string, path: string): Finding[] {
    const name = basenameOf(path);
    const absorption = absorptionState(repoRoot, name);
    if (absorption === null || absorption.declaring.length <= 1) {
        return [];
    }
    return [
        blockingFinding(
            "duplicateDistribution",
            path,
            `${String(absorption.declaring.length)} planning surfaces declare that they distribute ${name}: ${absorption.declaring.join(", ")}`,
            "exactly one planning surface declaring any one venue, so the work set is a single enumeration",
            "A SEARCH THAT STOPS AT ITS FIRST MATCH REPORTS A COMPLETE ANSWER OVER A PARTIAL READ. The absorption ordering resolves the work set by scanning the planning root for a surface declaring this venue, and with more than one declaring it the resolution lands on whichever the directory listing yielded first — so every item enumerated on every other declaring surface is invisible to it, and the venue can satisfy absorption while outstanding work stands on a surface the walk never opened. Which one wins is then a property of the filesystem rather than a decision anyone took, and the failure is silent in the direction that CLEARS a gate, which is the worse of the two directions. The repair is collapse rather than selection: a fact declared twice is collapsed before anything compares it, because a mechanism paid on every run to choose between two declarations is a mechanism paid to detect a state that need not exist. Retire the superseded declaration or fold its items into the surviving one; a declaration naming a venue that has left the active tree is discharged and is deleted rather than annotated",
            absorption.declaring.join(", "),
        ),
    ];
};

const convergenceOf = function convergenceOf(path: string, source: string, scope: VenueScope): [string, string][] {
    const name = basenameOf(path);
    const edges = convergenceEdges(
        scope.repoRoot,
        path,
        source,
        scope.boardText,
        scope.indexText,
        scope.archive,
        scope.open,
        plannedInvariants(scope.agenda),
    );
    return edges.map((edge) => [`${name} · ${edge.edge}`, edge.holds ? "holds" : `BLOCKS — ${edge.detail}`]);
};

const scheduleFindings = function scheduleFindings(agenda: string): Finding[] {
    return disorderedRows(agenda).map((row) =>
        blockingFinding(
            "disorderedScheduleRow",
            AGENDA,
            `the schedule row ${row.ordinal} sits after ${row.after}, which its own ordinal places before it`,
            "every schedule row appearing in the order its own ordinal states, with a lettered ordinal sorting between its number and the next",
            "A SCHEDULE ROW CARRIES TWO FACTS IN ONE COLUMN — the ordinal a raised file must take, and the POSITION in the table, which is the sequence. A LETTERED ordinal IS ITSELF A SEQUENCE CLAIM: it records the predecessor whose successor edge the row was declared under, so it states WHERE the row belongs rather than exempting it from belonging anywhere. What a letter is licensed to differ from is APPEND ORDER — a row inserted after later rows were already written sits at its own ordinal rather than at the end — and the comparison therefore ORDERS lettered ordinals rather than skipping them, sorting each between its own number and the next. SKIPPING THEM WAS INVISIBILITY IN BOTH DIRECTIONS rather than exemption: a skipped row is never reported and never updates the running baseline, so it can neither fail nor constrain anything after it. The repair is the row's own ordinal rather than an editor's preference: the ordinal is a claim its author wrote and the position is a consequence of where it was appended, so the ordinal is the tiebreak and the row moves to the place its own number implies. WHERE THAT MOVE IS HELD BY A STANDING DIRECTIVE the finding stands with the hold named beside it — an unreachable remediation is a mechanism defect only where nothing is scheduled to change the population, and a hold that lifts is exactly such a schedule",
            row.invariant,
        ),
    );
};

const templateAbsent = function templateAbsent(): Finding {
    return blockingFinding(
        "templateAbsent",
        VENUE_TEMPLATE,
        "the venue template the record schema derives from does not exist",
        "a venue template declaring the record fields every venue answers to",
        "the schema is DERIVED from the template on every run so this check cannot drift from the contract it enforces — and an absent template resolves that contract to an empty set, which passes every venue vacuously. A green over an unenforceable schema is worse than a red, so the template is raised rather than the check relaxed",
    );
};

const readOr = function readOr(context: RuleContext, path: string): string {
    return context.exists(path) ? context.read(path) : "";
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const venues = venueFiles(context.paths);
        const open = venues.filter((path) => !isArchived(path));
        const skippedAsArchivedVenue = venues.filter(isArchived);

        if (open.length > 0 && !context.exists(VENUE_TEMPLATE)) {
            return { derivations: { open }, findings: [templateAbsent()], healed: [] };
        }

        const scope: VenueScope = {
            agenda: readOr(context, AGENDA),
            archive: readOr(context, historyPath()),
            boardText: readOr(context, BOARD_PATH),
            indexText: readOr(context, surfacePath("agent_index")),
            open,
            repoRoot: context.repoRoot,
            template: readOr(context, VENUE_TEMPLATE),
        };
        const opened = open.filter((path) => hasReadMark(context.read(path)));

        const findings = [
            ...open.flatMap((path) => venueFindings(path, context.read(path), scope)),
            ...concurrentFindings(opened, open),
            ...open.flatMap((path) => distributionFindings(context.repoRoot, path)),
            ...scheduleFindings(scope.agenda),
        ];
        const convergence = Object.fromEntries(open.flatMap((path) => convergenceOf(path, context.read(path), scope)));

        return {
            derivations: {
                convergence,
                open,
                scheduleOrder: agendaRows(scope.agenda).map((row) => `${row.ordinal} ${row.invariant}`),
                skippedAsArchivedVenue,
            },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant: "an unresolved prioritized discussion blocks the build until it converges",
    jurisdiction: "all",
    kinds: [
        "concurrentVenues",
        "disorderedScheduleRow",
        "duplicateDistribution",
        "handPlacedPosition",
        "noExitCondition",
        "positionsBeforeRoster",
        "rosterContradiction",
        "strandedDeferral",
        "templateAbsent",
        "ungatedDecision",
        "unrecordedSuccessor",
        "unresolvedDiscussion",
        "venueSchemaDrift",
    ],

    reads: [VENUE_TEMPLATE, AGENDA],

    stage: "content",
};

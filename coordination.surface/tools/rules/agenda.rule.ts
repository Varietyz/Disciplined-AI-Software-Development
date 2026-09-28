import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { driftedRows, healSchedule, scheduleBounds } from "../core/transformers/agenda.transformer.ts";
import { AGENDA } from "../core/constants/blocking.constants.ts";
import type { Finding } from "../core/types/segment.types.ts";
import type { ScheduleReading } from "../core/types/agenda.types.ts";
import { readSchedule } from "../core/runners/agenda.runner.ts";
import { renderSchedule } from "../core/formatters/agenda.formatter.ts";
import { writeAgendaIfUnmoved } from "../core/generators/agenda.generator.ts";

const DECIDE =
    "the ordinal, the invariant and what a venue must establish are INTENT no tree holds, so they stay authored " +
    "in the typed plan; the state is an OBSERVATION two directory listings already answer, so it is computed " +
    "and never transcribed. A hand-copied state goes stale in whichever direction nobody happened to correct — " +
    "and a row that reads one state while the tree holds another is the surface and the tree disagreeing on " +
    "exactly the fact the surface exists to publish. Author the plan; the column renders";

const finding = function finding(reading: ScheduleReading, line: number, held: string): Finding {
    return {
        actual: held,
        expected: reading.state,
        healed: false,
        line,
        locus: reading.plan.invariant,
        path: AGENDA,
        remediation: {
            action: "declare",
            decide: DECIDE,
            deterministic: true,
            from: held,
            target: AGENDA,
            to: reading.state,
        },
        rule: "agenda/transcribedState",
        stack: [
            { check: "row", resolved: reading.plan.ordinal },
            { check: "derived", resolved: reading.state },
            { check: "evidence", resolved: reading.evidence },
        ],
    };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext, fix: boolean): RuleResult {
        if (!context.paths.includes(AGENDA)) {
            return {
                derivations: { agenda: "outside this run's path set", skippedAsOutOfScope: [AGENDA] },
                findings: [],
                healed: [],
            };
        }

        const source = context.read(AGENDA);
        const lines = source.split("\n");
        const bounds = scheduleBounds(lines);
        const readings = readSchedule(context.repoRoot);

        if (bounds === null) {
            return {
                derivations: { agenda: "present", rowsPlanned: readings.length, table: "absent" },
                findings: [
                    {
                        actual: "the agenda carries no ordering table for the plan to render into",
                        expected: "the ordering table's declared header row",
                        healed: false,
                        line: 0,
                        locus: "ordering table",
                        path: AGENDA,
                        remediation: {
                            action: "declare",
                            decide: "the plan is authored and the table is its rendering, so a rendering with no region to land in leaves the plan unpublished — restore the header the render writes beneath, rather than re-authoring the rows",
                            deterministic: false,
                            from: AGENDA,
                            target: AGENDA,
                            to: null,
                        },
                        rule: "agenda/tableAbsent",
                        stack: [{ check: "header", resolved: "absent" }],
                    },
                ],
                healed: [],
            };
        }

        const drifted = driftedRows(lines, readings);
        const findings: Finding[] = [];
        const healed: string[] = [];

        if (drifted.length > 0) {
            const rendered = renderSchedule(readings);
            const written = healSchedule(source, rendered);

            const applied = fix && written !== null && writeAgendaIfUnmoved(context.repoRoot, source, written);

            if (applied) {
                healed.push(AGENDA);
            } else {
                for (const reading of drifted) {
                    const index = readings.indexOf(reading);
                    const at = bounds.from + 2 + index;
                    findings.push(finding(reading, at + 1, (lines[at] ?? "").trim()));
                }
            }
        }

        return {
            derivations: {
                agenda: "present",
                declaredRatherThanDerived: readings
                    .filter((reading) => !reading.derived)
                    .map((reading) => `${reading.plan.invariant}: ${reading.evidence}`),
                derivedFromTheTree: readings
                    .filter((reading) => reading.derived)
                    .map((reading) => `${reading.plan.invariant}: ${reading.evidence}`),
                notChecked:
                    "whether the authored half is RIGHT — the walk decides that a state matches the tree and " +
                    "says nothing about whether a row's invariant, its ordinal or what it must establish is the " +
                    "correct intent, which is the series' own judgement and is held by the seats. The ORDER of " +
                    "the rows is likewise the plan's own and is read by the ordering axis rather than here",
                population:
                    "the ROWS of the typed plan, never the files this run hands the check — the plan is the " +
                    "authored half and the two directory listings are the observed one, so nothing here ranges " +
                    "over a handed set and no reached count is claimed. A row the plan does not carry is invisible " +
                    "to this walk by construction, which is the plan being the single declaration of the series " +
                    "rather than a scope that stopped reaching",
                rowsWalked: readings.map((reading) => `${reading.plan.ordinal} → ${reading.state}`),
            },
            findings,
            healed,
        };
    },
    extensions: [],
    heals: true,
    invariant:
        "the schedule's authored plan and its observed state are separate halves, so a row's state renders from the tree rather than being copied into it",
    jurisdiction: "all",
    kinds: ["transcribedState", "tableAbsent"],
    reads: [AGENDA],

    stage: "content",

    wholeScopeOnly: true,
};

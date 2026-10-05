import type { GraphEdge, GraphNode } from "@banes-lab/web/types/graph.types.js";
import {
    NO_GRAPH_REPORT,
    POPULATION_NOUNS,
    ambiguousRelation,
    danglingEdge,
    duplicateNode,
    emptyPopulation,
    malformedReportEntries,
    missingReportList,
    sharedNumber,
    tooltipGap,
    unbalancedPopulation,
    uncoveredSection,
    undeclaredAbsence,
    undeclaredRelation,
    unresolvedTarget,
} from "#configuration/strings/graph.strings";
import type { Undeclared, UnresolvedTarget } from "#types/graph.types";
import { existsSync, readFileSync } from "node:fs";
import { EXPECTED_ABSENCES } from "#configuration/constants/graph.constants";
import type { Finding } from "#types/validation.types";
import type { Population } from "#types/catalog.types";
import { isRecord } from "#core/selectors/base.selector";

const ABSENT_MARK = "absent";
const PART_SEPARATOR = " ";

interface Numbered {
    readonly number: string;
    readonly ref: string;
}

interface Duplicate {
    readonly dropped: GraphNode;
    readonly kept: GraphNode;
}

const isText = function isText(value: unknown): value is string {
    return typeof value === "string";
};

const isEdge = function isEdge(value: unknown): value is GraphEdge {
    return (
        isRecord(value) &&
        typeof value["from"] === "string" &&
        typeof value["relation"] === "string" &&
        typeof value["to"] === "string"
    );
};

const isUndeclared = function isUndeclared(value: unknown): value is Undeclared {
    return isRecord(value) && typeof value["face"] === "string" && typeof value["relation"] === "string";
};

const isPopulation = function isPopulation(value: unknown): value is Population {
    return (
        isRecord(value) &&
        typeof value["name"] === "string" &&
        typeof value["whole"] === "number" &&
        isRecord(value["parts"])
    );
};

const isTarget = function isTarget(value: unknown): value is UnresolvedTarget {
    return (
        isRecord(value) &&
        typeof value["from"] === "string" &&
        typeof value["label"] === "string" &&
        typeof value["relation"] === "string"
    );
};

const isNode = function isNode(value: unknown): value is GraphNode {
    return (
        isRecord(value) &&
        typeof value["ref"] === "string" &&
        typeof value["kind"] === "string" &&
        typeof value["layer"] === "string"
    );
};

const isDuplicate = function isDuplicate(value: unknown): value is Duplicate {
    return isRecord(value) && isNode(value["dropped"]) && isNode(value["kept"]);
};

type ReportCheck = (report: string, parsed: unknown) => Finding[];

const reportCheck = function reportCheck<T>(
    path: readonly string[],
    guard: (value: unknown) => value is T,
    findingsOf: (items: readonly T[], report: string) => Finding[],
): ReportCheck {
    const key = path.join(".");
    return (report, parsed) => {
        const list = path.reduce<unknown>((value, segment) => (isRecord(value) ? value[segment] : null), parsed);
        if (!Array.isArray(list)) {
            return [{ file: report, message: missingReportList(key) }];
        }
        const kept = list.filter(guard);
        const dropped = list.length - kept.length;
        return [
            ...findingsOf(kept, report),
            ...(dropped === 0 ? [] : [{ file: report, message: malformedReportEntries(key, dropped) }]),
        ];
    };
};

const duplicateNumbers = function duplicateNumbers(nodes: readonly GraphNode[]): Finding[] {
    const first = new Map<string, string>();
    const findings: Finding[] = [];
    const numbered = nodes.filter((node): node is GraphNode & Numbered => node.number !== null);
    for (const node of numbered) {
        const held = first.get(node.number);
        if (held === undefined) {
            first.set(node.number, node.ref);
        } else {
            findings.push({ file: held, message: sharedNumber(node.number, held, node.ref) });
        }
    }
    return findings;
};

const countsOf = function countsOf(population: Population): readonly (readonly [string, number])[] {
    return Object.entries(population.parts).filter((entry): entry is [string, number] => typeof entry[1] === "number");
};

const absenceFindings = function absenceFindings(report: string, population: Population): Finding[] {
    const noun = POPULATION_NOUNS.get(population.name);
    if (noun === undefined) {
        return [];
    }
    const declared = EXPECTED_ABSENCES.get(population.name);
    return countsOf(population).flatMap(([part, count]) => {
        const [state = "", layer = "", kind = ""] = part.split(PART_SEPARATOR);
        return state !== ABSENT_MARK || count === 0 || declared?.has(part) === true
            ? []
            : [{ file: report, message: undeclaredAbsence(count, kind, layer, noun) }];
    });
};

const populationFindings = function populationFindings(report: string, population: Population): Finding[] {
    const sum = countsOf(population).reduce((total, [, count]) => total + count, 0);
    return [
        ...(population.whole === 0 ? [{ file: report, message: emptyPopulation(population.name) }] : []),
        ...(sum === population.whole
            ? []
            : [{ file: report, message: unbalancedPopulation(population.name, sum, population.whole) }]),
        ...absenceFindings(report, population),
    ];
};

const REPORT_CHECKS: readonly ReportCheck[] = [
    reportCheck(["undeclared"], isUndeclared, (entries) =>
        entries.map((entry) => ({ file: entry.face, message: undeclaredRelation(entry.face, entry.relation) })),
    ),
    reportCheck(["ambiguous"], isUndeclared, (entries) =>
        entries.map((entry) => ({ file: entry.face, message: ambiguousRelation(entry.face, entry.relation) })),
    ),
    reportCheck(["unresolved"], isTarget, (targets) =>
        targets.map((target) => ({
            file: target.from,
            message: unresolvedTarget(target.from, target.label, target.relation),
        })),
    ),
    reportCheck(["duplicates"], isDuplicate, (duplicates) =>
        duplicates.map(({ dropped, kept }) => ({ file: kept.ref, message: duplicateNode(kept, dropped) })),
    ),
    reportCheck(["uncovered"], isText, (refs) => refs.map((ref) => ({ file: ref, message: uncoveredSection(ref) }))),
    reportCheck(["tooltipGaps"], isEdge, (gaps) => gaps.map((gap) => ({ file: gap.from, message: tooltipGap(gap) }))),
    reportCheck(["populations"], isPopulation, (populations, report) =>
        populations.flatMap((population) => populationFindings(report, population)),
    ),
    reportCheck(["dangling"], isEdge, (edges) =>
        edges.map((edge) => ({ file: edge.from, message: danglingEdge(edge) })),
    ),
    reportCheck(["graph", "nodes"], isNode, duplicateNumbers),
];

export const graphFindings = function graphFindings(report: string): Finding[] {
    if (!existsSync(report)) {
        return [{ file: report, message: NO_GRAPH_REPORT }];
    }
    const parsed: unknown = JSON.parse(readFileSync(report, "utf8"));
    return REPORT_CHECKS.flatMap((check) => check(report, parsed));
};

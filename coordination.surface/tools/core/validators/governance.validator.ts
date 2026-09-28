import { FINDING_EMISSION, REPORT_SUFFIX, SKIP_PREFIX } from "../constants/report.constants.ts";
import { containsInCode, declaresProperty } from "../predicates/source.predicate.ts";
import { existsSync, readFileSync, rmSync, statSync } from "node:fs";
import { fieldOf, tryParse } from "../readers/json.reader.ts";
import { reportEntries, reportIdOf, reportsIn } from "../readers/report.reader.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import type { ParsedReport } from "../types/report.types.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { moduleSource } from "../analyzers/graph.analyzer.ts";
import { resolve } from "node:path";

const SOURCE_EXTENSION = ".ts";

const COMPOSITE_SEPARATOR = "/";

const COMPOSITE_KEYED = "composite-keyed";

const countOf = function countOf(value: unknown): number {
    return typeof value === "number" ? value : 0;
};

export const isConstructShaped = function isConstructShaped(id: string): boolean {
    for (const char of id) {
        if (char < "a" || char > "z") {
            return false;
        }
    }
    return id.length > 0;
};

export const reportMissing = function reportMissing(repoRoot: string, id: string): boolean {
    return !existsSync(resolve(repoRoot, GENERATED_DIR, `${id}${REPORT_SUFFIX}`));
};

export const REPORT_IDENTITY_FIELDS = ["scope", "authoritative", "verdict"];

export const missingReportIdentity = function missingReportIdentity(repoRoot: string, id: string): string[] {
    const target = resolve(repoRoot, GENERATED_DIR, `${id}${REPORT_SUFFIX}`);
    if (!existsSync(target)) {
        return [];
    }

    const value = tryParse(readFileSync(target, "utf8"))?.value;
    if (typeof value !== "object" || value === null) {
        return [...REPORT_IDENTITY_FIELDS];
    }
    return REPORT_IDENTITY_FIELDS.filter((field) => fieldOf(value, field) === undefined);
};

export const orphanReports = function orphanReports(repoRoot: string, claimed: ReadonlySet<string>): string[] {
    return reportsIn(repoRoot)
        .filter((report) => !claimed.has(reportIdOf(report.entry)))
        .filter((report) => fieldOf(report.value, "rule") !== undefined && fieldOf(report.value, "stage") !== undefined)
        .map((report) => report.entry);
};

export const deleteReport = function deleteReport(repoRoot: string, name: string): void {
    rmSync(resolve(repoRoot, GENERATED_DIR, name), { force: true });
};

interface ScopeGap {
    readonly report: string;
    readonly handed: number;
    readonly reached: number;
    readonly named: number;
}

const namedSkips = function namedSkips(derivations: Readonly<Record<string, unknown>>): number {
    return Object.entries(derivations)
        .filter(([key]) => key.startsWith(SKIP_PREFIX))
        .flatMap(([, value]): unknown[] => (Array.isArray(value) ? value : [])).length;
};

const scopeGap = function scopeGap(report: ParsedReport): ScopeGap[] {
    const derivations = fieldOf(report.value, "derivations");
    const reachedList = isObject(derivations) ? derivations["reached"] : undefined;
    if (!isObject(derivations) || reachedList === undefined) {
        return [];
    }

    const handed = countOf(fieldOf(report.value, "scanned"));
    if (!Array.isArray(reachedList)) {
        return [{ handed, named: 0, reached: -1, report: report.entry }];
    }

    const reached = reachedList.length;
    const named = namedSkips(derivations);
    return handed <= reached || handed - reached === named ? [] : [{ handed, named, reached, report: report.entry }];
};

export const unaccountedScopeGaps = function unaccountedScopeGaps(repoRoot: string): ScopeGap[] {
    return reportsIn(repoRoot).flatMap(scopeGap);
};

interface UnevaluableScope {
    readonly report: string;
    readonly handed: number;
}

const isVerdictBearing = function isVerdictBearing(value: object): boolean {
    return typeof fieldOf(value, "verdict") === "string" && typeof fieldOf(value, "scanned") === "number";
};

const publishesAPopulation = function publishesAPopulation(derivations: unknown): boolean {
    return isObject(derivations) && Object.values(derivations).some((value) => Array.isArray(value));
};

export const unevaluableScopes = function unevaluableScopes(repoRoot: string): UnevaluableScope[] {
    return reportsIn(repoRoot)
        .filter((report) => isVerdictBearing(report.value))
        .flatMap((report) => {
            const handed = countOf(fieldOf(report.value, "scanned"));
            const published = publishesAPopulation(fieldOf(report.value, "derivations"));
            return handed === 0 || published ? [] : [{ handed, report: report.entry }];
        });
};

export const selfAuditedReports = function selfAuditedReports(repoRoot: string, auditor: string): string[] {
    return reportEntries(repoRoot).filter((entry) => reportIdOf(entry) === auditor);
};

interface ReportStanding {
    readonly report: string;
    readonly staleSurfaces: readonly string[];
}

const stampOf = function stampOf(absolute: string): number {
    return existsSync(absolute) ? statSync(absolute).mtimeMs : 0;
};

const reachedSurfaces = function reachedSurfaces(value: object): string[] {
    const derivations = fieldOf(value, "derivations");
    if (!isObject(derivations)) {
        return [];
    }
    return Object.values(derivations)
        .flatMap((held): unknown[] => (Array.isArray(held) ? held : []))
        .filter((member): member is string => typeof member === "string" && member.includes(COMPOSITE_SEPARATOR));
};

const contradiction = function contradiction(
    name: string,
    value: unknown,
    derivations: Readonly<Record<string, unknown>>,
): string[] {
    const subject = isObject(value) ? value["subject"] : undefined;
    if (!isObject(value) || value["property"] !== COMPOSITE_KEYED || typeof subject !== "string") {
        return [];
    }

    const held = derivations[subject];
    const flat = Array.isArray(held)
        ? held.filter(
              (member: unknown): member is string =>
                  typeof member === "string" && !member.includes(COMPOSITE_SEPARATOR),
          )
        : [];
    return flat.length === 0
        ? []
        : [
              `${name} declares ${subject} composite-keyed and that key carries ${String(flat.length)} member(s) with no separator: ${flat.join(", ")}`,
          ];
};

export const contradictedContracts = function contradictedContracts(derivations: Record<string, unknown>): string[] {
    return Object.entries(derivations).flatMap(([name, value]) => contradiction(name, value, derivations));
};

export const withdrawnStandings = function withdrawnStandings(repoRoot: string): ReportStanding[] {
    return reportsIn(repoRoot).flatMap((report) => {
        const written = stampOf(report.path);
        const stale = reachedSurfaces(report.value)
            .filter((surface) => stampOf(resolve(repoRoot, surface)) > written)
            .toSorted((left, right) => left.localeCompare(right, "en"));
        return stale.length === 0 ? [] : [{ report: report.entry, staleSurfaces: stale }];
    });
};

export const missingFindingFields = function missingFindingFields(
    path: string,
    read: (path: string) => string,
    known: ReadonlySet<string>,
    required: readonly string[],
): string[] {
    const reachable = moduleSource(path, read, known);
    return required.filter((field) => !declaresProperty(reachable, field));
};

interface ShapeGap {
    readonly path: string;
    readonly field: string;
}

export const findingShapeGaps = function findingShapeGaps(
    paths: readonly string[],
    read: (path: string) => string,
    required: readonly string[],
): ShapeGap[] {
    const known = new Set(paths);
    return paths
        .filter((path) => path.endsWith(SOURCE_EXTENSION) && containsInCode(read(path), FINDING_EMISSION))
        .flatMap((path) => missingFindingFields(path, read, known, required).map((field) => ({ field, path })));
};

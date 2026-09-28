import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readDeclaredRules, readExpandedSlugs, stripGateDeclarations } from "../readers/rule.reader.ts";

import type { Finding } from "../types/segment.types.ts";
import type { RosterRow } from "../types/coverage.types.ts";
import { resolve } from "node:path";

interface Expansion {
    readonly slug: string;
    readonly digest: string;
}

export const UNBUILT_HALF = "none";

interface CheckableHalf {
    readonly slug: string;
    readonly line: number;
    readonly gate: string;
}

const unwrap = function unwrap(cell: string): string {
    const trimmed = cell.trim();
    if (trimmed.length < 2) {
        return trimmed;
    }
    if (!trimmed.startsWith("`") || !trimmed.endsWith("`")) {
        return trimmed;
    }
    return trimmed.slice(1, -1).trim();
};

const slugOf = function slugOf(cell: string): string {
    const trimmed = cell.trim();
    if (!trimmed.startsWith("`") || !trimmed.endsWith("`")) {
        return "";
    }
    return trimmed.slice(1, -1).trim();
};

const FIRST_VALUE_CELL = 2;

const lastValue = function lastValue(cells: readonly string[]): string {
    return (
        cells
            .slice(FIRST_VALUE_CELL)
            .map(unwrap)
            .findLast((value) => value.length > 0) ?? ""
    );
};

const rosterRowAt = function rosterRowAt(line: string, index: number): RosterRow[] {
    if (!line.trimStart().startsWith("|")) {
        return [];
    }
    const cells = line.split("|");
    const slug = slugOf(cells[1] ?? "");
    return slug.length === 0 ? [] : [{ cell: lastValue(cells), cells: cells.length, line: index + 1, slug }];
};

export const rosterRows = function rosterRows(registry: string): RosterRow[] {
    return registry.split("\n").flatMap(rosterRowAt);
};

export const checkableHalves = function checkableHalves(
    registry: string,
    registered: ReadonlySet<string>,
): CheckableHalf[] {
    return rosterRows(registry)
        .filter((row) => row.cell === UNBUILT_HALF || registered.has(row.cell))
        .map((row) => ({ gate: row.cell, line: row.line, slug: row.slug }));
};

interface DigestResult {
    readonly findings: readonly Finding[];
    readonly healed: readonly string[];
    readonly expanded: readonly Expansion[];
}

const finding = function finding(
    kind: string,
    path: string,
    slug: string,
    line: number,
    actual: string,
    decide: string | null,
    deterministic: boolean,
): Finding {
    return {
        actual,
        expected: null,
        healed: false,
        line,
        locus: slug,
        path,
        remediation: { action: "declare", decide, deterministic, from: slug, target: path, to: null },
        rule: `coverage/${kind}`,
        stack: [
            { check: "surface", resolved: "digest" },
            { check: kind, resolved: "failed" },
        ],
    };
};

const NO_DIGEST: DigestResult = { expanded: [], findings: [], healed: [] };

const declarationOutcome = function declarationOutcome(
    absolute: string,
    path: string,
    source: string,
    fix: boolean,
): DigestResult {
    const declarations = readDeclaredRules(source);
    if (declarations.length === 0) {
        return NO_DIGEST;
    }
    if (fix) {
        writeFileSync(absolute, stripGateDeclarations(source), "utf8");
        return { ...NO_DIGEST, healed: [`${path}: ${String(declarations.length)} gate declarations stripped`] };
    }
    const findings = declarations.map((entry) =>
        finding(
            "digestDeclares",
            path,
            entry.slug,
            entry.line,
            `${entry.slug} carries gate: ${entry.gate} inside a digest`,
            null,
            true,
        ),
    );
    return { ...NO_DIGEST, findings };
};

const expansionFindings = function expansionFindings(
    path: string,
    source: string,
    declared: ReadonlySet<string>,
): Finding[] {
    return readExpandedSlugs(source)
        .filter((expansion) => !declared.has(expansion.slug))
        .map((expansion) =>
            finding(
                "undeclaredExpansion",
                path,
                expansion.slug,
                expansion.line,
                `${expansion.slug} is expanded here but no axis document declares it`,
                "an expansion with no declaration is a rule nothing governs — declare it in the axis document with a registered gate or a conduct proof, or delete the expansion if the rule is already carried under another slug",
                false,
            ),
        );
};

const digestOutcome = function digestOutcome(
    repoRoot: string,
    path: string,
    declared: ReadonlySet<string>,
    fix: boolean,
): DigestResult {
    const absolute = resolve(repoRoot, path);
    if (!existsSync(absolute)) {
        return NO_DIGEST;
    }

    const source = readFileSync(absolute, "utf8");
    const declarations = declarationOutcome(absolute, path, source, fix);
    return {
        expanded: readExpandedSlugs(source).map((expansion) => ({ digest: path, slug: expansion.slug })),
        findings: [...declarations.findings, ...expansionFindings(path, source, declared)],
        healed: declarations.healed,
    };
};

export const inspectDigests = function inspectDigests(
    repoRoot: string,
    digests: readonly string[],
    declared: ReadonlySet<string>,
    fix: boolean,
): DigestResult {
    const outcomes = digests.map((path) => digestOutcome(repoRoot, path, declared, fix));
    return {
        expanded: outcomes.flatMap((outcome) => outcome.expanded),
        findings: outcomes.flatMap((outcome) => outcome.findings),
        healed: outcomes.flatMap((outcome) => outcome.healed),
    };
};

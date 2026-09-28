import type { Breach, SurfaceReport } from "../types/checklist.types.ts";
import { CHECKLIST_CONCERN, CHECKLIST_TEMPLATE, PLANNING_TEMPLATE } from "../constants/checklist.constants.ts";
import { agentBreaches, closureBreaches, idBreaches } from "../resolvers/checklist.resolver.ts";
import {
    count,
    declaresContract,
    emptyPhases,
    historyIn,
    missingFields,
    taskBlocks,
} from "../validators/checklist.validator.ts";

import { existsSync, readFileSync } from "node:fs";
import { inspectProtocol, scaffoldLabels } from "../inspectors/checklist.inspector.ts";
import { readRowMarkers, readTemplateContract } from "../readers/template.reader.ts";
import { BOARD_PATH } from "../constants/board.constants.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import type { TemplateContract } from "../types/template.types.ts";
import { boardRecords } from "../analyzers/board.analyzer.ts";
import { countLiterals } from "../validators/literal.validator.ts";
import { peerSet } from "../validators/board.validator.ts";
import { resolve } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";

export const contractOf = function contractOf(repoRoot: string): TemplateContract {
    return readTemplateContract(readFileSync(resolve(repoRoot, CHECKLIST_TEMPLATE), "utf8"));
};

export const rowMarkersOf = function rowMarkersOf(repoRoot: string): string[] {
    const template = resolve(repoRoot, PLANNING_TEMPLATE);
    return existsSync(template) ? readRowMarkers(readFileSync(template, "utf8")) : [];
};

export const activeSet = function activeSet(repoRoot: string): ReadonlySet<string> {
    const board = resolve(repoRoot, BOARD_PATH);
    if (!existsSync(board)) {
        return new Set<string>();
    }

    const index = resolve(repoRoot, surfacePath("agent_index"));
    return peerSet(boardRecords(readFileSync(board, "utf8")), existsSync(index) ? readFileSync(index, "utf8") : "");
};

export const countBreaches = function countBreaches(lines: readonly string[]): Breach[] {
    return countLiterals(lines).map((literal) => ({
        actual: `an authored surface states the cardinality of ${literal.noun} as a literal`,
        expected: `read the count from ${GENERATED_DIR} where the pipeline derives it`,
        kind: "literalCount",
        line: literal.line,
        locus: `${literal.numeral} ${literal.noun}`,
    }));
};

const contractBreaches = function contractBreaches(lines: readonly string[], fields: readonly string[]): Breach[] {
    const out: Breach[] = [];

    for (const block of taskBlocks(lines)) {
        const absent = missingFields(block.text, fields);
        if (absent.length === 0) {
            continue;
        }

        out.push({
            actual: `the task omits ${absent.join(", ")}`,
            expected: `every task carries ${fields.join(", ")}`,
            kind: "contractIncomplete",
            line: block.line,
            locus: block.text.slice(0, 60),
        });
    }

    return out;
};

const historyBreaches = function historyBreaches(lines: readonly string[]): Breach[] {
    const out: Breach[] = [];

    for (let index = 0; index < lines.length; index += 1) {
        const marker = historyIn(lines[index] ?? "");
        if (marker === null) {
            continue;
        }

        out.push({
            actual: `a planning surface states ${marker}`,
            expected: "current and future only",
            kind: "history",
            line: index + 1,
            locus: marker,
        });
    }

    return out;
};

const phaseBreaches = function phaseBreaches(lines: readonly string[], scaffold: readonly string[]): Breach[] {
    return emptyPhases(lines, scaffold).map((essay) => ({
        actual: `${essay.title} declares no task`,
        expected: "every phase declares at least one task",
        kind: "phaseWithoutTask",
        line: essay.line,
        locus: essay.title,
    }));
};

export const inspectSurface = function inspectSurface(
    path: string,
    lines: readonly string[],
    contract: TemplateContract,
    active: ReadonlySet<string>,
    fields: readonly string[],
): SurfaceReport {
    const breaches: Breach[] = [];

    if (path.endsWith(CHECKLIST_CONCERN)) {
        for (const breach of inspectProtocol(lines, contract)) {
            breaches.push(breach);
        }
    }

    for (const breach of agentBreaches(lines, active)) {
        breaches.push({
            actual: breach.actual,
            expected: breach.expected,
            kind: breach.kind,
            line: breach.line,
            locus: breach.id,
        });
    }

    for (const breach of closureBreaches(lines)) {
        breaches.push({
            actual: breach.actual,
            expected: breach.expected,
            kind: breach.kind,
            line: breach.line,
            locus: breach.id,
        });
    }

    if (!declaresContract(taskBlocks(lines), fields)) {
        return { breaches, derivations: { breaches: breaches.length, contractDeclared: false } };
    }

    for (const breach of contractBreaches(lines, fields)) {
        breaches.push(breach);
    }
    for (const breach of historyBreaches(lines)) {
        breaches.push(breach);
    }
    for (const breach of phaseBreaches(lines, scaffoldLabels(contract))) {
        breaches.push(breach);
    }

    for (const breach of idBreaches(lines)) {
        breaches.push({
            actual: breach.actual,
            expected: breach.expected,
            kind: breach.kind,
            line: breach.line,
            locus: breach.id,
        });
    }

    return { breaches, derivations: { ...count(lines), breaches: breaches.length } };
};

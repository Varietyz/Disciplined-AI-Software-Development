import type { CorpusMove, CorpusRoot } from "../types/corpus.types.ts";
import type { Document, Finding } from "../types/segment.types.ts";
import { GENERATED_DIR, NO_FIX_FLAG } from "../constants/path.constants.ts";
import {
    PREVIEW_ONLY,
    appliedOutcome,
    corpusHead,
    corpusSummary,
    noMovesList,
    rewroteLine,
} from "../strings/corpus.strings.ts";
import { countBy, unresolvedFinding } from "../transformers/corpus.transformer.ts";
import { dirname, join, resolve } from "node:path";

import { hasFields, isCorpusMoveList } from "../predicates/schema.predicate.ts";
import { keyFromSymbol, nameParts, rawFacetOf, symbolOf } from "../resolvers/corpus.resolver.ts";
import { mkdirSync, renameSync, rmdirSync, writeFileSync } from "node:fs";
import { readSource, toPosix, walk } from "../iterators/file.iterator.ts";
import { renameMapOf, rewriteReferences } from "../transformers/reference.transformer.ts";
import { RMDIR_REFUSALS } from "../constants/file.constants.ts";
import { hasErrorCode } from "../predicates/file.predicate.ts";
import { parseJson } from "../readers/json.reader.ts";
import { projectRoot } from "../../../config/surface.config.ts";
import { readDocument } from "../readers/document.reader.ts";
import { taxonomy } from "../../../config/taxonomy.config.ts";

const REPO_ROOT = projectRoot();
const CORPUS_ROOTS: Readonly<Record<string, CorpusRoot>> = taxonomy.corpusRoots;
const REPORT_NAME = "corpus.report.generated.json";
const REPORT_PATH = join(REPO_ROOT, GENERATED_DIR, REPORT_NAME);

export const RESTATES: readonly string[] = [
    "mutation_preview_first",
    "healing_is_default_in_every_entrypoint",
    "pattern_references_verified_after_rename",
    "born_conformant",
];

interface Resolved {
    readonly moves: readonly CorpusMove[];
    readonly findings: readonly Finding[];
}

interface Placed {
    readonly rootName: string;
    readonly config: CorpusRoot;
    readonly relPath: string;
    readonly name: string;
    readonly insideSubtree: boolean;
}

const NOTHING: Resolved = { findings: [], moves: [] };

const refused = function refused(finding: Finding): Resolved {
    return { findings: [finding], moves: [] };
};

const rewriteRecorded = function rewriteRecorded(): void {
    const prior = parseJson(readSource(REPORT_PATH), REPORT_PATH);
    if (!hasFields(prior, ["moves"]) || !isCorpusMoveList(prior["moves"])) {
        throw new Error(noMovesList(REPORT_PATH));
    }
    const { moves } = prior;
    const rewritten = rewriteReferences(REPO_ROOT, renameMapOf(moves));
    process.stdout.write(rewroteLine(rewritten, moves.length));
};

const keyOf = function keyOf(placed: Placed, document: Document): Finding | string {
    if (placed.insideSubtree) {
        const symbol = symbolOf(document);
        return symbol === null
            ? unresolvedFinding(placed.relPath, "symbol", "absent", "declare the canonical symbol as a level-2 heading")
            : keyFromSymbol(symbol);
    }

    const key = nameParts(placed.name)[0] ?? "";
    return key.length === 0
        ? unresolvedFinding(placed.relPath, "key", placed.name, "name the file <key>.<facet>.md")
        : key;
};

const destinationOf = function destinationOf(placed: Placed, move: Omit<CorpusMove, "from" | "to">): string {
    const { config, insideSubtree, rootName } = placed;
    const filename =
        move.variant === null ? `${move.key}.${move.facet}.md` : `${move.key}.${move.variant}.${move.facet}.md`;
    return insideSubtree ? `${rootName}/${config.filedUnder}/${move.facet}/${filename}` : `${rootName}/${filename}`;
};

const variantOf = function variantOf(placed: Placed): string | null {
    const segments = nameParts(placed.name);
    const carried = segments.length >= 4 ? (segments.at(-3) ?? null) : null;
    const originDir = placed.relPath.slice(placed.rootName.length + 1, placed.relPath.lastIndexOf("/"));
    return carried ?? placed.config.variantByOrigin[originDir] ?? null;
};

const resolveFile = function resolveFile(rootName: string, config: CorpusRoot, file: string): Resolved {
    const relPath = toPosix(REPO_ROOT, file);
    const document = readDocument(relPath, readSource(file));
    const placed: Placed = {
        config,
        insideSubtree: relPath.startsWith(`${rootName}/${config.filedUnder}/`),
        name: relPath.slice(relPath.lastIndexOf("/") + 1),
        relPath,
        rootName,
    };

    const rawFacet = rawFacetOf(document, config);
    const facet = rawFacet === null ? undefined : config.facetByValue[rawFacet];
    if (facet === undefined) {
        const decide = `declare one of ${config.facetFields.join(", ")} carrying a value in the declared facet set`;
        return refused(unresolvedFinding(relPath, "facet", rawFacet ?? "absent", decide));
    }

    const key = keyOf(placed, document);
    if (typeof key !== "string") {
        return refused(key);
    }

    const resolved = { facet, key, variant: variantOf(placed) };
    const to = destinationOf(placed, resolved);
    return to === relPath ? NOTHING : { findings: [], moves: [{ ...resolved, from: relPath, to }] };
};

const resolveRoots = function resolveRoots(): Resolved[] {
    return Object.entries(CORPUS_ROOTS).flatMap(([rootName, config]) =>
        walk({ extensions: [".md"], ignored: [], root: resolve(REPO_ROOT, rootName) }).map((file) =>
            resolveFile(rootName, config, file),
        ),
    );
};

const collisionFindings = function collisionFindings(moves: readonly CorpusMove[]): Finding[] {
    return [...Map.groupBy(moves, (move) => move.to)]
        .filter(([, sources]) => sources.length >= 2)
        .map(([target, sources]) =>
            unresolvedFinding(
                sources.map((move) => move.from).join(" + "),
                "collision",
                target,
                "two files resolve to one name — give one a variant so the keys stay distinct",
            ),
        );
};

const removeEmptyOrigin = function removeEmptyOrigin(directory: string): void {
    try {
        rmdirSync(directory);
    } catch (error) {
        if (!hasErrorCode(error, RMDIR_REFUSALS)) {
            throw error;
        }
    }
};

const performMoves = function performMoves(moves: readonly CorpusMove[]): number {
    for (const move of moves) {
        const toAbs = resolve(REPO_ROOT, move.to);
        mkdirSync(dirname(toAbs), { recursive: true });
        renameSync(resolve(REPO_ROOT, move.from), toAbs);
    }

    for (const [origin, config] of Object.entries(CORPUS_ROOTS)) {
        const nested = Object.keys(config.variantByOrigin).toSorted((a, b) => b.length - a.length);
        for (const dir of nested) {
            removeEmptyOrigin(join(REPO_ROOT, origin, dir));
        }
    }

    return rewriteReferences(REPO_ROOT, renameMapOf(moves));
};

const closingLines = function closingLines(apply: boolean, blocked: boolean): string {
    if (blocked) {
        return "blocked — resolve the findings before applying\n";
    }
    return apply ? "" : `rehearsal only — rerun without ${NO_FIX_FLAG} to perform the moves\n`;
};

const main = function main(): void {
    if (process.argv.includes("--rewrite-refs")) {
        rewriteRecorded();
        return;
    }

    const apply = !process.argv.includes(NO_FIX_FLAG);
    const resolved = resolveRoots();
    const resolvedMoves = resolved.flatMap((entry) => entry.moves);
    const findings = [...resolved.flatMap((entry) => entry.findings), ...collisionFindings(resolvedMoves)];
    const blocked = findings.length > 0;
    const applied = apply && !blocked;
    const referencesRewritten = applied ? performMoves(resolvedMoves) : 0;

    const report = {
        applied,
        byFacet: countBy(resolvedMoves, (move) => move.facet),
        byVariant: countBy(resolvedMoves, (move) => move.variant ?? "(none)"),
        findings,
        moves: resolvedMoves,
        referencesRewritten,
        resolved: resolvedMoves.length,
        tool: "corpus",
        verdict: blocked ? "fail" : "pass",
    };

    mkdirSync(dirname(REPORT_PATH), { recursive: true });
    writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 4)}\n`, "utf8");

    const outcome = applied ? appliedOutcome(referencesRewritten) : PREVIEW_ONLY;
    const head = corpusHead(report.verdict.toUpperCase(), report.resolved, findings.length, outcome);
    process.stdout.write(
        corpusSummary(
            head,
            JSON.stringify(report.byFacet),
            JSON.stringify(report.byVariant),
            `${GENERATED_DIR}/${REPORT_NAME}`,
            closingLines(apply, blocked),
        ),
    );

    process.exit(blocked ? 1 : 0);
};

main();

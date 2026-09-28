import type { CleanResult, CleanedFile } from "../types/source.types.ts";
import type { StepOptions, StepOutcome } from "../types/rule.types.ts";
import { commentsOf, isAttribution, stripComments } from "../normalizers/source.normalizer.ts";
import { existsSync, readFileSync } from "node:fs";

import { toPosix, walk } from "../iterators/file.iterator.ts";
import type { CommentSpan } from "../types/comment.types.ts";
import { SURFACE_ROOT } from "../constants/path.constants.ts";
import { loadTaxonomy } from "../resolvers/taxonomy.resolver.ts";
import { resolve } from "node:path";
import { resolveArtifactRoots } from "../resolvers/artifact.resolver.ts";
import { slotList } from "../../../config/surface.config.ts";
import { writeRepair } from "../writers/repair.writer.ts";
import { writeRuleReport } from "../reporters/rule.reporter.ts";

export const CODE_EXTENSIONS: readonly string[] = slotList("convention", "code_extensions");

const CODE_ROOTS = [SURFACE_ROOT];

export const isVendored = function isVendored(spans: readonly CommentSpan[]): boolean {
    const [leading] = spans;
    return leading !== undefined && isAttribution(leading.text);
};

export const codeFiles = function codeFiles(repoRoot: string): string[] {
    const taxonomy = loadTaxonomy();
    const roots: string[] = [...Object.keys(taxonomy.containers), ...Object.keys(taxonomy.specialContainers)];

    for (const root of resolveArtifactRoots(repoRoot, taxonomy)) {
        if (root.unresolved === null) {
            roots.push(root.path);
        }
    }
    for (const root of CODE_ROOTS) {
        if (existsSync(resolve(repoRoot, root))) {
            roots.push(root);
        }
    }

    const seen = new Set<string>();
    const out: string[] = [];

    for (const root of roots) {
        for (const file of walk({
            extensions: [...CODE_EXTENSIONS],
            ignored: taxonomy.ignored,
            root: resolve(repoRoot, root),
        })) {
            const relative = toPosix(repoRoot, file);
            if (seen.has(relative)) {
                continue;
            }
            seen.add(relative);
            out.push(relative);
        }
    }

    return out.toSorted((left, right) => left.localeCompare(right));
};

const INVARIANT = "authored code carries no comments";

export const cleanStage = function cleanStage(options: StepOptions): StepOutcome {
    if (options.bypass.includes("clean")) {
        return {
            findings: [],
            stage: { bypassed: true, findings: 0, healed: 0, invariant: INVARIANT, rule: "clean", stage: "meta" },
        };
    }

    const cleaned = cleanSources(options.repoRoot, options.fix, options.scope);

    writeRuleReport(options.repoRoot, "clean", {
        authoritative: options.authoritative,
        derivations: {
            containment:
                "every repair passes the restricted writer, which refuses a path outside the scope this run DECLARED — " +
                "so containment is answered at one function rather than by a witness nobody holds for a repair scattered " +
                "across source, and a refusal is reported here rather than the write landing and being reported afterwards",
            reached: [...cleaned.reached],
            refusedAsOutsideDeclaredScope: [...cleaned.refused],
        },
        findings: [],
        healed: cleaned.files.map((file) => `${file.path}: ${String(file.removed)} removed`),
        invariant: INVARIANT,
        rule: "clean",
        scanned: cleaned.scanned,
        scope: options.scope,
        stage: "meta",
        verdict: "pass",
    });

    return {
        findings: [],
        stage: {
            bypassed: false,
            findings: 0,
            healed: cleaned.files.length,
            invariant: INVARIANT,
            rule: "clean",
            stage: "meta",
        },
    };
};

const UNTOUCHED = { file: null, refused: false } as const;

const cleanedFile = function cleanedFile(
    repoRoot: string,
    path: string,
    apply: boolean,
    declared: string,
): { file: CleanedFile | null; refused: boolean } {
    const source = readFileSync(resolve(repoRoot, path), "utf8");
    const spans = commentsOf(path, source);
    if (spans.length === 0 || isVendored(spans)) {
        return UNTOUCHED;
    }

    const result = stripComments(source, spans);
    if (result.removed === 0) {
        return UNTOUCHED;
    }

    const rewrites = apply && result.text !== source;
    if (rewrites && !writeRepair({ declared, repoRoot }, path, result.text).written) {
        return { file: null, refused: true };
    }

    return { file: { kept: result.kept, path, removed: result.removed }, refused: false };
};

export const cleanSources = function cleanSources(repoRoot: string, apply: boolean, declared = ""): CleanResult {
    const paths = codeFiles(repoRoot);
    const outcomes = paths.map((path) => ({ path, ...cleanedFile(repoRoot, path, apply, declared) }));
    const files = outcomes.flatMap((outcome) => (outcome.file === null ? [] : [outcome.file]));
    const refused = outcomes.filter((outcome) => outcome.refused).map((outcome) => outcome.path);
    const removed = files.reduce((sum, file) => sum + file.removed, 0);
    const kept = files.reduce((sum, file) => sum + file.kept, 0);

    return { files, kept, reached: paths, refused, removed, scanned: paths.length };
};

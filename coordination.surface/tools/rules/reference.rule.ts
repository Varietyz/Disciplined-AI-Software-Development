import { AXIS_DOCUMENTS, UPSTREAM_ROOTS } from "../core/constants/path.constants.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { basename, dirname, resolve } from "node:path";

import { contentIsImmutable, surfacePrefix, surfaceRoot } from "../../config/surface.config.ts";
import { cycleFinding, unresolvedFinding } from "../core/factories/reference.factory.ts";
import { existsSync, readdirSync } from "node:fs";
import { BOARD_PATH } from "../core/constants/board.constants.ts";
import type { Finding } from "../core/types/segment.types.ts";
import type { Reference } from "../core/types/reference.types.ts";
import type { TaxonomyData } from "../core/types/taxonomy.types.ts";
import { cyclesIn } from "../core/analyzers/graph.analyzer.ts";
import { readDocument } from "../core/readers/document.reader.ts";
import { referencesIn } from "../core/matchers/reference.matcher.ts";

const directoriesIn = function directoriesIn(root: string): string[] {
    return readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
};

const rootsOf = function rootsOf(repoRoot: string, taxonomy: TaxonomyData): ReadonlySet<string> {
    return new Set([
        ...directoriesIn(repoRoot),
        ...directoriesIn(surfaceRoot()),
        ...taxonomy.concernFolders,
        ...Object.values(taxonomy.containers).flat(),
        ...Object.values(taxonomy.specialContainers).flat(),
    ]);
};

const namesInTree = function namesInTree(target: string, roots: ReadonlySet<string>, candidates: number): boolean {
    if (candidates > 0) {
        return true;
    }

    const slash = target.indexOf("/");
    return slash !== -1 && roots.has(target.slice(0, slash));
};

const resolvesAgainstAncestor = function resolvesAgainstAncestor(
    path: string,
    target: string,
    existing: ReadonlySet<string>,
): boolean {
    let directory = dirname(path);

    while (directory.length > 0 && directory !== ".") {
        if (existing.has(`${directory}/${target}`)) {
            return true;
        }

        const cut = directory.lastIndexOf("/");
        if (cut === -1) {
            break;
        }
        directory = directory.slice(0, cut);
    }

    return existing.has(`${directory}/${target}`);
};

const settledTarget = function settledTarget(
    context: RuleContext,
    target: string,
    existing: ReadonlySet<string>,
): string | null {
    if (existing.has(target)) {
        return target;
    }
    if (existsSync(resolve(context.repoRoot, target))) {
        return target;
    }

    const prefix = surfacePrefix();
    const prefixed = prefix.length === 0 ? target : `${prefix}/${target}`;
    return existsSync(resolve(context.repoRoot, prefixed)) ? prefixed : null;
};

const recordEdge = function recordEdge(edges: Map<string, Set<string>>, from: string, to: string): void {
    if (from === to) {
        return;
    }
    if (!to.endsWith(".md")) {
        return;
    }

    const cited = edges.get(from) ?? new Set<string>();
    cited.add(to);
    edges.set(from, cited);
};

interface ResolveScope {
    readonly context: RuleContext;
    readonly existing: ReadonlySet<string>;
    readonly roots: ReadonlySet<string>;
    readonly byBasename: ReadonlyMap<string, readonly string[]>;
}

interface ReferenceOutcome {
    readonly edge: string | null;
    readonly finding: Finding | null;
}

const NO_OUTCOME: ReferenceOutcome = { edge: null, finding: null };

const referenceOutcome = function referenceOutcome(
    path: string,
    reference: Reference,
    scope: ResolveScope,
): ReferenceOutcome {
    const settled = settledTarget(scope.context, reference.target, scope.existing);
    if (settled !== null) {
        return { edge: settled, finding: null };
    }

    const candidates = scope.byBasename.get(basename(reference.target)) ?? [];
    const ignored =
        resolvesAgainstAncestor(path, reference.target, scope.existing) ||
        !namesInTree(reference.target, scope.roots, candidates.length);
    return ignored ? NO_OUTCOME : { edge: null, finding: unresolvedFinding(path, reference, candidates) };
};

const groupByBasename = function groupByBasename(paths: readonly string[]): Map<string, string[]> {
    const byBasename = new Map<string, string[]>();
    for (const path of paths) {
        byBasename.set(basename(path), [...(byBasename.get(basename(path)) ?? []), path]);
    }
    return byBasename;
};

const reachableOf = function reachableOf(context: RuleContext): string[] {
    const axes = AXIS_DOCUMENTS.filter(
        (axis) => context.paths.includes(axis) || existsSync(resolve(context.repoRoot, axis)),
    );
    const board = existsSync(resolve(context.repoRoot, BOARD_PATH)) ? [BOARD_PATH] : [];
    return [...new Set([...context.paths, ...axes, ...board])];
};

const byName = function byName(left: string, right: string): number {
    return left.localeCompare(right, "en");
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const scope: ResolveScope = {
            byBasename: groupByBasename(context.paths),
            context,
            existing: new Set(context.paths),
            roots: rootsOf(context.repoRoot, context.taxonomy),
        };

        const reachable = reachableOf(context);
        const owned = reachable.filter((path) => !UPSTREAM_ROOTS.some((root) => path.startsWith(root)));
        const skippedAsImmutableContent = owned.filter((path) => contentIsImmutable(path));
        const walked = owned.filter((path) => !contentIsImmutable(path));
        const reached = reachable.filter((path) => !skippedAsImmutableContent.includes(path));

        const outcomes = walked.flatMap((path) =>
            readDocument(path, context.read(path))
                .segments.flatMap((segment) => referencesIn(segment))
                .map((reference) => ({ path, ...referenceOutcome(path, reference, scope) })),
        );

        const edges = new Map<string, Set<string>>();
        for (const { edge, path } of outcomes) {
            if (edge !== null) {
                recordEdge(edges, path, edge);
            }
        }

        const cycles = cyclesIn(edges);
        const findings = [
            ...outcomes.flatMap((outcome) => (outcome.finding === null ? [] : [outcome.finding])),
            ...cycles.map((cycle) => cycleFinding(cycle, edges.size)),
        ];

        return {
            derivations: {
                citing: [...edges.keys()].toSorted(byName),
                cycles: cycles.map((cycle) => cycle.join(" > ")),
                reached: reached.toSorted(byName),
                skippedAsImmutableContent: skippedAsImmutableContent.toSorted(byName),
            },
            findings,
            healed: [],
        };
    },
    extensions: [".md"],
    heals: false,
    invariant:
        "every in-tree reference in a governed document and on the coordination board resolves to a file that exists, and no set of documents cites itself in a closed loop",
    jurisdiction: "taxonomy",
    kinds: ["unresolved", "citationCycle"],
    reads: [...AXIS_DOCUMENTS, BOARD_PATH],
    readsTree:
        "a reference resolves against the whole tree rather than against the readable path set — it may " +
        "point at a binary, a generated artifact or a directory none of which the run hands to a rule — so " +
        "this rule reaches past the context by construction",

    stage: "content",
};

import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import {
    absentFinding,
    artifactFinding,
    axisFinding,
    foreignFinding,
    readsOf,
} from "../core/factories/declaration.factory.ts";
import { axisConsumers, silentOnItsOwnAxis } from "../core/validators/declaration.validator.ts";
import { foreignMarkerIn, isDirectory } from "../core/inspectors/taxonomy.inspector.ts";
import { slotText, surfacePath, surfacePrefix } from "../../config/surface.config.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { UPSTREAM_ROOTS } from "../core/constants/path.constants.ts";
import { inspectManifests } from "../core/inspectors/manifest.inspector.ts";
import { placeholderFindings } from "../core/inspectors/declaration.inspector.ts";
import { resolveArtifactRoots } from "../core/resolvers/artifact.resolver.ts";
import { underRoots } from "../core/filters/scope.filter.ts";

const AXIS_ADAPTER = slotText("project", "runtime_adapter");

const AXIS_GOVERNED = [
    `${surfacePath("pipeline")}/`,
    surfacePrefix().length === 0 ? AXIS_ADAPTER : `${surfacePrefix()}/${AXIS_ADAPTER}`,
];

const AXIS_REACHES = [
    "lifetimeOf(",
    "seededLifetimeOf(",
    "lifetime.declared",
    "declared.retention",
    "declared.mutability",
    "declared.removal",
];

type Taxonomy = RuleContext["taxonomy"];

const rootFindings = function rootFindings(
    repoRoot: string,
    roots: readonly string[],
    upstream: readonly string[],
): Finding[] {
    return [
        ...roots
            .filter((root) => !isDirectory(repoRoot, root))
            .map((root) =>
                absentFinding(
                    "missingRoot",
                    root,
                    `root "${root}"`,
                    "create the root, or remove it from containers / specialContainers / corpusRoots — a root that does not exist governs nothing",
                ),
            ),
        ...upstream
            .filter((root) => !isDirectory(repoRoot, root))
            .map((root) =>
                absentFinding(
                    "missingUpstreamRoot",
                    root,
                    `upstream root "${root}"`,
                    "create the tree, or remove it from the upstream declaration — an upstream root EXEMPTS its contents from the naming, tense and reference gates, so one that resolves to nothing exempts nothing while reading as a considered exclusion, and the next tree that lands under a similar name inherits an exemption nobody granted it",
                ),
            ),
    ];
};

const containerFindings = function containerFindings(repoRoot: string, data: Taxonomy): Finding[] {
    const declaredFolders: [string, readonly string[]][] = [
        ...Object.entries(data.containers),
        ...Object.entries(data.specialContainers),
    ];
    const missingFolders = declaredFolders
        .filter(([root]) => isDirectory(repoRoot, root))
        .flatMap(([root, folders]) => folders.map((folder) => ({ folder, root })))
        .filter(({ folder, root }) => !isDirectory(repoRoot, `${root}/${folder}`));
    const missingCorpora = Object.entries(data.corpusRoots).filter(
        ([root, config]) => !isDirectory(repoRoot, `${root}/${config.filedUnder}`),
    );

    return [
        ...missingFolders.map(({ folder, root }) =>
            absentFinding(
                "missingContainer",
                `${root}/${folder}`,
                `"${folder}" under "${root}"`,
                "create the folder, or drop it from the root's declared set — an undeclared-but-present folder fails placement, while a declared-but-absent one fails nothing at all",
            ),
        ),
        ...missingCorpora.map(([root, config]) =>
            absentFinding(
                "missingCorpusSubtree",
                `${root}/${config.filedUnder}`,
                `filedUnder "${config.filedUnder}" of corpus root "${root}"`,
                "create the subtree, or correct filedUnder — the facet filing check is skipped entirely when it resolves nowhere",
            ),
        ),
    ];
};

const foreignFindings = function foreignFindings(
    repoRoot: string,
    roots: readonly string[],
    data: Taxonomy,
): Finding[] {
    return roots.flatMap((root) => {
        const marker = isDirectory(repoRoot, root) ? foreignMarkerIn(repoRoot, root, data) : null;
        return marker === null ? [] : [foreignFinding(root, marker)];
    });
};

const artifactFindings = function artifactFindings(repoRoot: string, data: Taxonomy): Finding[] {
    return resolveArtifactRoots(repoRoot, data).flatMap((root) =>
        root.unresolved === null ? [] : [artifactFinding(root, root.unresolved)],
    );
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const data = context.taxonomy;
        const { repoRoot } = context;

        const roots = [
            ...new Set<string>([
                ...Object.keys(data.containers),
                ...Object.keys(data.specialContainers),
                ...Object.keys(data.corpusRoots),
            ]),
        ];
        const upstream = UPSTREAM_ROOTS.map((root) => (root.endsWith("/") ? root.slice(0, -1) : root));
        const resolvedRoots = roots.filter((root) => isDirectory(repoRoot, root));
        const resolvedUpstream = upstream.filter((root) => isDirectory(repoRoot, root));

        const consumers = underRoots(context.paths, AXIS_GOVERNED).flatMap((path) =>
            axisConsumers(context.read(path), AXIS_REACHES).map((consumer) => ({ consumer, path })),
        );
        const axisInspected = consumers.map(
            ({ consumer, path }) =>
                `${path}:${consumer.name} asserts ${consumer.asserted}, reads ${readsOf(consumer, "+", "no axis")}`,
        );

        const findings = [
            ...rootFindings(repoRoot, roots, upstream),
            ...containerFindings(repoRoot, data),
            ...foreignFindings(repoRoot, roots, data),
            ...artifactFindings(repoRoot, data),
            ...inspectManifests(repoRoot, data.ignored),
            ...consumers
                .filter(({ consumer }) => silentOnItsOwnAxis(consumer))
                .map(({ consumer, path }) => axisFinding(path, consumer)),
            ...placeholderFindings(context),
        ];

        return {
            derivations: {
                axisInspected,
                declarationsWalked: resolvedRoots.length + resolvedUpstream.length,
                resolvedRoots,
                resolvedUpstream,
            },
            findings,
            healed: [],
        };
    },
    extensions: [],

    heals: false,
    invariant: "every declared root, container, bucket and corpus root resolves to a directory on disk",
    jurisdiction: "taxonomy",
    kinds: [
        "missingRoot",
        "missingContainer",
        "missingCorpusSubtree",
        "missingUpstreamRoot",
        "foreignGrammarClaimed",
        "unresolvedArtifactRoot",
        "unreadAssertedAxis",
        "declaredRuntimeDependency",
        "unreachedDependency",
        "unrenamedPlaceholder",
    ],
    readsTree:
        "the invariant is that a declared root resolves to a directory that exists, and a declared " +
        "directory holding no files contributes no paths at all — so a path set cannot tell a root that " +
        "is declared and empty from one that is declared and absent, which is the case this rule exists " +
        "to catch",
    stage: "meta",

    wholeScopeOnly: true,
};

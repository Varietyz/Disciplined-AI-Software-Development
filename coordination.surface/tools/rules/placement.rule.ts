import type { Finding, Remediation } from "../core/types/segment.types.ts";

import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { basename, dirname } from "node:path";
import { checkPlacement, parseFilename } from "../core/validators/taxonomy.validator.ts";
import { BLOCKING_SUFFIX } from "../core/constants/blocking.constants.ts";
import { PLACEMENT_CODES } from "../core/types/taxonomy.types.ts";
import type { TaxonomyData } from "../core/types/taxonomy.types.ts";
import { UPSTREAM_ROOTS } from "../core/constants/path.constants.ts";
import { governedPath } from "../core/resolvers/taxonomy.resolver.ts";
import { isImmutable } from "../core/predicates/placement.predicate.ts";
import { surfacePath } from "../../config/surface.config.ts";

const folderForTag = function folderForTag(tag: string, data: TaxonomyData): string | null {
    return data.concernFolders.find((folder) => data.folderToTag[folder] === tag) ?? null;
};

const remediate = function remediate(code: string, path: string, name: string, data: TaxonomyData): Remediation {
    if (code === "looseFileAtRoot" || code === "parentNotConcern") {
        const { parsed } = parseFilename(name, data);
        if (parsed !== null) {
            const folder = folderForTag(parsed.concern, data);
            if (folder !== null) {
                return {
                    action: "move",
                    decide: "both operands are computed and this still does NOT heal, which is a property of the OPERATION rather than of the derivation: moving a file changes what every importer of it resolves, so the repair is not confined to the artifact the remediation names and applying it alone breaks the tree. A remediation heals where its effect is bounded by its own operands; this one is deterministic and unbounded, and the missing half is a reference rewrite this package does not perform. Take the move and the importers together, by hand, in one change",
                    deterministic: true,
                    from: path,
                    target: `${dirname(path)}/${folder}`,
                    to: `${dirname(path)}/${folder}/${name}`,
                };
            }
        }
        return {
            action: "classify",
            decide: "read the file, name the narrowest accurate concern, then place it in that concern folder",
            deterministic: false,
            from: path,
            target: path,
            to: null,
        };
    }

    const decideBy: Record<string, string> = {
        dottedFolder: "a folder carries one word and never a dot — choose the single word it is",
        nestedInSpecial: "a bucket holds files and never folders — move the folder out or stop declaring the bucket",
        roleOutOfOrder: "roles resolve container < subject < concern and are never revisited — reorder or drop a level",
        tooDeep: "relieve sideways: a collision takes the variant slot, breadth takes a sibling subject folder",
        undeclaredContainer:
            "work the container ladder: subject folder, concern folder, already grouped, or not source at all — only a new grouping axis earns a container",
    };

    return {
        action: "move",
        decide: decideBy[code] ?? `resolve placement code ${code}`,
        deterministic: false,
        from: path,
        target: path,
        to: null,
    };
};

export const PLACEMENT_ROUTES = ["boundary", "immutable", "outside", "reached", "upstream"] as const;

type PlacementRoute = (typeof PLACEMENT_ROUTES)[number];

interface PlacementOutcome {
    readonly path: string;
    readonly route: PlacementRoute;
    readonly finding: Finding | null;
}

const earlyRoute = function earlyRoute(path: string, board: string): PlacementRoute | null {
    if (UPSTREAM_ROOTS.some((root) => path.startsWith(root))) {
        return "upstream";
    }
    if (path === board) {
        return "boundary";
    }
    return isImmutable(path) ? "immutable" : null;
};

const placementFinding = function placementFinding(
    path: string,
    root: string,
    segments: readonly string[],
    data: TaxonomyData,
): Finding | null {
    const name = basename(path);
    const verdict = checkPlacement(root, segments, data, name);
    if (verdict.ok) {
        return null;
    }

    const remediation = remediate(verdict.code ?? "", path, name, data);
    return {
        actual: path,
        expected: remediation.to,
        healed: false,
        line: 0,
        locus: verdict.evidence,
        path,
        remediation,
        rule: `placement/${verdict.code ?? ""}`,
        stack: [
            { check: "jurisdiction", resolved: `root=${root}` },
            { check: "segments", resolved: segments.length === 0 ? "(none)" : segments.join("/") },
            { check: "placement", resolved: verdict.code ?? "fail" },
        ],
    };
};

const placementOutcome = function placementOutcome(path: string, data: TaxonomyData, board: string): PlacementOutcome {
    const early = earlyRoute(path, board);
    if (early !== null) {
        return { finding: null, path, route: early };
    }

    const governed = governedPath(path, data);
    if (governed === null) {
        return { finding: null, path, route: "outside" };
    }

    const name = basename(path);
    if (data.boundaryDocuments.includes(name) || name.endsWith(BLOCKING_SUFFIX)) {
        return { finding: null, path, route: "boundary" };
    }

    return { finding: placementFinding(path, governed.root, governed.segments, data), path, route: "reached" };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const board = surfacePath("board");
        const outcomes = context.paths.map((path) => placementOutcome(path, context.taxonomy, board));
        const pathsOn = (route: PlacementRoute): string[] =>
            outcomes.filter((outcome) => outcome.route === route).map((outcome) => outcome.path);

        return {
            derivations: {
                reached: pathsOn("reached"),
                skippedAsBoundaryDocument: pathsOn("boundary"),
                skippedAsImmutable: pathsOn("immutable"),
                skippedAsOutsideJurisdiction: pathsOn("outside"),
                skippedAsUpstream: pathsOn("upstream"),
            },
            findings: outcomes.flatMap((outcome) => (outcome.finding === null ? [] : [outcome.finding])),
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant: "every governed file resolves through the ordered roles to a concern folder within the depth cap",
    jurisdiction: "taxonomy",
    kinds: [...PLACEMENT_CODES],

    stage: "structure",
};

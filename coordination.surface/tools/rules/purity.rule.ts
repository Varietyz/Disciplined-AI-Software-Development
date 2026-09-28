import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { LEAF_FOLDERS } from "../core/constants/layer.constants.ts";
import { localImports } from "../core/analyzers/graph.analyzer.ts";
import { surfacePrefix } from "../../config/surface.config.ts";

const CONFIG_ROOT = ((): string => {
    const prefix = surfacePrefix();
    return prefix.length === 0 ? "config/" : `${prefix}/config/`;
})();

const DECIDE =
    "a leaf is the innermost tier and imports only leaves, which is what keeps the dependency graph acyclic " +
    "at its base and stops domain vocabulary reaching the tier every other tier depends on. An import " +
    "climbing OUT of the leaf tier inverts that: the leaf now needs what needs it, so nothing can be read " +
    "or replaced without reading the layer above it. Move the shared value DOWN into a leaf, or move the " +
    "importing module UP out of the leaf tier — never satisfy it by widening what counts as a leaf";

const inLeafTier = function inLeafTier(path: string): boolean {
    return LEAF_FOLDERS.some((folder) => path.startsWith(folder));
};

const climbsOut = function climbsOut(imported: string): boolean {
    return !inLeafTier(imported) && !imported.startsWith(CONFIG_ROOT);
};

const leafFinding = function leafFinding(path: string, imported: string): Finding {
    return {
        actual: imported,
        expected: null,
        healed: false,
        line: 1,
        locus: imported,
        path,
        remediation: { action: "none", decide: DECIDE, deterministic: false, from: path, target: path, to: null },
        rule: "purity/leafClimbsOut",
        stack: [
            { check: "tier", resolved: "leaf" },
            { check: "importedTier", resolved: "above" },
        ],
    };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const known = new Set(context.paths);
        const reached = context.paths.filter(inLeafTier);
        const findings = reached.flatMap((path) =>
            localImports(path, context.read(path), known)
                .filter(climbsOut)
                .map((imported) => leafFinding(path, imported)),
        );

        return {
            derivations: {
                leafFolders: [...LEAF_FOLDERS],
                reached,
                skippedAsOutsideLeafTier: context.paths.filter((path) => !inLeafTier(path)),
            },
            findings,
            healed: [],
        };
    },
    extensions: [".ts"],
    heals: false,
    invariant:
        "a module in the leaf tier imports only from the leaf tier or from the parameter surface beneath it, which depends on nothing in the tree and so cannot close a cycle",
    jurisdiction: "all",
    kinds: ["leafClimbsOut"],

    stage: "structure",
};

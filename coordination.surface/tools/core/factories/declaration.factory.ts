import type { ArtifactRoot } from "../types/artifact.types.ts";
import { BEHAVIOR_TREE_PLACEHOLDER } from "../constants/path.constants.ts";
import type { Finding } from "../types/segment.types.ts";
import type { ForeignMarker } from "../types/taxonomy.types.ts";
import type { axisConsumers } from "../validators/declaration.validator.ts";
import { surfacePath } from "../../../config/surface.config.ts";

type Consumer = ReturnType<typeof axisConsumers>[number];

const SSOT = surfacePath("taxonomy_config");

export const readsOf = function readsOf(consumer: Consumer, separator: string, empty: string): string {
    return consumer.read.length === 0 ? empty : consumer.read.join(separator);
};

export const absentFinding = function absentFinding(
    kind: string,
    path: string,
    locus: string,
    decide: string,
): Finding {
    return {
        actual: `${path} is declared but absent`,
        expected: null,
        healed: false,
        line: 0,
        locus,
        path: SSOT,
        remediation: { action: "declare", decide, deterministic: false, from: path, target: SSOT, to: null },
        rule: `declaration/${kind}`,
        stack: [
            { check: "declared", resolved: locus },
            { check: "onDisk", resolved: "absent" },
        ],
    };
};

export const foreignFinding = function foreignFinding(root: string, marker: ForeignMarker): Finding {
    return {
        actual: `${root} is declared, and holds ${marker.evidence}`,
        expected: null,
        healed: false,
        line: 0,
        locus: `root "${root}"`,
        path: SSOT,
        remediation: {
            action: "declare",
            decide: `${marker.why} Remove the declaration — a tree whose names are load-bearing elsewhere is governed on its own axis, never renamed to satisfy this grammar.`,
            deterministic: false,
            from: root,
            target: SSOT,
            to: null,
        },
        rule: "declaration/foreignGrammarClaimed",
        stack: [
            { check: "declared", resolved: `root "${root}"` },
            { check: "onDisk", resolved: "present" },
            { check: "foreignGrammar", resolved: marker.evidence },
        ],
    };
};

export const artifactFinding = function artifactFinding(root: ArtifactRoot, unresolved: string): Finding {
    return {
        actual: unresolved,
        expected: null,
        healed: false,
        line: 0,
        locus: `artifactRoots "${root.key}"`,
        path: SSOT,
        remediation: {
            action: "declare",
            decide:
                "repair the binding, or drop the artifact root — every content rule declaring this " +
                "jurisdiction currently scans nothing and reports a pass for files it never opened",
            deterministic: false,
            from: root.key,
            target: SSOT,
            to: null,
        },
        rule: "declaration/unresolvedArtifactRoot",
        stack: [
            { check: "binding", resolved: root.binding },
            { check: "field", resolved: root.field },
            { check: "resolved", resolved: "absent" },
        ],
    };
};

export const axisFinding = function axisFinding(path: string, consumer: Consumer): Finding {
    const reads = readsOf(consumer, "+", "no axis");
    return {
        actual: `${consumer.name} names the ${consumer.asserted} axis and never reads it, deciding from ${readsOf(consumer, " and ", "no declared axis")} instead`,
        expected: `${consumer.name} reads the ${consumer.asserted} field its own identity asserts`,
        healed: false,
        line: consumer.line,
        locus: consumer.name,
        path,
        remediation: {
            action: "declare",
            decide: "the declared axes are INDEPENDENT by the model this tree governs itself by — no two are derivable from each other — so a predicate deciding one of them from the others takes a derivation the model states is unavailable, and it is wrong from its first line rather than by drifting. THE SCOPE IS A BODY SCAN RATHER THAN A SIGNATURE SCAN, DELIBERATELY: narrowing to functions whose PARAMETER TYPE is the declared record keys on the property the CORRECT members share, so it passes every true negative and never sees a predicate that resolves the record inside its own body, which is the shape this check exists for. The residue is a predicate naming NO axis while reading the wrong fields, invisible here and stated rather than gated weakly, because the general question is what a predicate is FOR and no surface holds that",
            deterministic: false,
            from: reads,
            target: path,
            to: consumer.asserted,
        },
        rule: "declaration/unreadAssertedAxis",
        stack: [
            { check: "reachesLifetime", resolved: "yes" },
            { check: "asserts", resolved: consumer.asserted },
            { check: "reads", resolved: reads },
        ],
    };
};

export const leftoverFinding = function leftoverFinding(path: string): Finding {
    return {
        actual: `${path} names ${BEHAVIOR_TREE_PLACEHOLDER}, and no folder by that name exists`,
        expected: `${path} naming ${surfacePath("behavior_tree")}, the folder the behavior tree was renamed to`,
        healed: false,
        line: 0,
        locus: BEHAVIOR_TREE_PLACEHOLDER,
        path,
        remediation: {
            action: "rename",
            decide: "adoption renames the behavior folder from its shipped placeholder and replaces the placeholder wherever the package names it; this file still names the placeholder, so a path in it points at a folder that no longer exists. Replace the placeholder with the folder's new name",
            deterministic: false,
            from: BEHAVIOR_TREE_PLACEHOLDER,
            target: path,
            to: null,
        },
        rule: "declaration/unrenamedPlaceholder",
        stack: [
            { check: "placeholderFolder", resolved: "absent" },
            { check: "named", resolved: path },
        ],
    };
};

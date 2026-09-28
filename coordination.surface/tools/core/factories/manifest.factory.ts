import type { Finding } from "../types/segment.types.ts";

export const HOST_CLAIM =
    "the script names a target OUTSIDE this package's own root, which is a claim about a tree this " +
    "package does not own — so it resolves onto one consumer's layout or onto nothing, and it is " +
    "green on exactly the tree it was authored against. A DECLARATION WALK RUNS IN ONE DIRECTION: " +
    "it catches a claim with no referent and is constitutionally unable to catch a referent that " +
    "should not have been claimed, because its criterion is disk existence rather than ownership. " +
    "Move the invocation to the party that owns the capability, and let this package carry the DATA " +
    "that capability reads";

export const manifestFinding = function manifestFinding(
    manifestPath: string,
    kind: string,
    locus: string,
    actual: string,
    decide: string,
): Finding {
    return {
        actual,
        expected: null,
        healed: false,
        line: 0,
        locus,
        path: manifestPath,
        remediation: { action: "declare", decide, deterministic: false, from: actual, target: manifestPath, to: null },
        rule: `declaration/${kind}`,
        stack: [
            { check: "declared", resolved: locus },
            { check: "onDisk", resolved: "absent" },
        ],
    };
};

export const reachFinding = function reachFinding(manifestPath: string, name: string): Finding {
    return {
        actual: `${name} is declared and no source or configuration in this package reaches it`,
        expected: null,
        healed: false,
        line: 0,
        locus: `dependency "${name}"`,
        path: manifestPath,
        remediation: {
            action: "declare",
            decide: "a declared dependency nothing reaches makes the dependency set claim a coverage it does not have, and the claim is read by installers rather than by readers — so it costs an install on every consumer and buys nothing. Reach it from source or configuration, or remove the declaration. THE REACH CORPUS IS SOURCE AND CONFIGURATION ONLY, because a package NAMED in prose is being discussed rather than invoked, and a check counting a report about an unused dependency as evidence that it is used measures the opposite of its own question. This does not heal: whether a declaration is premature or obsolete is a judgement about intent that no artifact carries",
            deterministic: false,
            from: name,
            target: manifestPath,
            to: null,
        },
        rule: "declaration/unreachedDependency",
        stack: [
            { check: "declared", resolved: name },
            { check: "specifier", resolved: "absent" },
            { check: "invocation", resolved: "absent" },
        ],
    };
};

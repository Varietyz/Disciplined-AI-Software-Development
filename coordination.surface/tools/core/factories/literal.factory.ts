import type { Enumeration, Quoted } from "../types/literal.types.ts";
import type { Finding } from "../types/segment.types.ts";
import { lineOf } from "../analyzers/literal.analyzer.ts";

const DECIDE =
    "a path spelled in source is a claim about a tree this package does not own — it resolves onto the " +
    "consuming project or onto nothing, differently in every consumer, and the failure surfaces as a check " +
    "that silently governs the wrong files or refuses citations that are true. Every root resolves through " +
    "the parameter surface, which computes its prefix from its own file location, so the literal becomes an " +
    "argument to a composer or a declared slot rather than a value a reader trusts";

const ENUMERATION_DECIDE =
    "a RECURSIVE enumeration rooted at a path that resolves outside the declared surface prefix lists a tree " +
    "this package does not own — in a consumer that tree is the whole host repository, including everything " +
    "its dependencies install, so the call reads correct and costs minutes rather than milliseconds and the " +
    "failure presents as a run that hangs rather than as anything a verdict reports. The discriminator is " +
    "ENUMERATION rather than the root: resolving a NAMED path through the same root walks nothing and is the " +
    "correct form, which is why the safe uses far outnumber the hazardous one and a scan for the root alone " +
    "reports mostly noise. Narrow the enumeration to the surface's own prefix and prepend it to each entry, so " +
    "the listing covers exactly what this package declares";

export const rawPathFinding = function rawPathFinding(
    path: string,
    source: string,
    literal: Quoted,
    composer: string,
): Finding {
    return {
        actual: literal.value,
        expected: null,
        healed: false,
        line: lineOf(source, literal.close),
        locus: literal.value,
        path,
        remediation: {
            action: "declare",
            decide: DECIDE,
            deterministic: false,
            from: literal.value,
            target: path,
            to: null,
        },
        rule: "literal/rawPath",
        stack: [
            { check: "shape", resolved: "path" },
            { check: "composer", resolved: composer.length === 0 ? "none" : composer },
        ],
    };
};

export const enumerationFinding = function enumerationFinding(path: string, found: Enumeration): Finding {
    return {
        actual: `a recursive enumeration rooted at ${found.root}, which resolves outside the declared surface prefix`,
        expected: "an enumeration narrowed to the surface's own prefix",
        healed: false,
        line: found.line,
        locus: found.root,
        path,
        remediation: {
            action: "declare",
            decide: ENUMERATION_DECIDE,
            deterministic: false,
            from: found.root,
            target: path,
            to: null,
        },
        rule: "literal/unboundedEnumeration",
        stack: [
            { check: "call", resolved: "recursive enumeration" },
            { check: "root", resolved: found.root },
            { check: "narrowed", resolved: "no" },
        ],
    };
};

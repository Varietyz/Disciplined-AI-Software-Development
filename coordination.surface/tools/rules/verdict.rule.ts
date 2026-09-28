import { AGENT_ROOT, DIGEST_ROOT, TEMPLATE_ROOT } from "../core/constants/template.constants.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { declaredTiers, escapedVocabulary } from "../core/validators/verdict.validator.ts";
import { outsideRoots, underRoots } from "../core/filters/scope.filter.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { MIDDLE_TIERS } from "../core/constants/verdict.constants.ts";
import { stringLiterals } from "../core/predicates/literal.predicate.ts";
import { surfacePath } from "../../config/surface.config.ts";

const GOVERNED = [`${surfacePath("pipeline")}/`];

const VOCABULARY = [`${surfacePath("core")}/constants/`];

const DEFINITIONS = [AGENT_ROOT, TEMPLATE_ROOT, DIGEST_ROOT];

const finding = function finding(path: string, line: number, tier: string): Finding {
    return {
        actual: `${path} declares a ${tier} verdict tier`,
        expected: "pass or fail",
        healed: false,
        line,
        locus: tier,
        path,
        remediation: {
            action: "declare",
            decide: "a middle tier lets a run terminate as successful while a failure is still open, which is the outcome the binary verdict exists to prevent; promote it to a failure or delete the check, and keep severity as repair ordering among failures",
            deterministic: false,
            from: tier,
            target: path,
            to: null,
        },
        rule: "verdict/middleTier",
        stack: [
            { check: "verdict", resolved: tier },
            { check: "binary", resolved: "no" },
        ],
    };
};

const escapeFinding = function escapeFinding(path: string): Finding {
    return {
        actual: `${path} declares a tier vocabulary under the exemption and no rule consumes it`,
        expected: "a tier vocabulary the detector that hunts it imports, or no tier vocabulary here",
        healed: false,
        line: 0,
        locus: "tier vocabulary",
        path,
        remediation: {
            action: "move",
            decide:
                "the vocabulary exemption exists so a detector can name the words it forbids without " +
                "reporting itself, and it is scoped by PATH — so any other tier list placed there is " +
                "invisible to the scan for the same reason the detector's own list is. A tier vocabulary " +
                "no rule imports is not a detector's vocabulary; it is a level set, and a level read as an " +
                "ordering is a middle tier under another name",
            deterministic: false,
            from: path,
            target: path,
            to: null,
        },
        rule: "verdict/vocabularyEscape",
        stack: [
            { check: "underExemption", resolved: "yes" },
            { check: "claimedByDetector", resolved: "no" },
        ],
    };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const findings: Finding[] = [];
        const scoped = outsideRoots(underRoots(context.paths, GOVERNED), VOCABULARY);
        const definitions = underRoots(context.paths, DEFINITIONS);

        for (const path of scoped) {
            for (const literal of stringLiterals(context.read(path))) {
                const value = literal.value.toLowerCase();
                if (!MIDDLE_TIERS.includes(value)) {
                    continue;
                }
                findings.push(finding(path, literal.line, value));
            }
        }

        for (const path of definitions) {
            for (const declared of declaredTiers(context.read(path))) {
                findings.push(finding(path, declared.line, declared.tier));
            }
        }

        for (const path of escapedVocabulary(context.paths, context.read, VOCABULARY)) {
            findings.push(escapeFinding(path));
        }

        return {
            derivations: { definitions: definitions.length, inspected: scoped.length, tiers: MIDDLE_TIERS },
            findings,
            healed: [],
        };
    },
    extensions: [".ts", ".md"],
    heals: false,
    invariant: "a gate returns pass or fail and declares no middle tier",
    jurisdiction: "taxonomy",
    kinds: ["middleTier", "vocabularyEscape"],

    stage: "meta",
};

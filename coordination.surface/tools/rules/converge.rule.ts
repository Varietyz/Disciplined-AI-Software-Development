import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { CONVERGENCE_SOURCES } from "../core/constants/converge.constants.ts";
import { DESTRUCTIVE_STEPS } from "../core/validators/converge.validator.ts";
import type { Finding } from "../core/types/segment.types.ts";

interface StandingPrecondition {
    readonly instruction: string;
    readonly step: string;
    readonly loss: string;
}

const BEFORE_IRREVERSIBLE: readonly StandingPrecondition[] = [
    {
        instruction: "a converged venue is moved into the archive and is never removed from disk",
        loss: "the argument that produced the outcome, which no later reader can reconstruct from the outcome alone, so a ruling and a preference become indistinguishable",
        step: "archive",
    },
    {
        instruction:
            "the successor exists carrying every inherited clause before its predecessor leaves the active tree",
        loss: "every question the venue deliberately left open, deferred to a venue that does not exist and therefore to nobody",
        step: "successor",
    },
    {
        instruction: "each seat's durable half is authored and resolves before the venue leaves",
        loss: "the class each seat extracted, which the outcome does not carry and the accumulator was the only home for",
        step: "durable",
    },
    {
        instruction: "the distribution carries no open item, so the outcome is built rather than merely agreed",
        loss: "the implementation the decision implies, leaving a settled ruling, a clean gate and an unchanged tree",
        step: "absorption",
    },
];

const PERFORMED: ReadonlySet<string> = new Set(DESTRUCTIVE_STEPS);

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const present = CONVERGENCE_SOURCES.filter((path) => context.paths.includes(path));

        if (present.length === 0) {
            return {
                derivations: {
                    destructivePath: "outside this run's path set",
                    skippedAsOutOfScope: CONVERGENCE_SOURCES,
                },
                findings: [],
                healed: [],
            };
        }

        const carried: string[] = [];
        const missing: StandingPrecondition[] = [];

        for (const precondition of BEFORE_IRREVERSIBLE) {
            if (PERFORMED.has(precondition.step)) {
                carried.push(precondition.step);
                continue;
            }
            missing.push(precondition);
        }

        const findings: Finding[] = missing.map((precondition) => ({
            actual: `a standing instruction requires the ${precondition.step} step before an irreversible operation and the tool declares no step of that name`,
            expected: null,
            healed: false,
            line: 0,
            locus: precondition.step,
            path: present[0] ?? "",
            remediation: {
                action: "declare",
                decide:
                    `implement the ${precondition.step} step in the tool that performs the irreversible operation, ` +
                    `because what a missing step costs here is ${precondition.loss} — and it costs it silently, since ` +
                    "the report describes what the tool DID rather than what was required, so the omission is invisible " +
                    "in both directions. A tool omitting a non-destructive step leaves a gap somebody closes later; one " +
                    "omitting a step before an irreversible operation closes nothing later, because the operand is gone. " +
                    "Until it is implemented the step is taken BY HAND FIRST and declared, which is a bypass with a cost " +
                    "rather than a loss — and a precondition held by memory is discipline, which is what this check exists " +
                    "to replace",
                deterministic: false,
                from: precondition.step,
                target: present[0] ?? "",
                to: null,
            },
            rule: "converge/unimplementedStep",
            stack: [
                { check: "instruction", resolved: precondition.instruction },
                { check: "step", resolved: precondition.step },
                { check: "implemented", resolved: "absent" },
            ],
        }));

        return {
            derivations: {
                carried,
                classified: BEFORE_IRREVERSIBLE.map((precondition) => precondition.step),
                comparison:
                    "two DECLARED sets compared by identity: the standing preconditions this check classifies, against " +
                    "the step ids the tool itself declares for the edges it walks and the move it performs. Neither side " +
                    "is derived from text, so a step implemented under a callee name carrying no matching token is " +
                    "counted, and a step MENTIONED in prose or a help string is not — which is the whole reason a token " +
                    "scan was the wrong mechanism here rather than merely a loose one",
                destructivePath: present,
                missing: missing.map((precondition) => precondition.step),
                notChecked:
                    "a standing precondition nobody has classified into the declared set — the instructions live in prose " +
                    "across the governing surfaces, and extracting a step from prose needs a phrase list or an inference, " +
                    "both of which this tree refuses. So this check ranges over the CLASSIFIED preconditions and over " +
                    "nothing else, and its green means every classified one is DECLARED rather than that every standing " +
                    "one is. It also does not decide that a declared step is correctly IMPLEMENTED — the tool declaring a " +
                    "step and the tool performing it are two claims, and only the first is an artifact. The unclassified " +
                    "list is published rather than reported, because a step the tool declares that no standing instruction " +
                    "classifies is a reading for whoever owns the registry rather than a defect in either surface",
                performed: [...PERFORMED],
                unclassified: [...PERFORMED].filter(
                    (step) => !BEFORE_IRREVERSIBLE.some((precondition) => precondition.step === step),
                ),
            },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant:
        "every standing precondition on an irreversible operation is implemented by the tool that performs it, so the step never depends on whoever remembers",
    jurisdiction: "all",
    kinds: ["unimplementedStep"],

    reads: CONVERGENCE_SOURCES,

    stage: "meta",
};

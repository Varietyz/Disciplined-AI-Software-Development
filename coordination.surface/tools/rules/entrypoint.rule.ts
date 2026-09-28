import {
    ENTRYPOINT_ROOTS,
    GUARD_RESOLUTION_DEPTH,
    MUTATION_FIELDS,
    OPT_IN_MUTATION_FLAGS,
    PIPELINE_ENTRY,
    PRESENCE_READERS,
    REPORT_CALL,
} from "../core/constants/path.constants.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import {
    duplicateEntry,
    optInFinding,
    presenceBackedGuard,
    unpublishedOperand,
    unwitnessed,
} from "../core/factories/entrypoint.factory.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { presenceBackedMutationGuards } from "../core/resolvers/entrypoint.resolver.ts";
import { stringLiterals } from "../core/predicates/literal.predicate.ts";
import { underRoots } from "../core/filters/scope.filter.ts";
import { unpublishedBranchOperands } from "../core/inspectors/entrypoint.inspector.ts";
import { unwitnessedWrites } from "../core/validators/entrypoint.validator.ts";

const entrypointFindings = function entrypointFindings(path: string, source: string): Finding[] {
    const guards = presenceBackedMutationGuards(source, MUTATION_FIELDS, PRESENCE_READERS, GUARD_RESOLUTION_DEPTH);
    return [
        ...stringLiterals(source)
            .filter((literal) => OPT_IN_MUTATION_FLAGS.includes(literal.value))
            .map((literal) => optInFinding(path, literal.line, literal.value)),
        ...unwitnessedWrites(source).map((mutation) => unwitnessed(path, mutation)),
        ...unpublishedBranchOperands(source, PIPELINE_ENTRY, REPORT_CALL).map((operand) =>
            unpublishedOperand(path, operand),
        ),
        ...guards.map((guard) => presenceBackedGuard(path, guard)),
    ];
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const scoped = underRoots(context.paths, ENTRYPOINT_ROOTS);
        const pipelines = scoped.filter((path) => context.read(path).includes(PIPELINE_ENTRY));
        const findings = [
            ...scoped.flatMap((path) => entrypointFindings(path, context.read(path))),
            ...pipelines.slice(1).map((path) => duplicateEntry(path, pipelines)),
        ];

        return {
            derivations: {
                entrypoints: scoped,
                guardResolutionBound:
                    "the chain from a mutation operand to its reader is followed through local declarations to the " +
                    "declared depth and no further, so a guard whose operand is assembled across more hops than that " +
                    "is outside this check — the bound is stated rather than implied, because a mechanism that " +
                    "appears exhaustive and is not is worse than one whose limit a reader can see",
                guardResolutionDepth: GUARD_RESOLUTION_DEPTH,
                mutationFields: [...MUTATION_FIELDS],
                pipelines,
                presenceReaders: [...PRESENCE_READERS],
            },
            findings,
            healed: [],
        };
    },
    extensions: [".ts"],
    heals: false,
    invariant:
        "every entrypoint heals by default, disables healing only through the declared flag, resolves the decision to mutate from a reader answering who is WRITING rather than who EXISTS, and never rewrites a file from an earlier read without a compared witness",
    jurisdiction: "taxonomy",
    kinds: [
        "healingIsOptIn",
        "unpublishedBranchOperand",
        "secondPipelineEntry",
        "unwitnessedWrite",
        "presenceBackedMutationGuard",
    ],

    stage: "meta",
};

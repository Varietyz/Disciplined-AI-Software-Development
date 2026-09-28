import { AXIS_DOCUMENTS, PRINCIPLE_CATALOG } from "../core/constants/path.constants.ts";
import type { Declaration, DeclarationRoute } from "../core/types/coverage.types.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { UNBUILT_HALF, checkableHalves, inspectDigests } from "../core/validators/coverage.validator.ts";
import { declarationOutcome, duplicateFindings } from "../core/resolvers/coverage.resolver.ts";
import { DIGEST_ROOT } from "../core/constants/template.constants.ts";
import { ROSTER } from "../core/constants/conduct.constants.ts";
import { RULE_ROOT } from "../core/constants/layer.constants.ts";
import { identityOf } from "../core/registries/rule.registry.ts";
import { readDeclaredRules } from "../core/readers/rule.reader.ts";
import { stepEmittedIds } from "../core/validators/emission.validator.ts";
import { unbuiltFinding } from "../core/factories/coverage.factory.ts";
import { walkPrinciples } from "../core/readers/architecture.reader.ts";
const principleWalkOf = function principleWalkOf(context: RuleContext, digests: readonly string[]): object {
    if (PRINCIPLE_CATALOG === null) {
        return {
            meaning:
                "no principle catalog is declared, so the branch that walks one does not " +
                "run. A consumer treating an absent slot as a value manufactures a demand " +
                "nothing can satisfy, and a fabricated pass reads exactly like a real one",
            state: "ABSENT",
        };
    }

    const walk = walkPrinciples(
        context.read(PRINCIPLE_CATALOG),
        digests.map((path) => context.read(path)),
    );
    return {
        cited: walk.cited,
        danglingCitations: walk.danglingCitations,
        declared: walk.declared,
        meaning:
            "citation measures whether the catalog has been WALKED at a decision point, never " +
            "whether a principle holds — an uncited record may already be satisfied by the tree " +
            "and a cited one may be cited without being enforced. It is a drainable worklist of " +
            "principles nothing has yet been reasoned against, not a count of unenforced ones",
        uncited: walk.uncited,
    };
};

const listed = function listed(entry: Declaration): { slug: string; axis: string; locked: boolean } {
    return { axis: entry.path, locked: entry.declared.locked, slug: entry.declared.slug };
};

const countByGate = function countByGate(gates: readonly string[]): Record<string, number> {
    const byGate: Record<string, number> = {};
    for (const gate of gates) {
        byGate[gate] = (byGate[gate] ?? 0) + 1;
    }
    return byGate;
};

export const rule: RuleDeclaration = {
    check(context: RuleContext, fix: boolean): RuleResult {
        const digests = context.paths.filter((path) => path.startsWith(DIGEST_ROOT));
        const registered = new Set([
            ...context.paths.filter((path) => path.startsWith(RULE_ROOT)).map(identityOf),
            ...stepEmittedIds(context.repoRoot),
        ]);
        const registry = context.paths.includes(ROSTER) ? context.read(ROSTER) : "";

        const entries: Declaration[] = AXIS_DOCUMENTS.filter((path) => context.paths.includes(path)).flatMap((path) =>
            readDeclaredRules(context.read(path)).map((declared) => ({ declared, path })),
        );
        const outcomes = entries.map((entry) => ({ entry, ...declarationOutcome(entry, registry, registered) }));
        const routed = (route: DeclarationRoute): Declaration[] =>
            outcomes.filter((outcome) => outcome.route === route).map((outcome) => outcome.entry);

        const gated = routed("gated").map(({ declared, path }) => ({
            axis: path,
            gate: declared.gate,
            slug: declared.slug,
        }));
        const ungated = routed("ungated").map(listed);
        const conduct = routed("conduct").map(listed);
        const conditional = outcomes.flatMap(({ conditional: needed, entry }) =>
            needed === null
                ? []
                : [{ reached: needed.reached, slot: `${needed.section}.${needed.name}`, slug: entry.declared.slug }],
        );

        const halves = checkableHalves(registry, registered);
        const unbuilt = halves.filter((half) => half.gate === UNBUILT_HALF);
        const slugs = new Set(entries.map((entry) => entry.declared.slug));
        const digestResult = inspectDigests(context.repoRoot, digests, slugs, fix);

        const findings = [
            ...outcomes.flatMap((outcome, index) => [
                ...duplicateFindings(outcome.entry, entries.slice(0, index)),
                ...outcome.findings,
            ]),
            ...unbuilt.map(unbuiltFinding),
            ...digestResult.findings,
        ];
        const lockedUngated = ungated.filter((entry) => entry.locked);

        return {
            derivations: {
                byGate: countByGate(gated.map((entry) => entry.gate)),
                checkableHalvesObserved: halves.filter((half) => half.gate !== UNBUILT_HALF),
                checkableHalvesUnbuilt: unbuilt,
                conditional,
                conditionalReading:
                    "a rule here names a REGISTERED gate whose enforcing branch depends on a slot, so it is GATED-WHEN-RESOLVED rather than gated or ungated. Where the slot resolves it is reached and enforced; where it does not, it is UNREACHED and counted in neither the gated total's claim nor the ungated backlog — because counting it gated puts a zero-ungated total over a rule nothing enforces, and counting it ungated makes a deployment permanently red on a finding whose only repair is acquiring a host. Whether an unreached gate FAILS is the consumer's declaration and is read from its own slot rather than guessed here",
                conduct,
                counts: {
                    conduct: conduct.length,
                    declared: gated.length + conduct.length + ungated.length,
                    gated: gated.length,
                    lockedUngated: lockedUngated.length,
                    unbuiltCheckableHalves: unbuilt.length,
                    ungated: ungated.length,
                },
                expanded: digestResult.expanded,
                gated,
                lockedUngated,
                principleWalk: principleWalkOf(context, digests),
                registeredGates: [...registered].toSorted((left, right) => left.localeCompare(right, "en")),
                ungated,
            },
            findings,
            healed: [...digestResult.healed],
        };
    },
    extensions: [".md", ".ts"],
    heals: true,
    invariant:
        "every declared rule across every governing surface carries a registered gate or a proven conduct claim, and an ungated rule fails",
    jurisdiction: "taxonomy",
    kinds: [
        "digestDeclares",
        "duplicateSlug",
        "unbuiltCheckableHalf",
        "undeclaredExpansion",
        "ungatedBacklog",
        "unknownGate",
        "unprovenConduct",
        "unreachedGate",
    ],
    reads: PRINCIPLE_CATALOG === null ? AXIS_DOCUMENTS : [...AXIS_DOCUMENTS, PRINCIPLE_CATALOG],
    stage: "meta",

    wholeScopeOnly: true,
};

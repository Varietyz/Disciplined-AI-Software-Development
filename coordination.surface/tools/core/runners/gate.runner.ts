import { CLEAR_STATES, countIn, movedOf, verdictKey, worstVerdicts } from "../comparators/gate.comparator.ts";
import { judge, unsuppliedReads } from "../validators/gate.validator.ts";
import type { GateFixture } from "../types/fixture.types.ts";
import type { GateOutcome } from "../types/gate.types.ts";
import { NO_FIXTURE_PAIR } from "../strings/gate.strings.ts";
import { discoverFixtures } from "../registries/fixture.registry.ts";
import { discoverRules } from "../registries/rule.registry.ts";
import { judgeBranch } from "../inspectors/gate.inspector.ts";
import { priorKindVerdicts } from "../readers/gate.reader.ts";

interface RunnerReport {
    readonly outcomes: readonly GateOutcome[];
    readonly branches: readonly GateOutcome[];
    readonly proven: number;
    readonly exempt: number;
    readonly untested: number;
    readonly failed: number;
    readonly branchesProven: number;
    readonly branchesOpen: number;
    readonly unfixturedKinds: readonly string[];
    readonly kindVerdicts: Readonly<Record<string, string>>;
    readonly movedVerdicts: { readonly kinds: readonly string[]; readonly bound: string };
    readonly treeLoadedReads: { readonly fixtures: readonly string[]; readonly bound: string };
    readonly kindScope: { readonly declaredKinds: number; readonly rules: number; readonly bound: string };
}

type Registered = Awaited<ReturnType<typeof discoverRules>>["rules"][number];

interface RuleJudgement {
    readonly outcome: GateOutcome;
    readonly exposed: string[];
    readonly verdicts: [string, GateOutcome["state"]][];
}

const UNTESTED: Omit<GateOutcome, "rule"> = { detail: NO_FIXTURE_PAIR, state: "untested" };

const judgeRule = function judgeRule(
    registered: Registered,
    held: readonly GateFixture[],
    repoRoot: string,
): RuleJudgement {
    if (held.length === 0) {
        return { exposed: [], outcome: { ...UNTESTED, rule: registered.id }, verdicts: [] };
    }

    const exposed = held.flatMap((fixture) => {
        const missing = unsuppliedReads(registered.declaration, fixture);
        return missing.length === 0 ? [] : [`${verdictKey(registered.id, fixture.kind)}: ${missing.join(", ")}`];
    });
    const judged = held.map((fixture) => ({
        fixture,
        outcome: judge(registered.id, registered.declaration, repoRoot, fixture),
    }));
    const verdicts = judged.map(({ fixture, outcome }): [string, GateOutcome["state"]] => [
        verdictKey(registered.id, fixture.kind),
        outcome.state,
    ]);
    const broken = judged.find(({ outcome }) => !CLEAR_STATES.has(outcome.state))?.outcome;
    const outcome = broken ?? {
        detail: judged.map((entry) => entry.outcome.detail).join(" · "),
        rule: registered.id,
        state: judged[0]?.outcome.state ?? "proven",
    };
    return { exposed, outcome, verdicts };
};

export const runGates = async function runGates(repoRoot: string): Promise<RunnerReport> {
    const registry = await discoverRules(repoRoot);
    const fixtures = await discoverFixtures(repoRoot);
    const declared = fixtures.gates;

    const judgements = registry.rules.map((registered) =>
        judgeRule(
            registered,
            declared.filter((fixture) => fixture.rule === registered.id),
            repoRoot,
        ),
    );
    const outcomes = judgements.map((judgement) => judgement.outcome);
    const exposed = judgements.flatMap((judgement) => judgement.exposed);
    const verdicts = worstVerdicts(judgements.flatMap((judgement) => judgement.verdicts));
    const movedVerdicts = movedOf(verdicts, priorKindVerdicts(repoRoot), exposed);

    const branches = fixtures.branches.map((fixture) => judgeBranch(fixture));

    const proven = countIn(outcomes, "proven");
    const exempt = countIn(outcomes, "exempt");
    const untested = countIn(outcomes, "untested");
    const failed = outcomes.length - proven - exempt - untested;

    const fixtured = new Set(
        declared.filter((one) => one.kind !== undefined).map((one) => `${one.rule}/${String(one.kind)}`),
    );
    const declaredKinds = registry.rules
        .flatMap((entry) => entry.declaration.kinds.map((kind) => `${entry.id}/${kind}`))
        .toSorted((left, right) => left.localeCompare(right, "en"));
    const unfixturedKinds = declaredKinds.filter((kind) => !fixtured.has(kind));

    const branchesProven = branches.filter((outcome) => outcome.state === "proven").length;

    return {
        branches,
        branchesOpen: branches.length - branchesProven,
        branchesProven,
        exempt,
        failed,
        kindScope: {
            bound:
                "every kind is DECLARED by the check that emits it and read from the registry, so the population " +
                "has no spelling to miss, no quote style to prefer, no delegation depth to bound and no " +
                "attribution to guess. THE PRIOR MECHANISM RECOVERED THIS SET BY MATCHING SOURCE TEXT, and a " +
                "check composing its kind as a template literal matched none of its forms — so the subtraction " +
                "that reports an unfixtured kind ranged over an empty population for those checks and could " +
                "never report a gap for one, publishing a zero whose own greenness was the evidence that what it " +
                "measured was working. A DECLARATION CAN STILL BE WRONG and the direction is the honest one: a " +
                "kind a check emits and does not declare is unproven and unreported, which is the same silence " +
                "as before for that one kind, while the population is now stated per check rather than inferred " +
                "for all of them. What closes that residue is the declaration and the emission sharing one " +
                "operand, which is a further change on the emitting sites rather than a bound on this one",
            declaredKinds: declaredKinds.length,
            rules: registry.rules.length,
        },
        kindVerdicts: verdicts,
        movedVerdicts: {
            bound:
                "each entry names a kind whose verdict DIFFERS from the previous run's. The prior verdict is retained " +
                "BY this comparison and consumed by it, which is what makes it an operand rather than a diary — remove " +
                "the comparison and the value stops being written. IT IS THE DELIVERY HALF OF THE TREE-LOADED-READS " +
                "POPULATION: that list is correct and reaches only a reader who already suspects what it would tell " +
                "them, because the defect it describes is a proof changing verdict when ANOTHER party edits an " +
                "unrelated file — so the reader who needs it has just been handed a result they cannot explain and no " +
                "signal saying this is that case. A moved verdict names the case AT THE MOMENT IT OCCURS, and where the " +
                "moved kind also leaves a declared read to the tree the entry says so, which is the explanation beside " +
                "the signal. Movement is also the discriminator the artifact cannot carry: deliberate reliance is " +
                "stable and a forgotten sibling is exactly what moves when unrelated work lands",
            kinds: movedVerdicts,
        },
        outcomes,
        proven,
        treeLoadedReads: {
            bound:
                "each entry names a fixture whose rule declares a read the fixture does not supply, so the certifier " +
                "loads it FROM THE REAL TREE and that half of the proof ranges over content the fixture never declared. " +
                "THIS IS PUBLISHED RATHER THAN FAILED, and the reason is measured rather than assumed: the same " +
                "comparison as a failing check names most of the fixture population, because a rule that DERIVES its " +
                "schema from a contract surface is meant to be proven against the real contract — so a red here would " +
                "fire on the correct pattern and the incorrect one alike, which is a check that punishes the right " +
                "answer. What it cannot separate is a fixture relying on a contract deliberately from one that supplied " +
                "a sibling and forgot this member, and nothing in either artifact distinguishes them. The measured harm " +
                "is real: a fixture in this shape changes verdict when unrelated work lands, so its failure is triggered " +
                "by another party's edit and presents as a flake with no attributable cause. The list is the population " +
                "a reader checks when a proof moves for no reason it can find",
            fixtures: exposed,
        },
        unfixturedKinds,
        untested,
    };
};

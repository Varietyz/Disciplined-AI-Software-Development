export const contractContradicted = function contractContradicted(contradicted: readonly string[]): string {
    return (
        `REFUSED  The gate report describes one of its own fields in a way the field's contents contradict: ` +
        `${contradicted.join("; ")}. The report was not written. Correct the description or the field, then run ` +
        "the gates again.\n"
    );
};

export const NO_FIXTURE_PAIR = "no fixture pair declares what this rule must fire on and must accept";

export const EXEMPTION_SAMPLED =
    "the fixture declares an exemption and also declares samples, so the exemption is untested rather than impossible";

export const branchThrew = function branchThrew(error: string): string {
    return `the branch threw rather than returning an outcome: ${error}`;
};

export const branchExercised = function branchExercised(observed: string): string {
    return `EXERCISED in an isolated tree · ${observed}`;
};

export const healerThrew = function healerThrew(error: string): string {
    return `the healer threw rather than repairing: ${error}`;
};

export const ruleThrew = function ruleThrew(error: string): string {
    return `the rule threw on its fixture rather than reporting: ${error}`;
};

export const branchDisagrees = function branchDisagrees(apart: string): string {
    return (
        `the branch ran, and its effect differs from what the fixture declares: ${apart}. ` +
        "A branch is proven by its effect on the tree, because a refusal reported over a tree the branch " +
        "already changed reads like a refusal that changed nothing."
    );
};

export const proofRunEmpty = function proofRunEmpty(output: string): string {
    return (
        "the proof run produced no outcomes, so no rule has been shown to fire. A run whose own invocation " +
        `failed reports the same green as a run where every pair passed. Output: ${output}`
    );
};

export const healedNothing = function healedNothing(kind: string): string {
    return (
        `the healing fixture for ${kind} healed nothing. The rule declares that it heals, and its healing branch ` +
        "made no repair on a sample built to need one, so the branch is unproven. A run that reports no repairs " +
        "then looks the same as a run whose healer cannot fire."
    );
};

export const healSurvived = function healSurvived(kind: string, left: number): string {
    return (
        `the healing fixture for ${kind} healed, and ${String(left)} finding(s) still stand after the repair. ` +
        "The repair fails the rule's own check, so the fix does not converge."
    );
};

export const healOnlyProven = function healOnlyProven(kind: string, healed: string): string {
    return (
        `kind ${kind} · HEALING-ONLY · HEALED ${healed}, and the repair passed its own re-check. ` +
        "A kind that cannot fire with healing off is proven by its heal, the firing member, and by the clean " +
        "re-check, the accepting one."
    );
};

export const violatingSilent = function violatingSilent(kind: string, samples: string): string {
    return `the violating fixture for ${kind} produced no finding, so the rule is not shown to fire. Samples: ${samples}`;
};

export const cleanNoisy = function cleanNoisy(kind: string, count: number, first: string): string {
    return (
        `the clean fixture for ${kind} produced ${String(count)} findings, so the rule fires on input it must ` +
        `accept. First: ${first}`
    );
};

export const judgementAstray = function judgementAstray(target: string, path: string): string {
    return (
        `a judgement finding targets ${target} while it reports ${path}. A remediation that names an artifact ` +
        "other than the one in violation offers one branch of a judgement as the answer, and a consumer then " +
        "acts on the target rather than on the decide field."
    );
};

export const healedSuffix = function healedSuffix(healed: string): string {
    return ` · HEALED ${healed}, and the repair passed its own re-check`;
};

export const kindProven = function kindProven(kind: string, fired: number, fires: string, passes: string): string {
    return `kind ${kind} · FIRED ${String(fired)} finding(s) on ${fires} · ACCEPTED ${passes}`;
};

export const gateSummary = function gateSummary(
    verdict: string,
    tally: {
        readonly branchesOpen: number;
        readonly branchesProven: number;
        readonly exempt: number;
        readonly failed: number;
        readonly proven: number;
        readonly unfixtured: number;
        readonly untested: number;
    },
    report: string,
): string {
    return (
        `${verdict}  rules: proven=${String(tally.proven)} exempt=${String(tally.exempt)} ` +
        `untested=${String(tally.untested)} failed=${String(tally.failed)} · ` +
        `kinds: unfixtured=${String(tally.unfixtured)} · ` +
        `branches: proven=${String(tally.branchesProven)} open=${String(tally.branchesOpen)}\n` +
        `report: ${report}\n`
    );
};

export const outcomeLine = function outcomeLine(state: string, rule: string, detail: string): string {
    return `    ${state.padEnd(9)} ${rule.padEnd(16)} ${detail}\n`;
};

export const unfixturedKind = function unfixturedKind(kind: string): string {
    return `    unfixtured ${kind.padEnd(16)} a rule emits this kind, and no fixture pair covers it\n`;
};

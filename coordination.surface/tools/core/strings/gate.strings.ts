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

import type { Counted, GateOutcome } from "../types/gate.types.ts";
import {
    EXEMPTION_SAMPLED,
    cleanNoisy,
    healOnlyProven,
    healSurvived,
    healedNothing,
    healedSuffix,
    healerThrew,
    judgmentAstray,
    kindProven,
    ruleThrew,
    violatingSilent,
} from "../strings/gate.strings.ts";
import type { GateFixture, Sample } from "../types/fixture.types.ts";
import { countFindings, fromDisk } from "../resolvers/gate.resolver.ts";
import type { Finding } from "../types/segment.types.ts";
import type { RuleDeclaration } from "../types/rule.types.ts";
import { growFixtureTree } from "../generators/fixture.generator.ts";

export const unsuppliedReads = function unsuppliedReads(declaration: RuleDeclaration, fixture: GateFixture): string[] {
    if (fixture.exempt !== undefined) {
        return [];
    }
    if (fixture.onDisk === true) {
        return [];
    }

    const declared = declaration.reads ?? [];
    if (declared.length === 0) {
        return [];
    }

    const supplied = new Set<string>();
    for (const sample of [...(fixture.fires ?? []), ...(fixture.passes ?? [])]) {
        supplied.add(sample.path);
    }
    if (supplied.size === 0) {
        return [];
    }

    return declared.filter((path) => !supplied.has(path));
};

const healingOutcome = function healingOutcome(
    id: string,
    declaration: RuleDeclaration,
    fixture: GateFixture,
    samples: readonly Sample[],
): GateOutcome | null {
    const tree = growFixtureTree(samples);
    const declared = declaration.reads ?? [];
    const paths = samples.map((sample) => sample.path);

    try {
        const first = declaration.check(fromDisk(id, tree.root, paths, declared), true);
        if (first.healed.length === 0) {
            return { detail: healedNothing(fixture.kind ?? "any"), rule: id, state: "silent" };
        }

        const second = declaration.check(fromDisk(id, tree.root, paths, declared), false);
        const wanted = fixture.kind === undefined ? null : `${id}/${fixture.kind}`;
        const left = wanted === null ? second.findings : second.findings.filter((found) => found.rule === wanted);
        if (left.length > 0) {
            return { detail: healSurvived(fixture.kind ?? "any", left.length), rule: id, state: "noisy" };
        }

        return null;
    } catch (error) {
        return { detail: healerThrew(String(error)), rule: id, state: "noisy" };
    } finally {
        tree.release();
    }
};

const misdirected = function misdirected(findings: readonly Finding[]): Finding | null {
    return (
        findings.find((found) => !found.remediation.deterministic && found.remediation.target !== found.path) ?? null
    );
};

const pathsOf = function pathsOf(samples: readonly Sample[]): string {
    return samples.map((sample) => sample.path).join(", ");
};

const exemptOutcome = function exemptOutcome(id: string, exempt: string, sampled: boolean): GateOutcome {
    return sampled
        ? { detail: EXEMPTION_SAMPLED, rule: id, state: "noisy" }
        : { detail: exempt, rule: id, state: "exempt" };
};

const healOnlyOutcome = function healOnlyOutcome(
    id: string,
    declaration: RuleDeclaration,
    fixture: GateFixture,
    heals: readonly Sample[],
): GateOutcome {
    return (
        healingOutcome(id, declaration, fixture, heals) ?? {
            detail: healOnlyProven(fixture.kind ?? "any", pathsOf(heals)),
            rule: id,
            state: "proven",
        }
    );
};

const sampledFailure = function sampledFailure(
    id: string,
    fixture: GateFixture,
    fired: Counted,
    clean: Counted,
): GateOutcome | null {
    const error = fired.error ?? clean.error;
    if (error !== null) {
        return { detail: ruleThrew(error), rule: id, state: "noisy" };
    }
    if (fired.findings.length === 0) {
        return {
            detail: violatingSilent(fixture.kind ?? "any", pathsOf(fixture.fires ?? [])),
            rule: id,
            state: "silent",
        };
    }

    const [first] = clean.findings;
    return first === undefined
        ? null
        : {
              detail: cleanNoisy(
                  fixture.kind ?? "any",
                  clean.findings.length,
                  `${first.rule} at ${first.path}:${String(first.line)} — ${first.actual}`,
              ),
              rule: id,
              state: "noisy",
          };
};

const astrayOutcome = function astrayOutcome(id: string, fired: readonly Finding[]): GateOutcome | null {
    const astray = misdirected(fired);
    return astray === null
        ? null
        : { detail: judgmentAstray(astray.remediation.target, astray.path), rule: id, state: "noisy" };
};

const provenOutcome = function provenOutcome(id: string, fixture: GateFixture, fired: number): GateOutcome {
    const healed = fixture.heals === undefined ? "" : healedSuffix(pathsOf(fixture.heals));
    const proven = kindProven(
        fixture.kind ?? "any",
        fired,
        pathsOf(fixture.fires ?? []),
        pathsOf(fixture.passes ?? []),
    );
    return { detail: `${proven}${healed}`, rule: id, state: "proven" };
};

const sampledOutcome = function sampledOutcome(
    id: string,
    declaration: RuleDeclaration,
    repoRoot: string,
    fixture: GateFixture,
): GateOutcome {
    const fired = countFindings(id, declaration, repoRoot, fixture.fires ?? [], fixture.kind, fixture.onDisk);
    const clean = countFindings(id, declaration, repoRoot, fixture.passes ?? [], fixture.kind, fixture.onDisk);
    const healing = (): GateOutcome | null =>
        fixture.heals === undefined ? null : healingOutcome(id, declaration, fixture, fixture.heals);

    return (
        sampledFailure(id, fixture, fired, clean) ??
        healing() ??
        astrayOutcome(id, fired.findings) ??
        provenOutcome(id, fixture, fired.findings.length)
    );
};

export const judge = function judge(
    id: string,
    declaration: RuleDeclaration,
    repoRoot: string,
    fixture: GateFixture,
): GateOutcome {
    const sampled = (fixture.fires ?? []).length > 0 || (fixture.passes ?? []).length > 0;

    if (fixture.exempt !== undefined) {
        return exemptOutcome(id, fixture.exempt, sampled);
    }
    if (fixture.heals !== undefined && !sampled) {
        return healOnlyOutcome(id, declaration, fixture, fixture.heals);
    }
    return sampledOutcome(id, declaration, repoRoot, fixture);
};

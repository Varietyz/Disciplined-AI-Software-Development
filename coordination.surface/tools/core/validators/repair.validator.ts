import { fieldOf } from "../readers/json.reader.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { reportsIn } from "../readers/report.reader.ts";

interface UnrepairableLocus {
    readonly report: string;
    readonly rule: string;
    readonly target: string;
    readonly reason: "frozenTarget" | "permanentSpan";
}

interface UnrepairableCandidate {
    readonly key: string;
    readonly locus: UnrepairableLocus;
}

interface RepairJudges {
    readonly frozen: (target: string) => boolean;
    readonly permanentSpan: (path: string, locus: string) => boolean;
}

const textOf = function textOf(value: unknown): string {
    return typeof value === "string" ? value : "";
};

const reasonOf = function reasonOf(
    target: string,
    reported: string,
    locus: string,
    judges: RepairJudges,
): UnrepairableLocus["reason"] | null {
    if (judges.frozen(target)) {
        return "frozenTarget";
    }
    return judges.permanentSpan(reported, locus) ? "permanentSpan" : null;
};

const candidateOf = function candidateOf(
    entry: string,
    finding: unknown,
    judges: RepairJudges,
): UnrepairableCandidate[] {
    const remediation = isObject(finding) ? finding["remediation"] : undefined;
    const target = isObject(remediation) ? remediation["target"] : undefined;
    if (!isObject(finding) || typeof target !== "string") {
        return [];
    }

    const locus = textOf(finding["locus"]);
    const reason = reasonOf(target, textOf(finding["path"]), locus, judges);
    const rule = textOf(finding["rule"]);
    return reason === null
        ? []
        : [{ key: `${entry}|${rule}|${target}|${locus}`, locus: { reason, report: entry, rule, target } }];
};

export const unrepairableLoci = function unrepairableLoci(
    repoRoot: string,
    frozen: (target: string) => boolean,
    permanentSpan: (path: string, locus: string) => boolean,
): UnrepairableLocus[] {
    const judges: RepairJudges = { frozen, permanentSpan };
    const candidates = reportsIn(repoRoot).flatMap((report) => {
        const held = fieldOf(report.value, "findings");
        return Array.isArray(held)
            ? held.flatMap((finding: unknown) => candidateOf(report.entry, finding, judges))
            : [];
    });

    const seen = new Set<string>();
    return candidates
        .filter((candidate) => {
            const fresh = !seen.has(candidate.key);
            seen.add(candidate.key);
            return fresh;
        })
        .map((candidate) => candidate.locus);
};

import { DECLARATION_KEYS, STAGES } from "../types/rule.types.ts";
import { containsInCode, declaresProperty, reachesRegexLiteral } from "../predicates/source.predicate.ts";
import { findingShapeGaps, isConstructShaped, missingReportIdentity, reportMissing } from "./governance.validator.ts";
import type { Finding } from "../types/segment.types.ts";
import type { RuleContext } from "../types/rule.types.ts";
import { contains } from "../predicates/text.predicate.ts";
import { contractFinding } from "../factories/governance.factory.ts";
import { identityOf } from "../registries/rule.registry.ts";
import { unscopedRead } from "./source.validator.ts";

const REQUIRED_FINDING_FIELDS = ["rule", "path", "locus", "stack", "actual", "expected", "remediation", "healed"];

const matchingFindings = function matchingFindings(path: string, source: string): Finding[] {
    if (!containsInCode(source, "RegExp") && !reachesRegexLiteral(source)) {
        return [];
    }
    return [
        {
            ...contractFinding(
                path,
                "matching",
                "regular expression",
                "match by tree traversal, token comparison or exact string — a hand-written scanner is the mechanism, and the test is the CALL FORM rather than a list of method names, because a name list reopens the moment the language adds a method that accepts a literal",
                "regex banned",
            ),
            rule: "governance/matching",
        },
    ];
};

const reportFindings = function reportFindings(repoRoot: string, path: string): Finding[] {
    const id = identityOf(path);
    const missing = reportMissing(repoRoot, id)
        ? [
              contractFinding(
                  path,
                  id,
                  "no report on disk",
                  `run the pipeline so ${id} emits its report — the report is the re-readable state of a run, and a rule whose findings exist only in the moment of the run is unactionable the instant the process exits`,
                  "report absent",
              ),
          ]
        : [];
    const instance = isConstructShaped(id)
        ? []
        : [
              contractFinding(
                  path,
                  id,
                  "names an instance",
                  "a rule id names the construct it matches, never a path, vendor, filename or threshold — instances live as data the rule cites, so the id reads unchanged when the same shape recurs elsewhere",
                  "literal in id",
              ),
          ];

    return [
        ...missing,
        ...missingReportIdentity(repoRoot, id).map((field) =>
            contractFinding(
                path,
                `${id}.report.${field}`,
                "absent",
                `every report states the run that wrote it — "${field}" is what lets a reader tell an authoritative whole-tree run from a narrowed diagnostic one, and a report that cannot be told apart from a narrowed run is evidence for a claim nobody verified`,
                "report identity",
            ),
        ),
        ...instance,
    ];
};

const declarationFindings = function declarationFindings(repoRoot: string, path: string, source: string): Finding[] {
    const breach = unscopedRead(source);
    const unscoped =
        breach === null ? [] : [contractFinding(path, breach.locus, breach.actual, breach.decide, breach.resolved)];
    const declaresStage = STAGES.some((stage) => contains(source, `"${stage}"`));
    const stage = declaresStage
        ? []
        : [contractFinding(path, "stage", "unrecognised", `stage is one of ${STAGES.join(", ")}`, "unknown stage")];

    return [
        ...unscoped,
        ...DECLARATION_KEYS.filter((key) => !declaresProperty(source, key)).map((key) =>
            contractFinding(
                path,
                key,
                "absent",
                `declare the required field "${key}" — an optional field is one the gate cannot check`,
                "incomplete declaration",
            ),
        ),
        ...reportFindings(repoRoot, path),
        ...stage,
    ];
};

export const sourceFindings = function sourceFindings(repoRoot: string, path: string, source: string): Finding[] {
    const exported = contains(source, "export const rule");
    const contract = exported
        ? declarationFindings(repoRoot, path, source)
        : [
              contractFinding(
                  path,
                  "export",
                  "no exported rule declaration",
                  "export `const rule: RuleDeclaration` so the registry can discover it",
                  "missing export",
              ),
          ];
    return [...matchingFindings(path, source), ...contract];
};

export const shapeFindings = function shapeFindings(context: RuleContext): Finding[] {
    return findingShapeGaps(context.paths, context.read, REQUIRED_FINDING_FIELDS).map((gap) =>
        contractFinding(
            gap.path,
            `finding.${gap.field}`,
            "absent",
            `every emitted finding carries "${gap.field}" — a finding without it is prose the next agent must re-derive`,
            "finding shape",
        ),
    );
};

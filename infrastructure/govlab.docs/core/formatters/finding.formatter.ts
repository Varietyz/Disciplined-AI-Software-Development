import type { Categories, DescribedFinding, Finding, FindingSpec } from "#types/finding.types";
import { FIRST_POSITION, PINNED_LINE_CATEGORIES, SUMMARY_ORDER } from "#configuration/constants/finding.constants";
import {
    SUMMARY_LABELS,
    UNTAGGED_FENCE_FIX,
    barePathFix,
    brokenPathText,
    findingLine,
    tallyPart,
    unlabeledFenceFix,
    validateSummary,
} from "#configuration/strings/finding.strings";
import { expectedSuffix } from "#configuration/strings/document.strings";
import { historySmell } from "#configuration/strings/governance.strings";

const PART_SEPARATOR = ", ";

export const expectedText = function expectedText(hit: Finding): string {
    return typeof hit.expected === "string" ? expectedSuffix(hit.expected) : "";
};

export const conventionFix = function conventionFix(code: string, token: string): string {
    if (code === "bare-path") {
        return barePathFix(token);
    }
    return code === "untagged-code-fence" ? UNTAGGED_FENCE_FIX : unlabeledFenceFix(token);
};

const firstColumn = (): number => FIRST_POSITION;
const ownCode = (hit: Finding): string => hit.code ?? "";
const detailOf = (hit: Finding): string => hit.detail ?? "";
const columnOf = (hit: Finding): number => hit.col ?? FIRST_POSITION;
const fixed =
    (code: string): ((hit: Finding) => string) =>
    () =>
        code;

const FINDING_SPECS: readonly FindingSpec[] = [
    { code: fixed("spine"), column: firstColumn, key: "spine", text: detailOf },
    { code: fixed("agent-schema"), column: firstColumn, key: "agentSchema", text: detailOf },
    { code: fixed("doc-status"), column: firstColumn, key: "docStatus", text: detailOf },
    { code: fixed("section-spine"), column: firstColumn, key: "sections", text: (hit) => hit.remediation ?? "" },
    { code: ownCode, column: firstColumn, key: "location", text: (hit) => `${detailOf(hit)}${expectedText(hit)}` },
    {
        code: ownCode,
        column: columnOf,
        key: "conventions",
        text: (hit) => conventionFix(hit.code ?? "", hit.token ?? ""),
    },
    { code: ownCode, column: columnOf, key: "mermaid", text: detailOf },
    { code: fixed("mermaid-syntax"), column: firstColumn, key: "syntax", text: (hit) => hit.message ?? "" },
    { code: fixed("broken-path"), column: columnOf, key: "broken", text: (hit) => brokenPathText(hit.path ?? "") },
    { code: ownCode, column: columnOf, key: "refs", text: detailOf },
    { code: fixed("ref"), column: columnOf, key: "refsResolved", text: detailOf },
    { code: fixed("ontology-ref"), column: columnOf, key: "ontologyRefs", text: detailOf },
    { code: fixed("slot-ref"), column: columnOf, key: "slotRefs", text: detailOf },
    { code: fixed("history-smell"), column: columnOf, key: "smell", text: (hit) => historySmell(hit.term ?? "") },
];

const describeWith = function describeWith(spec: FindingSpec, hit: Finding): DescribedFinding {
    return {
        category: spec.key,
        code: spec.code(hit),
        col: spec.column(hit),
        line: PINNED_LINE_CATEGORIES.has(spec.key) ? FIRST_POSITION : (hit.line ?? FIRST_POSITION),
        text: spec.text(hit),
    };
};

export const describeFindings = function describeFindings(all: Categories): DescribedFinding[] {
    return FINDING_SPECS.flatMap((spec) => (all[spec.key] ?? []).map((hit) => describeWith(spec, hit)));
};

export const formatFinding = function formatFinding(described: DescribedFinding, rel: string): string {
    return findingLine(rel, described.line, described.col, described.code, described.text);
};

export const summaryLine = function summaryLine(
    scanned: number,
    withFindings: number,
    totals: Readonly<Record<string, number>>,
): string {
    const parts = SUMMARY_ORDER.map((key) => tallyPart(totals[key] ?? 0, SUMMARY_LABELS[key]));
    return validateSummary(scanned, withFindings, parts.join(PART_SEPARATOR));
};

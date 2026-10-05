import {
    CLEAN_LINE,
    FINDING_LABELS,
    findingHeading,
    findingLine,
    routeHeading,
    sidewaysLine,
} from "#configuration/strings/viewport.strings";
import type { ProbePage, ViewportAudit, ViewportProbe, ViewportResult, ViewportRules } from "#types/viewport.types";

const FINDING_KEYS = ["overflow", "inputs", "text", "targets", "clipped"] as const;

export const resultLines = function resultLines(result: ViewportResult): string {
    const { audit } = result;
    const sections = FINDING_KEYS.filter((key) => audit[key].length > 0).map(
        (key) => findingHeading(FINDING_LABELS[key], audit[key].length) + audit[key].map(findingLine).join(""),
    );
    const sideways = audit.scrollsSideways ? sidewaysLine : "";
    const body = sideways + sections.join("");
    return routeHeading(result.route, audit.viewport) + (body.length === 0 ? CLEAN_LINE : body);
};

export const reportJson = function reportJson(results: readonly ViewportResult[]): string {
    return `${JSON.stringify(results, null, 4)}\n`;
};

export const scrollExpression = function scrollExpression(
    scroll: (page: ProbePage, rules: ViewportRules) => Promise<number>,
    rules: ViewportRules,
): string {
    return `(${String(scroll)})(window, ${JSON.stringify(rules)})`;
};

export const auditExpression = function auditExpression(
    audit: (page: ProbePage, rules: ViewportRules, probe: ViewportProbe) => ViewportAudit,
    rules: ViewportRules,
    probe: ViewportProbe,
): string {
    const helpers = Object.entries(probe).map(
        ([name, helper]: readonly [string, unknown]) => `${name}: ${String(helper)}`,
    );
    return `(${String(audit)})(window, ${JSON.stringify(rules)}, { ${helpers.join(", ")} })`;
};

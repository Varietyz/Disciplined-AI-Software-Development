import { MALFORMED_ROOT, MISSING_VIEWBOX, forbiddenToken, unsafeSvg } from "#configuration/strings/markup.strings";
import { FORBIDDEN_MARKUP } from "#configuration/constants/walk.constants";

const VIEWBOX_MARKER = 'viewBox="0 0 ';
const SVG_OPEN = "<svg";
const SVG_CLOSE = "</svg>";
const ISSUE_JOIN = ", ";

export const hardenIssues = function hardenIssues(svg: string): string[] {
    const lower = svg.toLowerCase();
    const issues = FORBIDDEN_MARKUP.filter((token) => lower.includes(token)).map(forbiddenToken);
    if (!svg.includes(VIEWBOX_MARKER)) {
        issues.push(MISSING_VIEWBOX);
    }
    if (!svg.startsWith(SVG_OPEN) || !svg.trimEnd().endsWith(SVG_CLOSE)) {
        issues.push(MALFORMED_ROOT);
    }
    return issues;
};

export const assertHardened = function assertHardened(svg: string, label: string): void {
    const issues = hardenIssues(svg);
    if (issues.length > 0) {
        throw new Error(unsafeSvg(label, issues.join(ISSUE_JOIN)));
    }
};

export const MISSING_VIEWBOX = "missing a bounded viewBox";

export const MALFORMED_ROOT = "not a well-formed <svg> root";

export const forbiddenToken = function forbiddenToken(token: string): string {
    return `forbidden token "${token}"`;
};

export const unsafeSvg = function unsafeSvg(label: string, issues: string): string {
    return `unsafe SVG (${label}): ${issues}`;
};

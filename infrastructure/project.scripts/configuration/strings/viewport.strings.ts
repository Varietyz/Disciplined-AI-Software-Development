export const REFUSED_ARGUMENTS = "viewport: --out-dir is required.\n";

export const NO_BROWSER = "viewport: no browser binary was found. Pass --browser with the path to Chrome or Edge.\n";

export const NO_DEVTOOLS = "viewport: the browser's DevTools endpoint did not come up.\n";

export const NO_BUILD = "viewport: the built site has no pages. Build the site first.\n";

export const NO_SERVER_PORT = "viewport: the local server did not report its port.";

export const EMPTY_FRAME = "viewport: the browser returned an empty frame.";

export const CLEAN_LINE = "  none\n";

export const unknownRoute = function unknownRoute(route: string): string {
    return `viewport: ${route} is not a built route.\n`;
};

export const routeHeading = function routeHeading(route: string, viewport: number): string {
    return `\n${route} (${String(viewport)}px wide)\n`;
};

export const sidewaysLine = "  the page scrolls sideways\n";

export const findingHeading = function findingHeading(label: string, count: number): string {
    return `  ${label}: ${String(count)}\n`;
};

export const findingLine = function findingLine(entry: string): string {
    return `    ${entry}\n`;
};

export const FINDING_LABELS = {
    clipped: "Content cut off by its container",
    inputs: "Form fields that zoom the page on focus",
    overflow: "Elements past the screen edge",
    targets: "Controls under the touch minimum",
    text: "Text under the legible size",
} as const;

export const reportWritten = function reportWritten(path: string, routes: number): string {
    return `viewport: wrote ${path} (${String(routes)} routes)\n`;
};

export const summaryLine = function summaryLine(failing: number, routes: number): string {
    return failing === 0
        ? `viewport: ${String(routes)} routes, none with a finding\n`
        : `viewport: ${String(failing)} of ${String(routes)} routes have a finding\n`;
};

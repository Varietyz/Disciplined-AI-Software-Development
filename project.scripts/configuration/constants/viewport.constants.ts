export const PAGE_EXTENSION = ".html";

export const MISSING_PAGE = "404.html";

export const HOME_PAGE = "index.html";

export const HOME_ROUTE = "/";

export const HOME_SHOT = "home";

export const SHOT_EXTENSION = ".png";

export const REPORT_FILE = "viewport.report.json";

export const ROUTE_SEPARATOR = "/";

export const SHOT_SEPARATOR = "-";

export const MEDIA_TYPES: ReadonlyMap<string, string> = new Map([
    [".css", "text/css"],
    [".html", "text/html; charset=utf-8"],
    [".js", "text/javascript"],
    [".json", "application/json"],
    [".md", "text/markdown"],
    [".png", "image/png"],
    [".svg", "image/svg+xml"],
    [".webp", "image/webp"],
    [".woff2", "font/woff2"],
]);

export const FALLBACK_MEDIA_TYPE = "application/octet-stream";

import { jsonPathOf } from "#core/resolvers/route.resolver";

const INDEX_FILE = "index.html";
const HTML_EXTENSION = ".html";
const JSON_EXTENSION = ".json";
const SLASH = "/";

export const fileForPath = function fileForPath(path: string): string {
    return path === SLASH ? INDEX_FILE : path.slice(1) + HTML_EXTENSION;
};

export const jsonFileOf = function jsonFileOf(page: string, tab: string | null): string {
    return jsonPathOf(page, tab).slice(1) + JSON_EXTENSION;
};

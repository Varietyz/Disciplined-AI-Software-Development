import { JSON_ROUTE, MARKDOWN_EXTENSION } from "#configuration/constants/site.constants";
import type { PayloadAddress } from "#types/payload.types";

const JSON_EXTENSION = ".json";
const QUERY_MARK = "?";
const SLASH = "/";
const HOME_STEM = "/index";

export const pathOf = function pathOf(url: string): string {
    return url.split(QUERY_MARK)[0] ?? "";
};

export const pageIdOf = function pageIdOf(url: string): PayloadAddress | null {
    const path = pathOf(url);
    if (!path.startsWith(JSON_ROUTE)) {
        return null;
    }
    const tail = path.slice(JSON_ROUTE.length);
    const stem = tail.endsWith(JSON_EXTENSION) ? tail.slice(0, -JSON_EXTENSION.length) : tail;
    const parts = stem.split(SLASH);
    const tab = parts.at(1);
    return { page: parts.at(0) ?? "", tab: tab === undefined || tab.length === 0 ? null : tab };
};

export const markdownRouteOf = function markdownRouteOf(url: string): string | null {
    const path = pathOf(url);
    if (!path.endsWith(MARKDOWN_EXTENSION)) {
        return null;
    }
    const stem = path.slice(0, -MARKDOWN_EXTENSION.length);
    return stem === HOME_STEM ? SLASH : stem;
};

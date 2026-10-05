import type { Discovery } from "#types/site.types";
import { RESERVED_SEGMENTS } from "#configuration/constants/catalog.constants";
import { reservedPageId } from "#configuration/strings/catalog.strings";

export const guardPages = function guardPages(discovery: Discovery): void {
    for (const page of discovery.pages) {
        if (RESERVED_SEGMENTS.has(page.id)) {
            throw new Error(reservedPageId(page.id));
        }
    }
};

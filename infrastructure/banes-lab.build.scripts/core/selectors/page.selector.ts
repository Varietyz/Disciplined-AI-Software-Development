import type { PageDefinition, PageRegistry } from "#types/page.types";
import { unregisteredPage } from "#configuration/strings/page.strings";

export const definitionOf = function definitionOf(
    loaded: { readonly registry: Pick<PageRegistry, "loadedPage"> },
    page: string,
): PageDefinition {
    const definition = loaded.registry.loadedPage(page);
    if (definition === undefined) {
        throw new Error(unregisteredPage(page));
    }
    return definition;
};

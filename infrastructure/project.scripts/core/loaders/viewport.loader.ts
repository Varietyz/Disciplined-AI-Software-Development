import { existsSync, readdirSync } from "node:fs";
import { routeOfPage } from "#core/converters/viewport.converter";

export const builtRoutes = function builtRoutes(root: string): readonly string[] {
    if (!existsSync(root)) {
        return [];
    }
    return readdirSync(root, { recursive: true })
        .map((entry) => routeOfPage(String(entry)))
        .filter((route): route is string => route !== null)
        .toSorted((left, right) => left.localeCompare(right));
};

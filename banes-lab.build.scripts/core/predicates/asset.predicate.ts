import {
    ASSET_KEYS,
    SERVED_EXTENSIONS,
    SERVED_ROOT_FILES,
    SERVED_ROUTES,
} from "#configuration/constants/asset.constants";
import { extensionOf, toPosix } from "#core/resolvers/asset.resolver";
import { absolutePath } from "@ssot/paths";
import { relative } from "node:path";

const SLASH = "/";

const ASSET_ROUTES: readonly string[] = ASSET_KEYS.map(
    (key) => toPosix(relative(absolutePath("app.public"), absolutePath(key))) + SLASH,
);

export const isServed = function isServed(file: string): boolean {
    return (
        SERVED_ROOT_FILES.has(file) ||
        SERVED_EXTENSIONS.has(extensionOf(file)) ||
        SERVED_ROUTES.some((route) => file.startsWith(route)) ||
        ASSET_ROUTES.some((route) => file.startsWith(route))
    );
};

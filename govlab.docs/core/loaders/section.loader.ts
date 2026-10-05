import type { ManifestPlugin } from "#types/manifest.types";
import { absolutePath } from "@ssot/paths";
import { extensionDirs } from "#core/loaders/registry.loader";
import { isRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { loadExports } from "#core/loaders/plugin.loader";

const EXPORT_KEY = "plugin";
const EXTENSION_PLUGINS_DIR = "manifest-plugins";

const isManifestPlugin = function isManifestPlugin(value: unknown): value is ManifestPlugin {
    return isRecord(value) && typeof value["name"] === "string";
};

const byName = function byName(left: ManifestPlugin, right: ManifestPlugin): number {
    return left.name.localeCompare(right.name);
};

export const loadPlugins = async function loadPlugins(): Promise<ManifestPlugin[]> {
    const plugins = await loadExports(absolutePath("govlab.docs.plugins"), EXPORT_KEY, isManifestPlugin);
    return plugins.toSorted(byName);
};

export const loadUserManifestPlugins = async function loadUserManifestPlugins(
    root: string,
    options: { allowGlobal?: boolean } = {},
): Promise<ManifestPlugin[]> {
    const perExtension = await Promise.all(
        extensionDirs(root, options.allowGlobal ?? false).map(async (dir) =>
            loadExports(join(dir, EXTENSION_PLUGINS_DIR), EXPORT_KEY, isManifestPlugin),
        ),
    );
    return perExtension.flat().toSorted(byName);
};

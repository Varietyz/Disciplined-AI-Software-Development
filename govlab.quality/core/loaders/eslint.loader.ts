import type { InstalledPlugin, LoadedPlugin } from "#types/eslint.types";
import { corePluginsMissing } from "#configuration/strings/plugin.strings";
import { isCorePlugin } from "#core/predicates/eslint.predicate";
import { isModuleMissing } from "#core/predicates/failure.predicate";
import { isRecord } from "#core/selectors/record.selector";
import { loadInstallRegistry } from "#core/loaders/dependency.loader";

const ESLINT_EMITTER = "eslint";

const unwrap = (mod: unknown): unknown => (isRecord(mod) ? (mod["default"] ?? mod) : mod);

export const loadModule = async (npm: string): Promise<unknown> => {
    try {
        return unwrap(await import(npm));
    } catch (error) {
        if (isModuleMissing(error)) {
            return null;
        }
        throw error;
    }
};

export const resolveGlobals = async (
    env: string[],
    custom?: Record<string, string>,
): Promise<Record<string, string>> => {
    const loaded = unwrap(await import("globals"));
    const table = isRecord(loaded) ? loaded : {};
    const merged: Record<string, string> = {};
    for (const name of env) {
        const entry = table[name];
        if (isRecord(entry)) {
            Object.assign(merged, entry);
        }
    }
    return { ...merged, ...custom };
};

export const assertCorePluginsLoaded = (loaded: readonly LoadedPlugin[]): void => {
    const missing = loaded.filter((entry) => entry.plugin === null && isCorePlugin(String(entry.record.npm)));
    if (missing.length > 0) {
        const names = missing.map((entry) => String(entry.record.npm)).join(", ");
        throw new Error(corePluginsMissing(names));
    }
};

export const installedEslintPlugins = async (): Promise<InstalledPlugin[]> => {
    const candidates = loadInstallRegistry().records.filter(
        (record) => record.emitter === ESLINT_EMITTER && record.isPlugin && Boolean(record.npm),
    );
    const loaded = await Promise.all(
        candidates.map(async (record) => ({ plugin: await loadModule(record.npm ?? ""), record })),
    );
    assertCorePluginsLoaded(loaded);
    return loaded.filter((entry): entry is InstalledPlugin => entry.plugin !== null);
};

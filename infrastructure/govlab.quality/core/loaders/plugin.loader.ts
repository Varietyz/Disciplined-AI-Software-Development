import { type Dirent, promises as fs } from "node:fs";
import {
    namespaceWithoutPlugin,
    pluginFolderUnreadable,
    pluginLoadFailed,
    pluginShape,
    pluginWithoutDefault,
    reservedNamespace,
} from "#configuration/strings/plugin.strings";
import { SOURCE_EXTENSIONS } from "#configuration/constants/specifier.constants";
import { homedir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { relativePath } from "@ssot/paths";

interface EslintPluginEntry {
    file: string;
    tool: "eslint";
    plugins: Record<string, unknown>;
}

interface StylelintPluginEntry {
    file: string;
    tool: "stylelint";
    plugins: unknown[];
}

type PluginEntry = EslintPluginEntry | StylelintPluginEntry;

const PLUGIN_DIR = relativePath("govlabHost.plugins");
const MISSING_CODE = "ENOENT";

const isObject = function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
};

const isSource = function isSource(name: string): boolean {
    return SOURCE_EXTENSIONS.some((suffix) => name.endsWith(suffix));
};

const readEntries = async function readEntries(dir: string): Promise<Dirent[]> {
    try {
        return await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
        if (isObject(error) && error["code"] === MISSING_CODE) {
            return [];
        }
        throw new Error(pluginFolderUnreadable(dir), { cause: error });
    }
};

const readSourceFiles = async function readSourceFiles(dir: string): Promise<string[]> {
    const entries = await readEntries(dir);
    return entries
        .filter((entry) => entry.isFile() && isSource(entry.name))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));
};

const pluginFolders = function pluginFolders(consumerRoot: string, allowGlobal: boolean): string[] {
    const folders = [path.join(consumerRoot, PLUGIN_DIR)];
    if (allowGlobal) {
        folders.push(path.join(homedir(), PLUGIN_DIR));
    }
    return folders;
};

const importPluginFile = async function importPluginFile(file: string): Promise<unknown> {
    try {
        const mod: unknown = await import(pathToFileURL(file).href);
        return mod;
    } catch (error) {
        throw new Error(pluginLoadFailed(file), { cause: error });
    }
};

const loadEntry = async function loadEntry(file: string): Promise<PluginEntry> {
    const mod = await importPluginFile(file);
    const entry = isObject(mod) ? mod["default"] : null;
    if (!isObject(entry)) {
        throw new Error(pluginWithoutDefault(file));
    }
    if (entry["tool"] === "eslint" && isObject(entry["plugins"])) {
        return { file, plugins: entry["plugins"], tool: "eslint" };
    }
    const declared = entry["plugins"];
    if (entry["tool"] === "stylelint" && Array.isArray(declared)) {
        return { file, plugins: declared.map((plugin: unknown) => plugin), tool: "stylelint" };
    }
    throw new Error(pluginShape(file));
};

const loadDir = async function loadDir(dir: string): Promise<PluginEntry[]> {
    const names = await readSourceFiles(dir);
    return Promise.all(names.map(async (name) => loadEntry(path.join(dir, name))));
};

const mergePluginInto = function mergePluginInto(
    target: Record<string, unknown>,
    incoming: Record<string, unknown>,
): Record<string, unknown> {
    const merged: Record<string, unknown> = { ...target };
    for (const [key, value] of Object.entries(incoming)) {
        const existing = merged[key];
        merged[key] = isObject(existing) && isObject(value) ? { ...existing, ...value } : value;
    }
    return merged;
};

const claimEslint = function claimEslint(
    eslint: Record<string, unknown>,
    entry: EslintPluginEntry,
    reserved: Set<string>,
): void {
    for (const [namespace, plugin] of Object.entries(entry.plugins)) {
        if (reserved.has(namespace)) {
            throw new Error(reservedNamespace(entry.file, namespace));
        }
        if (!isObject(plugin)) {
            throw new Error(namespaceWithoutPlugin(entry.file, namespace));
        }
        const existing = isObject(eslint[namespace]) ? eslint[namespace] : {};
        eslint[namespace] = mergePluginInto(existing, plugin);
    }
};

const partitionPlugins = function partitionPlugins(
    entries: PluginEntry[],
    reserved: Set<string>,
): { eslint: Record<string, unknown>; stylelint: unknown[] } {
    const eslint: Record<string, unknown> = {};
    const stylelint: unknown[] = [];
    for (const entry of entries) {
        if (entry.tool === "eslint") {
            claimEslint(eslint, entry, reserved);
        } else {
            stylelint.push(...entry.plugins);
        }
    }
    return { eslint, stylelint };
};

export const loadUserPlugins = async function loadUserPlugins(
    consumerRoot: string,
    options: { allowGlobal?: boolean; reservedNamespaces?: Set<string> } = {},
): Promise<{ eslint: Record<string, unknown>; stylelint: unknown[] }> {
    const reserved = options.reservedNamespaces ?? new Set<string>();
    const folders = pluginFolders(consumerRoot, options.allowGlobal ?? false);
    const entries = (await Promise.all(folders.map(async (dir) => loadDir(dir)))).flat();
    return partitionPlugins(entries, reserved);
};

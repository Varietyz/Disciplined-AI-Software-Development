import "#core/schemas/config.schema";
import "#core/schemas/eslint.schema";
import "#core/schemas/tool.schema";
import { basename, dirname, resolve } from "node:path";
import type { GovlabConfig } from "#types/config.types";
import { configInvalid } from "#configuration/strings/quality.strings";
import { createJiti } from "jiti";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { relativePath } from "@ssot/paths";
import { validateConfig } from "#core/registries/section.registry";

const CONFIG_BASENAMES = [
    relativePath("govlabHost.config"),
    "govlab.config.mts",
    "govlab.config.cts",
    "govlab.config.js",
    "govlab.config.mjs",
];

const CONFIG_DIRS = [".", "config", relativePath("govlabHost.root")];
const DEPENDENCY_FOLDER = "node_modules";
const EXTENDS_KEY = "extends";

const CONFIG_CACHE = new Map<string, Promise<GovlabConfig>>();

const isObject = function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
};

const deepMerge = function deepMerge(
    base: Record<string, unknown>,
    override: Record<string, unknown>,
): Record<string, unknown> {
    const out: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
        const prev = out[key];
        out[key] = isObject(prev) && isObject(value) ? deepMerge(prev, value) : value;
    }
    return out;
};

const withoutExtends = function withoutExtends(config: GovlabConfig): Record<string, unknown> {
    return Object.fromEntries(Object.entries(config).filter(([key]) => key !== EXTENDS_KEY));
};

const mergeExtends = function mergeExtends(config: GovlabConfig): GovlabConfig {
    const bases = Array.isArray(config.extends) ? config.extends : [];
    if (bases.length === 0) {
        return config;
    }
    let merged: Record<string, unknown> = {};
    for (const base of bases) {
        merged = deepMerge(merged, mergeExtends(base));
    }
    return deepMerge(merged, withoutExtends(config));
};

export const resolveConfigInDir = function resolveConfigInDir(dir: string): string | null {
    for (const sub of CONFIG_DIRS) {
        for (const base of CONFIG_BASENAMES) {
            const file = resolve(dir, sub, base);
            if (existsSync(file)) {
                return file;
            }
        }
    }
    return null;
};

const firstExistingConfig = function firstExistingConfig(root: string): string | null {
    let dir = resolve(root);
    for (;;) {
        if (basename(dir) !== DEPENDENCY_FOLDER) {
            const hit = resolveConfigInDir(dir);
            if (hit !== null) {
                return hit;
            }
        }
        const parent = dirname(dir);
        if (parent === dir) {
            return null;
        }
        dir = parent;
    }
};

const importConfig = async function importConfig(file: string): Promise<GovlabConfig> {
    const jiti = createJiti(pathToFileURL(file).href, { fsCache: false });
    const loaded = await jiti.import(file, { default: true });
    return isObject(loaded) ? loaded : {};
};

const readConfig = async function readConfig(file: string): Promise<GovlabConfig> {
    const merged = mergeExtends(await importConfig(file));
    const errors = validateConfig(merged);
    if (errors.length > 0) {
        throw new Error(configInvalid(file, errors.join(", ")));
    }
    return merged;
};

export const loadGovlabConfig = async function loadGovlabConfig(root: string): Promise<GovlabConfig> {
    const file = firstExistingConfig(root);
    if (file === null) {
        return {};
    }
    const cached = CONFIG_CACHE.get(file);
    if (cached !== undefined) {
        return cached;
    }
    const pending = readConfig(file);
    CONFIG_CACHE.set(file, pending);
    return pending;
};

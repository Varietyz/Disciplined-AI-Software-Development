import { absolutePath } from "@ssot/paths";
import { definedRepresentations } from "#core/registries/representation.registry";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { readdirSync } from "node:fs";

const PLUGIN_SUFFIXES: readonly string[] = [".ts", ".tsx", ".mts", ".cts"];

export const loadPlugins = async function loadPlugins(dir: string): Promise<string[]> {
    const before = new Set(definedRepresentations());
    const files = readdirSync(dir)
        .filter((name) => PLUGIN_SUFFIXES.some((suffix) => name.endsWith(suffix)))
        .toSorted((a, b) => a.localeCompare(b));
    await Promise.all(
        files.map(async (name): Promise<void> => {
            await import(pathToFileURL(join(dir, name)).href);
        }),
    );
    return definedRepresentations().filter((name) => !before.has(name));
};

export const BUILTIN_REPRESENTATIONS: readonly string[] = await loadPlugins(absolutePath("govlab.patterns.plugins"));

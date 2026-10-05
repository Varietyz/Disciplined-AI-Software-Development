import { ESLINT_EMITTER, NO_EMITTER } from "#configuration/constants/emitter.constants";
import type { InstallPlan } from "#types/dependency.types";
import { loadInstallRegistry } from "#core/loaders/dependency.loader";

const sortedUnique = function sortedUnique(values: readonly string[]): string[] {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
};

export const computePlan = function computePlan(ecosystems: string[]): InstallPlan {
    const records = loadInstallRegistry().records.filter((record) => ecosystems.includes(record.ecosystem));
    const npmDeps = records.flatMap((record) =>
        typeof record.npm === "string" && record.npm.length > 0 ? [record.npm] : [],
    );
    const systemInstructions = records.flatMap((record) =>
        typeof record.system === "string" && record.system.length > 0
            ? [{ system: record.system, tool: record.tool }]
            : [],
    );
    const eslintPlugins = records.flatMap((record) =>
        record.isPlugin && typeof record.pluginNamespace === "string" && record.emitter === ESLINT_EMITTER
            ? [record.pluginNamespace]
            : [],
    );
    const emitters = records.map((record) => record.emitter).filter((emitter) => emitter !== NO_EMITTER);
    return {
        ecosystems,
        emitters: sortedUnique(emitters),
        eslintPlugins: sortedUnique(eslintPlugins),
        npmDeps: sortedUnique(npmDeps),
        systemInstructions,
    };
};

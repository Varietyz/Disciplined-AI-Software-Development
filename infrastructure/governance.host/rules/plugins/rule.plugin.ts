import { LOCAL_RULES, PLUGIN_MODULES } from "../../shared/generated/rule-index.generated.ts";
import { isGovernedFile } from "../../shared/resolvers/anchor.resolver.ts";

interface RuleModule {
    meta: unknown;
    create: (context: unknown) => Record<string, unknown>;
}

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const isRuleModule = function isRuleModule(value: unknown): value is RuleModule {
    return isRecord(value) && "meta" in value && typeof value["create"] === "function";
};

const filenameOf = function filenameOf(context: unknown): string {
    if (!isRecord(context)) {
        return "";
    }
    const declared = context["filename"];
    if (typeof declared === "string") {
        return declared;
    }
    const accessor = context["getFilename"];
    return typeof accessor === "function" ? String(accessor.call(context)) : "";
};

const scopeToProject = function scopeToProject(rule: RuleModule): RuleModule {
    return {
        create(context: unknown) {
            return isGovernedFile(filenameOf(context)) ? rule.create(context) : {};
        },
        meta: rule.meta,
    };
};

const isWorkspaceWide = function isWorkspaceWide(rule: RuleModule): boolean {
    const { meta } = rule;
    if (!isRecord(meta)) {
        return false;
    }
    const { docs } = meta;
    return isRecord(docs) && docs["workspaceWide"] === true;
};

const scoped: Record<string, RuleModule> = {};
for (const [name, rule] of Object.entries(LOCAL_RULES)) {
    if (isRuleModule(rule)) {
        scoped[name] = isWorkspaceWide(rule) ? rule : scopeToProject(rule);
    }
}

const isObject = function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
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

const plugins: Record<string, unknown> = { local: { rules: scoped } };
for (const module of PLUGIN_MODULES) {
    if (!isObject(module) || !isObject(module["plugins"])) {
        continue;
    }
    for (const [namespace, plugin] of Object.entries(module["plugins"])) {
        const existing = isObject(plugins[namespace]) ? plugins[namespace] : {};
        plugins[namespace] = isObject(plugin) ? mergePluginInto(existing, plugin) : plugin;
    }
}

export default { plugins, tool: "eslint" };

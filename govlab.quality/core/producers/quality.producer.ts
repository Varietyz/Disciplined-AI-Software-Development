import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { isRecord, recordAt, stringField } from "#core/selectors/record.selector";
import { PROJECT_TOOL } from "#configuration/constants/validation.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import contextPlugin from "#core/plugins/context.plugin";
import { defineProducer } from "#core/registries/producer.registry";
import eslintPlugin from "#core/plugins/eslint.plugin";
import { loadValidators } from "#core/coordinators/validation.coordinator";
import { meta as stylelintMeta } from "#core/plugins/stylelint.plugin";

const ESLINT_PLUGINS = [
    { plugin: eslintPlugin, tool: "govlab-eslint" },
    { plugin: contextPlugin, tool: "govlab-context" },
];

const orNull = function orNull(value: string): string | null {
    return value === "" ? null : value;
};

const pluginRules = function pluginRules(plugin: unknown, tool: string): CatalogRule[] {
    const rules = isRecord(plugin) ? recordAt(plugin, "rules") : {};
    return Object.entries(rules).map(([name, rule]): CatalogRule => {
        const meta = isRecord(rule) ? recordAt(rule, "meta") : {};
        const docs = recordAt(meta, "docs");
        const { canonical } = docs;
        return {
            canonical: Array.isArray(canonical) && canonical.length > 0 ? canonical : null,
            category: orNull(stringField(docs, "category")) ?? orNull(stringField(meta, "type")) ?? "govlab",
            deprecated: meta["deprecated"] === true,
            description: orNull(stringField(docs, "description")),
            ecosystem: "javascript",
            fixable: orNull(stringField(meta, "fixable")),
            name,
            recommended: true,
            ruleId: name,
            tool,
            url: orNull(stringField(docs, "url")),
        };
    });
};

const eslintProduct = function eslintProduct(): CatalogProduct {
    const rules = ESLINT_PLUGINS.flatMap(({ plugin, tool }) => pluginRules(plugin, tool)).toSorted((a, b) => {
        const left = `${String(a["tool"])}${a.ruleId}`;
        const right = `${String(b["tool"])}${b.ruleId}`;
        return left === right ? 0 : (left < right ? -1 : 1);
    });
    const byTool: Record<string, number> = {};
    for (const rule of rules) {
        const tool = String(rule["tool"]);
        byTool[tool] = (byTool[tool] ?? 0) + 1;
    }
    return { rules, source: "govlab", summary: { byTool, tool: "govlab-eslint", total: rules.length } };
};

const stylelintProduct = function stylelintProduct(): CatalogProduct {
    const rules = stylelintMeta
        .map((entry): CatalogRule => ({
            canonical: entry.meta.canonical.length > 0 ? entry.meta.canonical : null,
            category: "govlab",
            deprecated: false,
            description: orNull(entry.meta.description),
            ecosystem: "css",
            fixable: null,
            name: entry.ruleName,
            recommended: true,
            ruleId: entry.ruleName,
            tool: "govlab-stylelint",
            url: orNull(entry.meta.url ?? ""),
        }))
        .toSorted(byRuleId);
    return { rules, source: "govlab-stylelint", summary: { tool: "govlab-stylelint", total: rules.length } };
};

const nativeProduct = async function nativeProduct(): Promise<CatalogProduct> {
    const rules = (await loadValidators())
        .map((validator): CatalogRule => ({
            canonical: validator.meta.canonical.length > 0 ? [...validator.meta.canonical] : null,
            category: "cross-file",
            deprecated: false,
            description: validator.meta.description,
            ecosystem: "typescript",
            fixable: false,
            name: validator.id,
            recommended: true,
            ruleId: validator.id,
            tool: PROJECT_TOOL,
            url: null,
        }))
        .toSorted(byRuleId);
    return { rules, source: PROJECT_TOOL, summary: { tool: PROJECT_TOOL, total: rules.length } };
};

defineProducer({
    name: "quality",
    produce: async () => [eslintProduct(), stylelintProduct(), await nativeProduct()],
    refresh: "build",
});

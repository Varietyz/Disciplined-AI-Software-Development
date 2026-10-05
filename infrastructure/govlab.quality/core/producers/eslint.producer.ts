import type { CatalogProduct, CatalogRule, KnobEntry } from "#types/catalog.types";
import { isRecord, recordAt, stringField } from "#core/selectors/record.selector";
import { INTEGER_TYPE } from "#configuration/constants/knob.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";

const BUILTIN_RULES_MODULE = "eslint/use-at-your-own-risk";
const ESLINT_MANIFEST = "eslint/package.json";
const UNKNOWN = "unknown";

const manifestVersion = async function manifestVersion(specifier: string): Promise<string> {
    const loaded: unknown = await import(specifier, { with: { type: "json" } });
    const manifest = isRecord(loaded) && isRecord(loaded["default"]) ? loaded["default"] : {};
    return stringField(manifest, "version", UNKNOWN);
};

const PLUGINS = [
    { ecosystem: "json", pkg: "eslint-plugin-jsonc", prefix: "jsonc" },
    { ecosystem: "javascript", pkg: "eslint-plugin-unused-imports", prefix: "unused-imports" },
    { ecosystem: "html", pkg: "eslint-plugin-html", prefix: "html" },
];

const orNull = function orNull(value: string): string | null {
    return value === "" ? null : value;
};

const isRuleMap = function isRuleMap(value: unknown): value is Map<string, unknown> {
    return value instanceof Map;
};

const builtinRules = async function builtinRules(): Promise<Map<string, unknown>> {
    const loaded: unknown = await import(BUILTIN_RULES_MODULE);
    const rules = isRecord(loaded) ? loaded["builtinRules"] : null;
    return isRuleMap(rules) ? rules : new Map();
};

const metaOf = function metaOf(rule: unknown): Record<string, unknown> {
    return isRecord(rule) ? recordAt(rule, "meta") : {};
};

const replacedByOf = function replacedByOf(meta: Record<string, unknown>): unknown {
    const { deprecated } = meta;
    const replaced = isRecord(deprecated) ? deprecated["replacedBy"] : undefined;
    return replaced ?? meta["replacedBy"] ?? null;
};

const builtinRow = function builtinRow(ruleId: string, rule: unknown, eslintVersion: string): CatalogRule {
    const meta = metaOf(rule);
    const docs = recordAt(meta, "docs");
    const deprecated = Boolean(meta["deprecated"]);
    const type = orNull(stringField(meta, "type"));
    return {
        canonical: null,
        category: deprecated ? "deprecated" : (type ?? "uncategorized"),
        deprecated,
        description: orNull(stringField(docs, "description")),
        ecosystem: "javascript",
        fixable: orNull(stringField(meta, "fixable")),
        hasSuggestions: Boolean(meta["hasSuggestions"]),
        name: ruleId,
        recommended: Boolean(docs["recommended"]),
        replacedBy: replacedByOf(meta),
        ruleId,
        tool: "eslint",
        toolVersion: eslintVersion,
        type,
        url: orNull(stringField(docs, "url")),
    };
};

const count = function count(rules: readonly CatalogRule[], key: string): number {
    return rules.filter((rule) => Boolean(rule[key])).length;
};

const builtinProduct = async function builtinProduct(rules: Map<string, unknown>): Promise<CatalogProduct> {
    const eslintVersion = await manifestVersion(ESLINT_MANIFEST);
    const rows = [...rules].map(([ruleId, rule]) => builtinRow(ruleId, rule, eslintVersion)).toSorted(byRuleId);
    const byType: Record<string, number> = {};
    for (const row of rows) {
        const key = typeof row["type"] === "string" ? row["type"] : "none";
        byType[key] = (byType[key] ?? 0) + 1;
    }
    return {
        rules: rows,
        source: "eslint",
        summary: {
            byType,
            deprecated: count(rows, "deprecated"),
            fixable: rows.filter((row) => row["fixable"] !== null).length,
            hasSuggestions: count(rows, "hasSuggestions"),
            recommended: count(rows, "recommended"),
            tool: "eslint",
            toolVersion: eslintVersion,
            total: rows.length,
        },
    };
};

const loadPlugin = async function loadPlugin(pkg: string): Promise<{ plugin: unknown; version: string }> {
    const loaded: unknown = await import(pkg);
    const plugin = isRecord(loaded) && isRecord(loaded["default"]) ? loaded["default"] : loaded;
    return { plugin, version: await manifestVersion(`${pkg}/package.json`) };
};

const pluginProduct = async function pluginProduct(): Promise<CatalogProduct> {
    const loaded = await Promise.all(PLUGINS.map(async (entry) => ({ ...entry, ...(await loadPlugin(entry.pkg)) })));
    const rows = loaded.flatMap(({ ecosystem, plugin, prefix, version }) =>
        Object.entries(isRecord(plugin) ? recordAt(plugin, "rules") : {}).map(([name, rule]): CatalogRule => {
            const meta = metaOf(rule);
            const docs = recordAt(meta, "docs");
            return {
                canonical: null,
                category: orNull(stringField(docs, "category")) ?? orNull(stringField(meta, "type")) ?? "plugin",
                deprecated: meta["deprecated"] === true,
                description: orNull(stringField(docs, "description")),
                ecosystem,
                fixable: orNull(stringField(meta, "fixable")),
                name,
                ruleId: `${prefix}/${name}`,
                tool: prefix,
                toolVersion: version,
                url: orNull(stringField(docs, "url")),
            };
        }),
    );
    const plugins = loaded
        .map(({ pkg, prefix }) => ({ count: rows.filter((row) => row["tool"] === prefix).length, pkg, prefix }))
        .filter((entry) => entry.count > 0);
    return {
        rules: rows.toSorted(byRuleId),
        source: "eslint-plugins",
        summary: { plugins, tool: "eslint-plugins", total: rows.length },
    };
};

const integerKnob = function integerKnob(schema: unknown): string | null {
    const stack: unknown[] = [schema];
    while (stack.length > 0) {
        const node = stack.pop();
        if (Array.isArray(node)) {
            stack.push(...node.map((item: unknown) => item));
            continue;
        }
        const properties = isRecord(node) ? recordAt(node, "properties") : {};
        const knob = Object.entries(properties).find(
            ([, spec]) => isRecord(spec) && spec["type"] === INTEGER_TYPE,
        )?.[0];
        if (knob !== undefined) {
            return knob;
        }
        if (isRecord(node)) {
            stack.push(...Object.values(node));
        }
    }
    return null;
};

defineProducer({
    knobs: async (): Promise<KnobEntry[]> =>
        [...(await builtinRules())].flatMap(([ruleId, rule]): KnobEntry[] => {
            const knob = integerKnob(metaOf(rule)["schema"]);
            return knob === null
                ? []
                : [["eslint", ruleId, { default: null, knob, threshold: true, type: INTEGER_TYPE }]];
        }),
    name: "eslint",
    produce: async () => [await builtinProduct(await builtinRules()), await pluginProduct()],
    refresh: "manual",
});

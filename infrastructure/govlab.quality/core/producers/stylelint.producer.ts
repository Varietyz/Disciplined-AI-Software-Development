import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { isRecord, recordAt, stringField } from "#core/selectors/record.selector";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";

const STYLELINT_MODULE = "stylelint";
const STYLELINT_MANIFEST = "stylelint/package.json";
const RULE_DOCS = "https://stylelint.io/user-guide/rules";
const AVOID_CATEGORY = "avoid";
const OTHER_CATEGORY = "other";

const PREFIX_CATEGORY: readonly [string, string][] = [
    ["color-", "color"],
    ["font-", "font"],
    ["selector-", "selector"],
    ["declaration-", "declaration"],
    ["function-", "function"],
    ["at-rule-", "at-rule"],
    ["media-", "media"],
    ["value-", "value"],
    ["unit-", "value"],
    ["length-", "value"],
];

const rulesOf = function rulesOf(loaded: unknown): Record<string, unknown> {
    if (!isRecord(loaded)) {
        return {};
    }
    const fallback = loaded["default"];
    return isRecord(fallback) && isRecord(fallback["rules"]) ? fallback["rules"] : recordAt(loaded, "rules");
};

const categoryOf = function categoryOf(name: string): string {
    if (name.startsWith("no-") || name.includes("-no-")) {
        return AVOID_CATEGORY;
    }
    return PREFIX_CATEGORY.find(([prefix]) => name.startsWith(prefix))?.[1] ?? OTHER_CATEGORY;
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const manifest: unknown = await import(STYLELINT_MANIFEST, { with: { type: "json" } });
    const version =
        isRecord(manifest) && isRecord(manifest["default"])
            ? stringField(manifest["default"], "version", "unknown")
            : "unknown";
    const rules = Object.keys(rulesOf(await import(STYLELINT_MODULE)))
        .map((name): CatalogRule => ({
            canonical: null,
            category: categoryOf(name),
            description: null,
            ecosystem: "css",
            name,
            ruleId: name,
            tool: "stylelint",
            toolVersion: version,
            url: `${RULE_DOCS}/${name}`,
        }))
        .toSorted(byRuleId);
    const byCategory: Record<string, number> = {};
    for (const rule of rules) {
        const category = String(rule["category"]);
        byCategory[category] = (byCategory[category] ?? 0) + 1;
    }
    return [
        {
            rules,
            source: "stylelint",
            summary: { byCategory, tool: "stylelint", toolVersion: version, total: rules.length },
        },
    ];
};

defineProducer({ name: "stylelint", produce, refresh: "manual" });

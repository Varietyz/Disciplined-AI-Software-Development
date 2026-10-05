import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { getSupportInfo, version } from "prettier";
import { isRecord, stringField } from "#core/selectors/record.selector";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";

const TOOL = "prettier";
const DOCS = "https://prettier.io/docs/options";

const orNull = function orNull(value: string): string | null {
    return value === "" ? null : value;
};

const ruleOf = function ruleOf(option: Record<string, unknown>): CatalogRule {
    const { choices } = option;
    const fallback = option["default"];
    const name = stringField(option, "name");
    return {
        canonical: null,
        category: orNull(stringField(option, "category")) ?? "option",
        choices: Array.isArray(choices)
            ? choices.map((choice: unknown) => (isRecord(choice) ? choice["value"] : null))
            : null,
        default: fallback === undefined ? null : fallback,
        description: orNull(stringField(option, "description")),
        ecosystem: "javascript",
        kind: "format-option",
        name,
        ruleId: name,
        tool: TOOL,
        toolVersion: version,
        type: orNull(stringField(option, "type")),
        url: DOCS,
    };
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const info = await getSupportInfo();
    const options: unknown[] = info.options;
    const rules = options.filter(isRecord).map(ruleOf).toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: version, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

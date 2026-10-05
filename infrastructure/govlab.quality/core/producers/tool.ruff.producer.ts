import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { isRecord, stringField } from "#core/selectors/record.selector";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const TOOL = "ruff";
const DOCS = "https://docs.astral.sh/ruff/rules";
const NOT_AVAILABLE = "not available";

const orNull = function orNull(value: string): string | null {
    return value === "" ? null : value;
};

const ruleOf = function ruleOf(entry: Record<string, unknown>, version: string): CatalogRule {
    const name = orNull(stringField(entry, "name"));
    const fix = stringField(entry, "fix");
    return {
        canonical: null,
        category: orNull(stringField(entry, "linter")),
        description: orNull(stringField(entry, "summary")),
        ecosystem: "python",
        fixable: fix !== "" && !fix.toLowerCase().includes(NOT_AVAILABLE),
        name,
        preview: entry["preview"] === true,
        ruleId: stringField(entry, "code"),
        tool: TOOL,
        toolVersion: version,
        url: name === null ? null : `${DOCS}/${name}`,
    };
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(TOOL, ["--version"]);
    const parsed: unknown = JSON.parse(commandOutput(TOOL, ["rule", "--all", "--output-format", "json"]));
    const rules = (Array.isArray(parsed) ? parsed : [])
        .filter(isRecord)
        .map((entry) => ruleOf(entry, version))
        .toSorted(byRuleId);
    const summary = {
        byCategory: tallyBy(rules, "category"),
        fixable: rules.filter((rule) => rule["fixable"] === true).length,
        preview: rules.filter((rule) => rule["preview"] === true).length,
        tool: TOOL,
        toolVersion: version,
        total: rules.length,
    };
    return [{ rules, source: TOOL, summary }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

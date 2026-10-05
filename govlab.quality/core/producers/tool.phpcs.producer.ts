import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { distinctRules } from "#core/selectors/catalog.selector";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const TOOL = "phpcs";
const STANDARDS = "PEAR,PSR1,PSR2,PSR12,Squiz,Zend,Generic";
const MIN_SEGS = 3;
const SKIP_MARKERS = ["(", "---", "contains"];

const ruleOf = function ruleOf(line: string, version: string): CatalogRule[] {
    const text = line.trim();
    const segs = text.split(".");
    if (text === "" || SKIP_MARKERS.some((marker) => text.includes(marker)) || segs.length < MIN_SEGS) {
        return [];
    }
    return [
        {
            canonical: null,
            category: segs[1],
            description: null,
            ecosystem: "php",
            name: segs.at(-1),
            ruleId: text,
            standard: segs[0] ?? "",
            tool: TOOL,
            toolVersion: version,
            url: null,
        },
    ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(TOOL, ["--version"]);
    const lines = commandOutput(TOOL, ["-e", `--standard=${STANDARDS}`]).split("\n");
    const rules = distinctRules(lines.flatMap((line) => ruleOf(line, version))).toSorted(byRuleId);
    return [
        {
            rules,
            source: TOOL,
            summary: { byStandard: tallyBy(rules, "standard"), tool: TOOL, toolVersion: version, total: rules.length },
        },
    ];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

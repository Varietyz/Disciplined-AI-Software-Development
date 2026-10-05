import type { CatalogProduct, CatalogRule, KnobEntry } from "#types/catalog.types";
import { INTEGER_TYPE } from "#configuration/constants/knob.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { isRecord } from "#core/selectors/record.selector";
import { isThreshold } from "#core/predicates/knob.predicate";
import { parseYaml } from "#core/parsers/config.yaml.parser";
import { remoteText } from "#core/adapters/remote.adapter";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const TOOL = "detekt";
const VERSION = "main";
const SOURCE =
    "https://raw.githubusercontent.com/detekt/detekt/main/detekt-core/src/main/resources/default-detekt-config.yml";
const DOCS = "https://detekt.dev/docs/rules";
const NON_RULESETS: ReadonlySet<string> = new Set(["config", "processors", "console-reports", "output-reports"]);
const UPPER: ReadonlySet<string> = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

const rulesets = async function rulesets(): Promise<[string, Record<string, unknown>][]> {
    const doc = parseYaml((await remoteText(SOURCE)) ?? "");
    return Object.entries(isRecord(doc) ? doc : {}).filter((entry): entry is [string, Record<string, unknown>] =>
        isRecord(entry[1]),
    );
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const rules = (await rulesets())
        .filter(([ruleset]) => !NON_RULESETS.has(ruleset))
        .flatMap(([ruleset, body]) =>
            Object.keys(body)
                .filter((key) => UPPER.has(key[0] ?? ""))
                .map((key): CatalogRule => ({
                    canonical: null,
                    category: ruleset,
                    description: null,
                    ecosystem: "kotlin",
                    name: key,
                    ruleId: `${ruleset}/${key}`,
                    tool: TOOL,
                    toolVersion: VERSION,
                    url: `${DOCS}/${ruleset}`,
                })),
        )
        .toSorted(byRuleId);
    return [
        {
            rules,
            source: TOOL,
            summary: { byRuleset: tallyBy(rules, "category"), tool: TOOL, toolVersion: VERSION, total: rules.length },
        },
    ];
};

const ruleKnob = function ruleKnob(ruleset: string, rule: string, config: Record<string, unknown>): KnobEntry[] {
    const found = Object.entries(config).find(([name, value]) => typeof value === "number" && isThreshold(name));
    return found === undefined
        ? []
        : [[TOOL, `${ruleset}/${rule}`, { default: found[1], knob: found[0], threshold: true, type: INTEGER_TYPE }]];
};

const knobs = async function knobs(): Promise<KnobEntry[]> {
    return (await rulesets()).flatMap(([ruleset, body]) =>
        Object.entries(body).flatMap(([rule, config]) => (isRecord(config) ? ruleKnob(ruleset, rule, config) : [])),
    );
};

defineProducer({ knobs, name: TOOL, produce, refresh: "manual" });

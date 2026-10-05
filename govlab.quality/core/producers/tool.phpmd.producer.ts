import type { CatalogProduct, CatalogRule, KnobEntry } from "#types/catalog.types";
import { INTEGER_TYPE } from "#configuration/constants/knob.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { intAfter } from "#core/parsers/knob.parser";
import { remoteText } from "#core/adapters/remote.adapter";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const TOOL = "phpmd";
const VERSION = "master";
const SOURCE_ROOT = "https://raw.githubusercontent.com/phpmd/phpmd/master/src/main/resources/rulesets";
const DOCS = "https://phpmd.org/rules";
const RULESETS = ["cleancode", "codesize", "controversial", "design", "naming", "unusedcode"];
const RULE_OPEN = '<rule name="';
const RULE_CLOSE = "</rule>";
const DESCRIPTION_OPEN = "<description>";
const DESCRIPTION_CLOSE = "</description>";
const KNOB_PROPERTIES = ["reportLevel", "minimum", "maximum"];
const PROPERTY_WINDOW = 200;

const attr = function attr(tag: string, key: string): string | null {
    const needle = `${key}="`;
    const at = tag.indexOf(needle);
    const end = at === -1 ? -1 : tag.indexOf('"', at + needle.length);
    return end === -1 ? null : tag.slice(at + needle.length, end);
};

const segments = function segments(text: string): string[] {
    const found: string[] = [];
    let at = text.indexOf(RULE_OPEN);
    while (at >= 0) {
        const end = text.indexOf(RULE_CLOSE, at);
        found.push(text.slice(at, end === -1 ? text.length : end));
        at = text.indexOf(RULE_OPEN, at + RULE_OPEN.length);
    }
    return found;
};

const descriptionOf = function descriptionOf(segment: string): string | null {
    const open = segment.indexOf(DESCRIPTION_OPEN);
    const close = open === -1 ? -1 : segment.indexOf(DESCRIPTION_CLOSE, open);
    const text = close === -1 ? "" : segment.slice(open + DESCRIPTION_OPEN.length, close).trim();
    return text === "" ? null : text;
};

const ruleOf = function ruleOf(segment: string, ruleset: string): CatalogRule[] {
    const tag = segment.slice(0, segment.indexOf(">"));
    const name = attr(tag, "name");
    const className = attr(tag, "class");
    return name === null
        ? []
        : [
              {
                  canonical: null,
                  category: ruleset,
                  class: className === "" ? null : className,
                  description: descriptionOf(segment),
                  ecosystem: "php",
                  name,
                  ruleId: name,
                  tool: TOOL,
                  toolVersion: VERSION,
                  url: `${DOCS}/${ruleset}.html#${name.toLowerCase()}`,
              },
          ];
};

const rulesets = async function rulesets(): Promise<[string, string][]> {
    const texts = await Promise.all(RULESETS.map(async (ruleset) => remoteText(`${SOURCE_ROOT}/${ruleset}.xml`)));
    return RULESETS.map((ruleset, index): [string, string] => [ruleset, texts[index] ?? ""]);
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const rules = (await rulesets())
        .flatMap(([ruleset, text]) => segments(text).flatMap((segment) => ruleOf(segment, ruleset)))
        .toSorted(byRuleId);
    return [
        {
            rules,
            source: TOOL,
            summary: { byCategory: tallyBy(rules, "category"), tool: TOOL, toolVersion: VERSION, total: rules.length },
        },
    ];
};

const knobsOf = function knobsOf(segment: string): KnobEntry[] {
    const name = segment.slice(RULE_OPEN.length, segment.indexOf('"', RULE_OPEN.length));
    return KNOB_PROPERTIES.flatMap((property): KnobEntry[] => {
        const at = segment.indexOf(`name="${property}"`);
        const value = at === -1 ? null : intAfter(segment, 'value="', { from: at, window: PROPERTY_WINDOW });
        return value === null
            ? []
            : [[TOOL, name, { default: value, knob: property, threshold: true, type: INTEGER_TYPE }]];
    });
};

const knobs = async function knobs(): Promise<KnobEntry[]> {
    return (await rulesets()).flatMap(([, text]) => segments(text).flatMap(knobsOf));
};

defineProducer({ knobs, name: TOOL, produce, refresh: "manual" });

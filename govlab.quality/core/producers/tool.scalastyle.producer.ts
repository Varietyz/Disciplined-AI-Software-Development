import type { CatalogProduct, CatalogRule, KnobEntry } from "#types/catalog.types";
import { INTEGER_TYPE } from "#configuration/constants/knob.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { distinctRules } from "#core/selectors/catalog.selector";
import { isDigitsOnly } from "#core/parsers/knob.parser";
import { remoteText } from "#core/adapters/remote.adapter";

const TOOL = "scalastyle";
const VERSION = "master";
const SOURCE =
    "https://raw.githubusercontent.com/scalastyle/scalastyle/master/src/main/resources/scalastyle_definition.xml";
const DOCS = "https://www.scalastyle.org/rules-dev.html";
const CHECKER = "<checker";
const CHECKER_CLOSE = "</checker>";
const SEGMENT_WINDOW = 600;

const attr = function attr(text: string, name: string): string | null {
    const key = `${name}="`;
    const at = text.indexOf(key);
    const end = at === -1 ? -1 : text.indexOf('"', at + key.length);
    return end === -1 ? null : text.slice(at + key.length, end);
};

const checkers = function checkers(text: string): { segment: string; tag: string }[] {
    const found: { segment: string; tag: string }[] = [];
    let at = text.indexOf(CHECKER);
    while (at !== -1) {
        const tagEnd = text.indexOf(">", at);
        const close = text.indexOf(CHECKER_CLOSE, at);
        found.push({
            segment: text.slice(at, close === -1 ? at + SEGMENT_WINDOW : close),
            tag: text.slice(at, tagEnd === -1 ? text.length : tagEnd),
        });
        at = text.indexOf(CHECKER, at + CHECKER.length);
    }
    return found;
};

const ruleOf = function ruleOf(tag: string): CatalogRule[] {
    const id = attr(tag, "id");
    const className = attr(tag, "class");
    const level = attr(tag, "defaultLevel");
    return id === null
        ? []
        : [
              {
                  canonical: null,
                  category: "checker",
                  defaultLevel: level === "" ? null : level,
                  description: null,
                  ecosystem: "scala",
                  name: className === null || className === "" ? id : className.slice(className.lastIndexOf(".") + 1),
                  ruleId: id,
                  tool: TOOL,
                  toolVersion: VERSION,
                  url: DOCS,
              },
          ];
};

const source = async function source(): Promise<string> {
    return (await remoteText(SOURCE)) ?? "";
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const rules = distinctRules(checkers(await source()).flatMap(({ tag }) => ruleOf(tag))).toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: VERSION, total: rules.length } }];
};

const knobs = async function knobs(): Promise<KnobEntry[]> {
    return checkers(await source()).flatMap(({ segment, tag }): KnobEntry[] => {
        const id = attr(tag, "id");
        const fallback = (attr(segment, "default") ?? "").trim();
        return id !== null && isDigitsOnly(fallback)
            ? [[TOOL, id, { default: Number(fallback), knob: "value", threshold: true, type: INTEGER_TYPE }]]
            : [];
    });
};

defineProducer({ knobs, name: TOOL, produce, refresh: "manual" });

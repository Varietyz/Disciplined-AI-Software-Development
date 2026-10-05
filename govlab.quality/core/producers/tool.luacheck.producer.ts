import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { distinctRules } from "#core/selectors/catalog.selector";
import { isDigit } from "@govlab/constants";
import { remoteText } from "#core/adapters/remote.adapter";

const TOOL = "luacheck";
const VERSION = "master";
const SOURCE = "https://raw.githubusercontent.com/lunarmodules/luacheck/master/docsrc/warnings.rst";
const DOCS = "https://luacheck.readthedocs.io/en/stable/warnings.html";
const MIN_CODE_DIGITS = 2;
const NAME_MAX = 60;
const NAME_TRUNC = 57;

const ruleOf = function ruleOf(raw: string): CatalogRule[] {
    let end = 0;
    while (end < raw.length && isDigit(raw[end] ?? "")) {
        end += 1;
    }
    const description = raw.slice(end).trim();
    if (end < MIN_CODE_DIGITS || raw[end] !== " " || description === "") {
        return [];
    }
    const code = raw.slice(0, end);
    return [
        {
            canonical: null,
            category: code.startsWith("0") ? "error" : "warning",
            description,
            ecosystem: "lua",
            name: description.length > NAME_MAX ? `${description.slice(0, NAME_TRUNC)}...` : description,
            ruleId: code,
            tool: TOOL,
            toolVersion: VERSION,
            url: DOCS,
        },
    ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const rules = distinctRules(((await remoteText(SOURCE)) ?? "").split("\n").flatMap(ruleOf)).toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: VERSION, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

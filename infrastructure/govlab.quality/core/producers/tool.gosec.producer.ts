import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { distinctRules } from "#core/selectors/catalog.selector";
import { remoteText } from "#core/adapters/remote.adapter";

const TOOL = "gosec";
const VERSION = "repo-master";
const SOURCE = "https://raw.githubusercontent.com/securego/gosec/master/rules/rulelist.go";
const DOCS = "https://securego.io/docs/rules";
const ENTRY_MARKER = '{"G';

const ruleOf = function ruleOf(line: string): CatalogRule[] {
    if (!line.includes(ENTRY_MARKER)) {
        return [];
    }
    const [, id, , desc = ""] = line.split('"');
    if (typeof id !== "string" || !id.startsWith("G")) {
        return [];
    }
    return [
        {
            canonical: null,
            category: "security",
            description: desc === "" ? null : desc,
            ecosystem: "go",
            name: desc === "" ? id : desc,
            ruleId: id,
            tool: TOOL,
            toolVersion: VERSION,
            url: `${DOCS}/${id.toLowerCase()}.html`,
        },
    ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const rules = distinctRules(((await remoteText(SOURCE)) ?? "").split("\n").flatMap(ruleOf)).toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: VERSION, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

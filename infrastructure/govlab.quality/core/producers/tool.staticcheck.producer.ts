import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const TOOL = "staticcheck";
const DOCS = "https://staticcheck.dev/docs/checks/#";
const FAMILY: ReadonlyMap<string, string> = new Map([
    ["QF", "quickfix"],
    ["S", "simplifications"],
    ["SA", "bugs"],
    ["ST", "style"],
    ["U", "unused"],
]);

const isUpperAscii = function isUpperAscii(ch: string | undefined): boolean {
    return typeof ch === "string" && ch >= "A" && ch <= "Z";
};

const prefixOf = function prefixOf(code: string): string {
    let prefix = "";
    for (const ch of code) {
        if (!isUpperAscii(ch)) {
            break;
        }
        prefix += ch;
    }
    return prefix;
};

const ruleOf = function ruleOf(line: string, version: string): CatalogRule[] {
    const text = line.trim();
    const space = text.indexOf(" ");
    const code = space === -1 ? "" : text.slice(0, space);
    if (!isUpperAscii(code[0])) {
        return [];
    }
    const prefix = prefixOf(code);
    return [
        {
            canonical: null,
            category: FAMILY.get(prefix) ?? prefix,
            description: text.slice(space + 1).trim(),
            ecosystem: "go",
            name: code,
            ruleId: code,
            tool: TOOL,
            toolVersion: version,
            url: `${DOCS}${code}`,
        },
    ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(TOOL, ["-version"]);
    const rules = commandOutput(TOOL, ["-list-checks"])
        .split("\n")
        .flatMap((line) => ruleOf(line, version))
        .toSorted(byRuleId);
    return [
        {
            rules,
            source: TOOL,
            summary: { byCategory: tallyBy(rules, "category"), tool: TOOL, toolVersion: version, total: rules.length },
        },
    ];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

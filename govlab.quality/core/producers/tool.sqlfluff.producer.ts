import type { CatalogProduct, CatalogRule, KnobEntry } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { INTEGER_TYPE } from "#configuration/constants/knob.constants";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { intAt } from "#core/parsers/knob.parser";
import { isThreshold } from "#core/predicates/knob.predicate";
import { remoteText } from "#core/adapters/remote.adapter";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const TOOL = "sqlfluff";
const DOCS = "https://docs.sqlfluff.com/en/stable/reference/rules.html";
const DEFAULTS = "https://raw.githubusercontent.com/sqlfluff/sqlfluff/main/src/sqlfluff/core/default_config.cfg";
const RULE_HEADER_PREFIX = "[sqlfluff:rules:";

const orNull = function orNull(value: string | null): string | null {
    return value === null || value === "" ? null : value;
};

const isRuleLine = function isRuleLine(line: string, code: string): boolean {
    return line !== "" && !line.startsWith(" ") && line.includes(": [") && code !== "";
};

const bracketed = function bracketed(line: string): string | null {
    const open = line.indexOf("[");
    const close = line.indexOf("]");
    return orNull(open !== -1 && close > open ? line.slice(open + 1, close) : null);
};

const ruleOf = function ruleOf(line: string, version: string): CatalogRule[] {
    const code = line.slice(0, line.indexOf(":")).trim();
    if (!isRuleLine(line, code)) {
        return [];
    }
    const close = line.indexOf("]");
    const dotted = bracketed(line);
    return [
        {
            canonical: null,
            category: dotted === null ? null : (dotted.split(".")[0] ?? null),
            description: orNull(close === -1 ? null : line.slice(close + 1).trim()),
            ecosystem: "sql",
            name: dotted ?? code,
            ruleId: code,
            tool: TOOL,
            toolVersion: version,
            url: DOCS,
        },
    ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(TOOL, ["version"]);
    const lines = commandOutput(TOOL, ["rules"])
        .split("\n")
        .map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
    const rules = lines.flatMap((line) => ruleOf(line, version)).toSorted(byRuleId);
    return [
        {
            rules,
            source: TOOL,
            summary: { byCategory: tallyBy(rules, "category"), tool: TOOL, toolVersion: version, total: rules.length },
        },
    ];
};

const knobs = async function knobs(): Promise<KnobEntry[]> {
    const entries: KnobEntry[] = [];
    let rule: string | null = null;
    for (const raw of ((await remoteText(DEFAULTS)) ?? "").split("\n")) {
        const line = raw.trim();
        if (line.startsWith("[")) {
            rule = line.startsWith(RULE_HEADER_PREFIX)
                ? line.slice(RULE_HEADER_PREFIX.length, line.indexOf("]"))
                : null;
            continue;
        }
        const eq = line.indexOf("=");
        const value = rule !== null && eq !== -1 ? intAt(line.slice(eq + 1), 0) : null;
        if (rule !== null && value !== null) {
            const knob = line.slice(0, eq).trim();
            entries.push([TOOL, rule, { default: value, knob, threshold: isThreshold(knob), type: INTEGER_TYPE }]);
        }
    }
    return entries;
};

defineProducer({ knobs, name: TOOL, produce, refresh: "manual" });

import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { remoteText } from "#core/adapters/remote.adapter";

const TOOL = "clj-kondo";
const VERSION = "master";
const SOURCE = "https://raw.githubusercontent.com/clj-kondo/clj-kondo/master/doc/linters.md";
const DOCS = "https://github.com/clj-kondo/clj-kondo/blob/master/doc/linters.md";
const HEADER_PREFIX = "### ";

interface Section {
    title: string;
    keyword?: string;
    description?: string;
    level?: string;
}

const backtickAfter = function backtickAfter(line: string, marker: string): string | null {
    const at = line.indexOf(marker);
    const open = at === -1 ? -1 : line.indexOf("`", at + marker.length);
    const close = open === -1 ? -1 : line.indexOf("`", open + 1);
    return close === -1 ? null : line.slice(open + 1, close).trim();
};

const afterMarker = function afterMarker(line: string, marker: string): string | null {
    const at = line.indexOf(marker);
    const rest = at === -1 ? "" : line.slice(at + marker.length).trim();
    return rest === "" ? null : rest;
};

const withMeta = function withMeta(section: Section, line: string): Section {
    const keyword = backtickAfter(line, "*Keyword:*");
    const description = afterMarker(line, "*Description:*");
    const level = backtickAfter(line, "*Default level:*");
    return {
        ...section,
        ...(keyword === null ? {} : { keyword }),
        ...(description === null ? {} : { description }),
        ...(level === null ? {} : { level }),
    };
};

const sectionsOf = function sectionsOf(lines: readonly string[]): Section[] {
    const sections: Section[] = [];
    for (const line of lines) {
        if (line.startsWith(HEADER_PREFIX)) {
            sections.push({ title: line.slice(HEADER_PREFIX.length).trim() });
            continue;
        }
        const last = sections.pop();
        if (last) {
            sections.push(withMeta(last, line));
        }
    }
    return sections;
};

const ruleOf = function ruleOf(section: Section): CatalogRule[] {
    const { description, keyword, level, title } = section;
    if (keyword === undefined || keyword === "") {
        return [];
    }
    return [
        {
            canonical: null,
            category: "linter",
            defaultLevel: level === undefined || level === "" ? null : level,
            description: description === undefined || description === "" ? null : description,
            ecosystem: "clojure",
            name: title === "" ? keyword : title,
            ruleId: keyword,
            tool: TOOL,
            toolVersion: VERSION,
            url: DOCS,
        },
    ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const lines = ((await remoteText(SOURCE)) ?? "").split("\n");
    const rules = sectionsOf(lines).flatMap(ruleOf).toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: VERSION, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

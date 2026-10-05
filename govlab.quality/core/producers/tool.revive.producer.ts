import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { remoteText } from "#core/adapters/remote.adapter";

const TOOL = "revive";
const VERSION = "master";
const SOURCE = "https://raw.githubusercontent.com/mgechev/revive/master/RULES_DESCRIPTIONS.md";
const DOCS = "https://revive.run/r#";
const HEADER_PREFIX = "## ";
const ALPHA: ReadonlySet<string> = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

interface Section {
    description: string | null;
    header: string;
}

const sectionsOf = function sectionsOf(lines: readonly string[]): Section[] {
    const sections: Section[] = [];
    for (const raw of lines) {
        const last = sections.at(-1);
        const line = raw.trim();
        if (raw.startsWith(HEADER_PREFIX)) {
            sections.push({ description: null, header: raw.slice(HEADER_PREFIX.length).trim() });
            continue;
        }
        if (last?.description === null && line !== "" && ALPHA.has(line[0] ?? "")) {
            last.description = line;
        }
    }
    return sections;
};

const ruleOf = function ruleOf(section: Section): CatalogRule[] {
    const { description, header } = section;
    return header === "" || header.includes(" ")
        ? []
        : [
              {
                  canonical: null,
                  category: "rule",
                  description,
                  ecosystem: "go",
                  name: header,
                  ruleId: header,
                  tool: TOOL,
                  toolVersion: VERSION,
                  url: `${DOCS}${header}`,
              },
          ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const rules = sectionsOf(((await remoteText(SOURCE)) ?? "").split("\n"))
        .flatMap(ruleOf)
        .toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: VERSION, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

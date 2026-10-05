import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { distinctRules } from "#core/selectors/catalog.selector";
import { remoteText } from "#core/adapters/remote.adapter";

const TOOL = "mypy";
const VERSION = "repo-master";
const SOURCE_ROOT = "https://raw.githubusercontent.com/python/mypy/master/docs/source";
const DOCS = "https://mypy.readthedocs.io/en/stable/error_code_list.html#code-";
const CODE_PREFIX = ".. _code-";
const LOOKAHEAD = 5;
const SOURCES: readonly [string, string][] = [
    ["error_code_list.rst", "default"],
    ["error_code_list2.rst", "optional"],
];

const codeAt = function codeAt(line: string): string | null {
    const text = line.trim();
    return text.startsWith(CODE_PREFIX) && text.endsWith(":") ? text.slice(CODE_PREFIX.length, -1) || null : null;
};

const titleAfter = function titleAfter(lines: readonly string[], index: number): string | null {
    const title = lines
        .slice(index + 1, index + LOOKAHEAD)
        .map((line) => line.trim())
        .find((line) => line !== "" && !line.startsWith("---") && !line.startsWith("==="));
    return title ?? null;
};

const rulesOf = function rulesOf(text: string, kind: string): CatalogRule[] {
    const lines = text.split("\n");
    return lines.flatMap((line, index): CatalogRule[] => {
        const code = codeAt(line);
        return code === null
            ? []
            : [
                  {
                      canonical: null,
                      category: kind,
                      description: titleAfter(lines, index) ?? code,
                      ecosystem: "python",
                      name: code,
                      ruleId: code,
                      tool: TOOL,
                      toolVersion: VERSION,
                      url: `${DOCS}${code}`,
                  },
              ];
    });
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const texts = await Promise.all(SOURCES.map(async ([file]) => remoteText(`${SOURCE_ROOT}/${file}`)));
    const rows = SOURCES.flatMap(([, kind], index) => rulesOf(texts[index] ?? "", kind));
    const rules = distinctRules(rows).toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: VERSION, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

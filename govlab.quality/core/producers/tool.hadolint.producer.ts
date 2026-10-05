import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { distinctRules } from "#core/selectors/catalog.selector";
import { remoteText } from "#core/adapters/remote.adapter";

const TOOL = "hadolint";
const VERSION = "readme";
const SOURCE = "https://raw.githubusercontent.com/hadolint/hadolint/master/README.md";
const DOCS = "https://github.com/hadolint/hadolint/wiki";
const ID_COL = 1;
const CAT_COL = 2;
const DESC_COL = 3;
const ROW_MARKERS = ["| [DL", "| [SC"];
const ID_PREFIXES = ["DL", "SC"];

const cell = function cell(value: string | undefined): string | null {
    return value === undefined || value === "" ? null : value;
};

const ruleOf = function ruleOf(line: string): CatalogRule[] {
    if (!ROW_MARKERS.some((marker) => line.includes(marker))) {
        return [];
    }
    const cols = line.split("|").map((col) => col.trim());
    const idCell = cols[ID_COL] ?? "";
    const open = idCell.indexOf("[");
    const close = idCell.indexOf("]");
    const id = open === -1 || close === -1 ? "" : idCell.slice(open + 1, close);
    if (!ID_PREFIXES.some((prefix) => id.startsWith(prefix))) {
        return [];
    }
    return [
        {
            canonical: null,
            category: cell(cols[CAT_COL]),
            description: cell(cols[DESC_COL]),
            ecosystem: "dockerfile",
            name: id,
            ruleId: id,
            tool: TOOL,
            toolVersion: VERSION,
            url: `${DOCS}/${id}`,
        },
    ];
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const rules = distinctRules(((await remoteText(SOURCE)) ?? "").split("\n").flatMap(ruleOf)).toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: VERSION, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

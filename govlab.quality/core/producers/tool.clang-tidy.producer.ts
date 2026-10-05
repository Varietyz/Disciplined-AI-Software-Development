import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { distinctRules } from "#core/selectors/catalog.selector";
import { remoteText } from "#core/adapters/remote.adapter";
import { tallyBy } from "#core/aggregators/catalog.aggregator";

const TOOL = "clang-tidy";
const VERSION = "llvm-main";
const SOURCE =
    "https://raw.githubusercontent.com/llvm/llvm-project/main/clang-tools-extra/docs/clang-tidy/checks/list.rst";
const DOCS = "https://clang.llvm.org/extra/clang-tidy/checks";
const DOC = ":doc:`";
const LT = " <";

const parseLine = function parseLine(line: string): CatalogRule | null {
    const at = line.indexOf(DOC);
    const lt = at === -1 ? -1 : line.indexOf(LT, at + DOC.length);
    const name = lt === -1 ? "" : line.slice(at + DOC.length, lt).trim();
    if (name === "") {
        return null;
    }
    const pathStart = lt + LT.length;
    const pathEnd = line.indexOf(">", pathStart);
    const docPath = pathEnd > pathStart ? line.slice(pathStart, pathEnd) : name;
    return {
        canonical: null,
        category: name.includes("-") ? name.slice(0, name.indexOf("-")) : name,
        description: null,
        ecosystem: "cpp",
        fixable: line.includes('"Yes"'),
        name,
        ruleId: name,
        tool: TOOL,
        toolVersion: VERSION,
        url: `${DOCS}/${docPath}.html`,
    };
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const parsed = ((await remoteText(SOURCE)) ?? "").split("\n").map(parseLine);
    const rules = distinctRules(parsed.filter((rule): rule is CatalogRule => rule !== null)).toSorted(byRuleId);
    return [
        {
            rules,
            source: TOOL,
            summary: { byCategory: tallyBy(rules, "category"), tool: TOOL, toolVersion: VERSION, total: rules.length },
        },
    ];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

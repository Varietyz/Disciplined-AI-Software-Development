import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { HTMLHINT_CANONICAL, HTMLHINT_DESCRIPTIONS } from "#configuration/constants/tool.htmlhint.constants";
import { ROOT } from "@ssot/paths";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { recordAt } from "#core/selectors/record.selector";

const TOOL = "htmlhint";
const DOCS = "https://htmlhint.com/docs/user-guide/rules";

const produce = async function produce(): Promise<CatalogProduct[]> {
    const configured = recordAt(recordAt(await loadGovlabConfig(ROOT), TOOL), "rules");
    const rules = Object.entries(configured)
        .filter(([, value]) => value !== false)
        .map(([ruleId]): CatalogRule => ({
            canonical: HTMLHINT_CANONICAL.get(ruleId) ?? null,
            category: "html",
            deprecated: false,
            description: HTMLHINT_DESCRIPTIONS.get(ruleId) ?? ruleId,
            ecosystem: "html",
            fixable: false,
            name: ruleId,
            recommended: true,
            ruleId,
            tool: TOOL,
            url: `${DOCS}/${ruleId}`,
        }))
        .toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

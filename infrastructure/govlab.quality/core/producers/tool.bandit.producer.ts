import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { isRecord, stringField } from "#core/selectors/record.selector";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";
import { distinctRules } from "#core/selectors/catalog.selector";

const TOOL = "bandit";
const PYTHON = "python";
const DOCS = "https://bandit.readthedocs.io/en/latest/plugins/index.html";
const DUMP = [
    "from bandit.core import extension_loader as el",
    "import json",
    "m = el.MANAGER",
    "out = []",
    "for pid, p in m.plugins_by_id.items():",
    '    out.append({"id": pid, "name": getattr(p, "name", pid)})',
    "for bid, b in m.blacklist_by_id.items():",
    '    nm = b.get("name") if isinstance(b, dict) else None',
    '    out.append({"id": bid, "name": nm or bid})',
    "print(json.dumps(out))",
].join("\n");

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(PYTHON, ["-m", TOOL, "--version"]);
    const parsed: unknown = JSON.parse(commandOutput(PYTHON, ["-c", DUMP]));
    const rows = (Array.isArray(parsed) ? parsed : []).filter(isRecord).flatMap((entry): CatalogRule[] => {
        const id = stringField(entry, "id");
        const name = stringField(entry, "name") || id;
        return id === ""
            ? []
            : [
                  {
                      canonical: null,
                      category: "security",
                      description: null,
                      ecosystem: PYTHON,
                      name,
                      ruleId: id,
                      tool: TOOL,
                      toolVersion: version,
                      url: DOCS,
                  },
              ];
    });
    const rules = distinctRules(rows).toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: version, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

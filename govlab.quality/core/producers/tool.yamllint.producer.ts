import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { commandOutput, commandVersion } from "#core/adapters/invocation.adapter";
import { isRecord, stringField } from "#core/selectors/record.selector";
import { byRuleId } from "#core/comparators/rule.comparator";
import { defineProducer } from "#core/registries/producer.registry";

const TOOL = "yamllint";
const PYTHON = "python";
const DOCS = "https://yamllint.readthedocs.io/en/stable/rules.html";
const DUMP =
    "import os,importlib,json,yamllint.rules as R;d=os.path.dirname(R.__file__);" +
    "mods=[f[:-3] for f in os.listdir(d) if f.endswith('.py') and not f.startswith('__') and f!='common.py'];" +
    "print(json.dumps([{'id':getattr(importlib.import_module('yamllint.rules.'+n),'ID',n)," +
    "'d':((getattr(importlib.import_module('yamllint.rules.'+n),'__doc__','') or '').strip().split(chr(10)) or [''])[0]} for n in mods]))";

const produce = async function produce(): Promise<CatalogProduct[]> {
    const version = commandVersion(PYTHON, ["-m", TOOL, "--version"]);
    const parsed: unknown = JSON.parse(commandOutput(PYTHON, ["-c", DUMP]));
    const rules = (Array.isArray(parsed) ? parsed : [])
        .filter(isRecord)
        .flatMap((entry): CatalogRule[] => {
            const id = stringField(entry, "id");
            const description = stringField(entry, "d");
            return id === ""
                ? []
                : [
                      {
                          canonical: null,
                          category: "yaml",
                          description: description === "" ? null : description,
                          ecosystem: "yaml",
                          name: id,
                          ruleId: id,
                          tool: TOOL,
                          toolVersion: version,
                          url: DOCS,
                      },
                  ];
        })
        .toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, toolVersion: version, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

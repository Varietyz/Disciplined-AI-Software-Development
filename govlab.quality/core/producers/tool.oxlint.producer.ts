import type { CatalogProduct, CatalogRule } from "#types/catalog.types";
import { UNKNOWN_SIGNAL, signalDeathMessage } from "#configuration/strings/tool.strings";
import { recordAt, stringArrayFieldOr } from "#core/selectors/record.selector";
import { ROOT } from "@ssot/paths";
import { byRuleId } from "#core/comparators/rule.comparator";
import { createRequire } from "node:module";
import { defineProducer } from "#core/registries/producer.registry";
import { jsonRecord } from "#core/parsers/record.parser";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import path from "node:path";
import { signalKilled } from "#core/predicates/failure.predicate";
import { spawnTool } from "#core/adapters/invocation.adapter";
import { writeToolJson } from "#core/persistence/tool.persistence";

const TOOL = "oxlint";
const DOCS = "https://oxc.rs/docs/guide/usage/linter/rules";
const CATEGORIES = ["correctness", "suspicious", "perf", "pedantic", "style", "restriction", "nursery"];
const DEFAULT_PLUGINS = ["typescript", "oxc", "unicorn"];
const PROBE_FILE = "oxlint-catalog-probe.json";
const CORE_PLUGIN = "eslint";

const oxlintBin = function oxlintBin(): string {
    const entry = createRequire(import.meta.url).resolve(TOOL);
    return path.resolve(path.dirname(entry), "..", "bin", TOOL);
};

const ruleOf = function ruleOf(key: string): CatalogRule {
    const slash = key.indexOf("/");
    const plugin = slash === -1 ? CORE_PLUGIN : key.slice(0, slash);
    const name = slash === -1 ? key : key.slice(slash + 1);
    return {
        canonical: null,
        category: plugin,
        deprecated: false,
        description: name,
        ecosystem: "typescript",
        fixable: false,
        name,
        recommended: true,
        ruleId: `${plugin}/${name}`,
        tool: TOOL,
        url: `${DOCS}/${plugin}/${name}.html`,
    };
};

const produce = async function produce(): Promise<CatalogProduct[]> {
    const section = recordAt(await loadGovlabConfig(ROOT), TOOL);
    const plugins = stringArrayFieldOr(section, "plugins", DEFAULT_PLUGINS);
    const probe = {
        categories: Object.fromEntries(CATEGORIES.map((category) => [category, "deny"])),
        plugins,
        rules: {},
    };
    const probePath = await writeToolJson(ROOT, PROBE_FILE, probe);
    const result = spawnTool(process.execPath, [oxlintBin(), "--type-aware", "-c", probePath, "--print-config"], {
        encoding: "utf8",
    });
    if (signalKilled(result.status)) {
        throw new Error(signalDeathMessage(TOOL, result.signal ?? UNKNOWN_SIGNAL));
    }
    const rules = Object.keys(recordAt(jsonRecord(result.stdout), "rules"))
        .map(ruleOf)
        .toSorted(byRuleId);
    return [{ rules, source: TOOL, summary: { tool: TOOL, total: rules.length } }];
};

defineProducer({ name: TOOL, produce, refresh: "manual" });

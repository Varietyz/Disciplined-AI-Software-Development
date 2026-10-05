import type { CatalogRule, CatalogWriter, ToolTally } from "#types/catalog.types";
import { readFileSync, readdirSync } from "node:fs";
import { recordAt, recordsAt, stringField } from "#core/selectors/record.selector";
import { absolutePath } from "@ssot/paths";
import { coverageMarkdown } from "#core/formatters/catalog.formatter";
import { defineStep } from "#core/registries/step.registry";
import { jsonRecord } from "#core/parsers/record.parser";
import path from "node:path";

const JSON_SUFFIX = ".json";
const INDEX_FILE = "index.generated.json";
const COVERAGE_FILE = "coverage.generated.md";
const UNKNOWN = "unknown";

interface SourceCatalog {
    rules: CatalogRule[];
    tool: string;
    version: string;
}

const isCatalogRule = function isCatalogRule(value: Record<string, unknown>): value is CatalogRule {
    return typeof value["ruleId"] === "string";
};

const readSource = function readSource(file: string): SourceCatalog {
    const parsed = jsonRecord(readFileSync(file, "utf8"));
    const summary = recordAt(parsed, "summary");
    const rules = recordsAt(parsed, "rules").filter(isCatalogRule);
    const [first] = rules;
    const version = stringField(summary, "toolVersion") || (first ? stringField(first, "toolVersion") : "") || UNKNOWN;
    return { rules, tool: stringField(summary, "tool") || path.basename(file, JSON_SUFFIX), version };
};

const sourceFiles = function sourceFiles(): string[] {
    return ["govlab.quality.catalog.data", "govlab.quality.catalog.generated"].flatMap((key) => {
        const dir = absolutePath(key);
        return readdirSync(dir)
            .filter((name) => name.endsWith(JSON_SUFFIX))
            .map((name) => path.join(dir, name));
    });
};

const tallyOf = function tallyOf(source: SourceCatalog): ToolTally {
    const ecosystems = [...new Set(source.rules.map((rule) => stringField(rule, "ecosystem") || UNKNOWN))];
    const ecosystem = ecosystems.length === 1 ? (ecosystems[0] ?? UNKNOWN) : `multi(${String(ecosystems.length)})`;
    return { ecosystem, rules: source.rules.length, tool: source.tool, version: source.version };
};

const byEcosystemOf = function byEcosystemOf(rules: readonly CatalogRule[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const rule of rules) {
        const ecosystem = stringField(rule, "ecosystem") || UNKNOWN;
        counts[ecosystem] = (counts[ecosystem] ?? 0) + 1;
    }
    return counts;
};

const writeIndex = async function writeIndex(
    writer: CatalogWriter,
    sources: readonly SourceCatalog[],
    rules: readonly CatalogRule[],
): Promise<void> {
    const byEcosystem = byEcosystemOf(rules);
    const tools = sources.map(tallyOf).toSorted((a, b) => b.rules - a.rules);
    const index = {
        byEcosystem,
        ecosystems: Object.keys(byEcosystem).length,
        tools,
        totalRules: rules.length,
        totalTools: tools.length,
    };
    await writer.json(absolutePath("govlab.quality.generated", INDEX_FILE), index);
    await writer.markdown(absolutePath("govlab.quality.generated", COVERAGE_FILE), coverageMarkdown(index));
};

defineStep({
    gives: ["rules"],
    name: "catalog",
    needs: [],
    run: async (_state, writer) => {
        const sources = sourceFiles()
            .map(readSource)
            .toSorted((a, b) => a.tool.localeCompare(b.tool));
        const rules = sources.flatMap((source) => source.rules.map((rule): CatalogRule => ({ ...rule })));
        await writeIndex(writer, sources, rules);
        return { rules };
    },
});

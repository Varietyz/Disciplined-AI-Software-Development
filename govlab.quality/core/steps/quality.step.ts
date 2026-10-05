import type {
    CatalogRule,
    ConcernControl,
    QualityConcernRecord,
    QualityToolRecord,
    RuleKnob,
} from "#types/catalog.types";
import { concernControls, knobLookup } from "#core/aggregators/concern.aggregator";
import { readdirSync, rmSync } from "node:fs";
import { stringArrayField, stringField } from "#core/selectors/record.selector";
import { absolutePath } from "@ssot/paths";
import { defineStep } from "#core/registries/step.registry";
import { loadKnobConcepts } from "#core/loaders/knob.loader";
import path from "node:path";
import { slugify } from "@govlab/context";

const CONCERNS_FILE = "concerns.generated.json";
const TOOLS_FILE = "tools.generated.json";
const GENERATED_JSON = ".generated.json";
const UNKNOWN = "unknown";

const concernRecordOf = function concernRecordOf([name, control]: [string, ConcernControl]): QualityConcernRecord {
    return {
        name,
        numeric: typeof control.value === "number",
        ruleCount: control.rules,
        severity: control.severity,
        toolCount: control.tools,
        value: control.value,
        ...(control.valueDerivation === undefined || control.valueDerivation === ""
            ? {}
            : { valueDerivation: control.valueDerivation }),
        ...(control.knobPerTool ? { knobPerTool: control.knobPerTool } : {}),
        ...(control.configOptions ? { configOptions: control.configOptions } : {}),
    };
};

const ruleRecordOf = function ruleRecordOf(rule: CatalogRule, knobs: readonly RuleKnob[]): Record<string, unknown> {
    const tool = stringField(rule, "tool");
    const { concern, ecosystem } = rule;
    const canonical = stringArrayField(rule, "canonical");
    return {
        category: stringField(rule, "category"),
        name: `${tool}:${rule.ruleId}`,
        ruleId: rule.ruleId,
        ruleName: stringField(rule, "name") || rule.ruleId,
        tool,
        url: stringField(rule, "url"),
        ...(typeof concern === "string" ? { concern } : {}),
        ...(typeof ecosystem === "string" ? { ecosystem } : {}),
        ...(canonical.length > 0 ? { canonical } : {}),
        ...(knobs.length > 0 ? { knobs } : {}),
    };
};

const toolRecordsOf = function toolRecordsOf(
    rules: readonly CatalogRule[],
    knobCount: (rule: CatalogRule) => number,
): Partial<QualityToolRecord>[] {
    const tallies = new Map<string, { ecosystem?: string; knobCount: number; ruleCount: number }>();
    for (const rule of rules) {
        const tool = stringField(rule, "tool");
        const { ecosystem } = rule;
        const tally = tallies.get(tool) ?? {
            knobCount: 0,
            ruleCount: 0,
            ...(typeof ecosystem === "string" ? { ecosystem } : {}),
        };
        tally.ruleCount += 1;
        tally.knobCount += knobCount(rule);
        tallies.set(tool, tally);
    }
    return [...tallies]
        .toSorted((a, b) => a[0].localeCompare(b[0]))
        .map(([name, tally]) => ({
            detectionOnly: tally.knobCount === 0,
            ...(tally.ecosystem === undefined ? {} : { ecosystem: tally.ecosystem }),
            knobCount: tally.knobCount,
            name,
            ruleCount: tally.ruleCount,
        }));
};

const clearEcosystemRules = function clearEcosystemRules(dir: string): void {
    for (const name of readdirSync(dir).filter((file) => file.endsWith(GENERATED_JSON))) {
        rmSync(path.join(dir, name));
    }
};

defineStep({
    gives: [],
    name: "quality",
    needs: ["catalog", "ruleKnobs"],
    run: async (state, writer) => {
        const catalog = state.catalog ?? [];
        const ruleKnobs = state.ruleKnobs ?? {};
        const knobsOf = (rule: CatalogRule): RuleKnob[] =>
            ruleKnobs[`${stringField(rule, "tool")}:${rule.ruleId}`] ?? [];
        const controls = concernControls(catalog, knobLookup(catalog, ruleKnobs, loadKnobConcepts()));
        const byEcosystem = new Map<string, Record<string, unknown>[]>();
        for (const rule of catalog) {
            const ecosystem = typeof rule["ecosystem"] === "string" ? rule["ecosystem"] : UNKNOWN;
            const group = byEcosystem.get(ecosystem) ?? [];
            group.push(ruleRecordOf(rule, knobsOf(rule)));
            byEcosystem.set(ecosystem, group);
        }
        const dir = absolutePath("govlab.quality.ecosystemRules");
        clearEcosystemRules(dir);
        await writer.json(absolutePath("govlab.quality.generated", CONCERNS_FILE), {
            category: "quality-concerns",
            records: controls.map(concernRecordOf),
        });
        await writer.json(absolutePath("govlab.quality.generated", TOOLS_FILE), {
            category: "quality-tools",
            records: toolRecordsOf(catalog, (rule) => knobsOf(rule).length),
        });
        await Promise.all(
            [...byEcosystem].map(async ([ecosystem, records]) => {
                const file = path.join(dir, `${slugify(ecosystem) || UNKNOWN}${GENERATED_JSON}`);
                await writer.json(file, { category: "quality-rules", ecosystem, records });
            }),
        );
        return {};
    },
});

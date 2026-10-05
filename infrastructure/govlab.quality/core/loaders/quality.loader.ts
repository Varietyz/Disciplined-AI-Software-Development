import type {
    Exemplar,
    QualityConcept,
    QualityConcernRecord,
    QualityData,
    QualityRuleRecord,
    QualityToolRecord,
    ToolKnob,
} from "#types/catalog.types";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { isRecord, numberField, recordsAt, stringArrayField, stringField } from "#core/selectors/record.selector";
import { absolutePath } from "@ssot/paths";
import { jsonRecord } from "#core/parsers/record.parser";
import path from "node:path";

const CONCERNS_FILE = "concerns.generated.json";
const TOOLS_FILE = "tools.generated.json";
const GENERATED_JSON = ".generated.json";
const DEFAULT_EXEMPLAR_LANG = "ts";

const readRecords = function readRecords(file: string): Record<string, unknown>[] {
    return recordsAt(jsonRecord(readFileSync(file, "utf8")), "records");
};

const asExemplar = function asExemplar(value: unknown): Exemplar | null {
    if (!isRecord(value)) {
        return null;
    }
    const before = stringField(value, "before");
    const after = stringField(value, "after");
    if (before.length === 0 && after.length === 0) {
        return null;
    }
    return { after, before, lang: stringField(value, "lang") || DEFAULT_EXEMPLAR_LANG };
};

const toConcept = function toConcept(raw: Record<string, unknown>): QualityConcept | null {
    const concept: QualityConcept = {
        dimension: stringField(raw, "dimension"),
        id: stringField(raw, "id"),
        total: numberField(raw, "total", 0),
    };
    const exemplar = asExemplar(raw["exemplar"]);
    if (exemplar !== null) {
        concept.exemplar = exemplar;
    }
    return concept.id ? concept : null;
};

const loadConcepts = function loadConcepts(): QualityConcept[] {
    const file = absolutePath("govlab.quality.generated.concepts");
    if (!existsSync(file)) {
        return [];
    }
    return recordsAt(jsonRecord(readFileSync(file, "utf8")), "concepts")
        .map(toConcept)
        .filter((concept): concept is QualityConcept => concept !== null);
};

const asScalar = function asScalar(value: unknown): boolean | number | string | null {
    return typeof value === "number" || typeof value === "string" || typeof value === "boolean" ? value : null;
};

const asStringRecord = function asStringRecord(value: Record<string, unknown>): Record<string, string> {
    return Object.fromEntries(
        Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
    );
};

const normKnob = function normKnob(raw: Record<string, unknown>): ToolKnob {
    return {
        default: asScalar(raw["default"]),
        knob: stringField(raw, "knob"),
        threshold: raw["threshold"] === true,
        type: stringField(raw, "type"),
    };
};

const normConcern = function normConcern(raw: Record<string, unknown>): QualityConcernRecord {
    const declared = raw["value"];
    const value = typeof declared === "number" || typeof declared === "boolean" ? declared : true;
    const concern: QualityConcernRecord = {
        name: stringField(raw, "name"),
        numeric: typeof value === "number",
        ruleCount: numberField(raw, "ruleCount", 0),
        severity: stringField(raw, "severity") || "error",
        toolCount: numberField(raw, "toolCount", 0),
        value,
    };
    const { configOptions, knobPerTool, valueDerivation } = raw;
    if (typeof valueDerivation === "string") {
        concern.valueDerivation = valueDerivation;
    }
    if (isRecord(knobPerTool)) {
        concern.knobPerTool = asStringRecord(knobPerTool);
    }
    if (Array.isArray(configOptions)) {
        concern.configOptions = stringArrayField(raw, "configOptions");
    }
    return concern;
};

const normRule = function normRule(raw: Record<string, unknown>): QualityRuleRecord {
    const rule: QualityRuleRecord = {
        category: stringField(raw, "category"),
        concern: stringField(raw, "concern"),
        ecosystem: stringField(raw, "ecosystem"),
        name: stringField(raw, "name"),
        ruleId: stringField(raw, "ruleId"),
        ruleName: stringField(raw, "ruleName"),
        tool: stringField(raw, "tool"),
        url: stringField(raw, "url"),
    };
    const canonical = stringArrayField(raw, "canonical");
    if (canonical.length > 0) {
        rule.canonical = canonical;
    }
    const knobs = recordsAt(raw, "knobs");
    if (knobs.length > 0) {
        rule.knobs = knobs.map(normKnob);
    }
    return rule;
};

const normTool = function normTool(raw: Record<string, unknown>): QualityToolRecord {
    return {
        detectionOnly: raw["detectionOnly"] === true,
        ecosystem: stringField(raw, "ecosystem"),
        knobCount: numberField(raw, "knobCount", 0),
        name: stringField(raw, "name"),
        ruleCount: numberField(raw, "ruleCount", 0),
    };
};

const loadRules = function loadRules(): QualityRuleRecord[] {
    const dir = absolutePath("govlab.quality.ecosystemRules");
    return readdirSync(dir)
        .filter((name) => name.endsWith(GENERATED_JSON))
        .toSorted((a, b) => a.localeCompare(b))
        .flatMap((name) => readRecords(path.join(dir, name)).map(normRule));
};

export const loadQualityData = function loadQualityData(): QualityData {
    return {
        concepts: loadConcepts(),
        concerns: readRecords(absolutePath("govlab.quality.generated", CONCERNS_FILE)).map(normConcern),
        rules: loadRules(),
        tools: readRecords(absolutePath("govlab.quality.generated", TOOLS_FILE)).map(normTool),
    };
};

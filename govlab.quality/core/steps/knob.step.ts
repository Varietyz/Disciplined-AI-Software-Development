import type { KnobSpec, RuleKnob } from "#types/catalog.types";
import { isRecord, stringField } from "#core/selectors/record.selector";
import { absolutePath } from "@ssot/paths";
import { defineStep } from "#core/registries/step.registry";
import { readFileSync } from "node:fs";
import { readKnobs } from "#core/persistence/catalog.persistence";

const DEFAULTS_FILE = "knob.rule.data.json";
const TOOL_COLUMN = 0;
const RULE_COLUMN = 1;
const SPEC_COLUMN = 2;

const specOf = function specOf(value: unknown): KnobSpec | null {
    if (!isRecord(value) || typeof value["knob"] !== "string") {
        return null;
    }
    const type = stringField(value, "type");
    return {
        default: value["default"],
        knob: value["knob"],
        threshold: value["threshold"] === true,
        ...(type === "" ? {} : { type }),
    };
};

const entryOf = function entryOf(row: unknown): [string, KnobSpec][] {
    if (!Array.isArray(row)) {
        return [];
    }
    const tool: unknown = row[TOOL_COLUMN];
    const ruleId: unknown = row[RULE_COLUMN];
    const spec = specOf(row[SPEC_COLUMN]);
    return typeof tool === "string" && typeof ruleId === "string" && spec !== null ? [[`${tool}:${ruleId}`, spec]] : [];
};

const defaultRowOf = function defaultRowOf(row: unknown): [string, KnobSpec][] {
    if (!Array.isArray(row)) {
        return [];
    }
    const columns: readonly unknown[] = row;
    const [tool, ruleId, knob, type, fallback, threshold] = columns;
    if (typeof tool !== "string" || typeof ruleId !== "string" || typeof knob !== "string") {
        return [];
    }
    const spec: KnobSpec = {
        default: fallback,
        knob,
        threshold: threshold === true,
        type: typeof type === "string" ? type : "",
    };
    return [[`${tool}:${ruleId}`, spec]];
};

const collectedEntries = function collectedEntries(): [string, KnobSpec][] {
    return Object.values(readKnobs()).flatMap((rows) => (Array.isArray(rows) ? rows.flatMap(entryOf) : []));
};

const defaultEntries = function defaultEntries(): [string, KnobSpec][] {
    const parsed: unknown = JSON.parse(readFileSync(absolutePath("govlab.quality.data", DEFAULTS_FILE), "utf8"));
    return Array.isArray(parsed) ? parsed.flatMap(defaultRowOf) : [];
};

const toRuleKnob = function toRuleKnob(spec: KnobSpec): RuleKnob {
    return {
        default: spec.default ?? null,
        knob: spec.knob,
        threshold: spec.threshold,
        ...(spec.type === undefined ? {} : { type: spec.type }),
    };
};

defineStep({
    gives: ["ruleKnobs"],
    name: "knob",
    needs: [],
    run: async () => {
        const ruleKnobs: Record<string, RuleKnob[]> = {};
        for (const [key, spec] of [...collectedEntries(), ...defaultEntries()]) {
            const bucket = ruleKnobs[key] ?? [];
            if (!bucket.some((knob) => knob.knob === spec.knob)) {
                ruleKnobs[key] = [...bucket, toRuleKnob(spec)];
            }
        }
        return { ruleKnobs };
    },
});

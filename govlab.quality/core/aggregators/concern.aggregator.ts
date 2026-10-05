import type { CatalogRule, ConcernControl, RuleKnob } from "#types/catalog.types";
import type { ConceptKnob, KnobConcept } from "#types/canon.types";
import { PRIMARY_KNOBS, SECONDARY_KNOBS, UNRANKED } from "#configuration/constants/knob.constants";
import { stringArrayField, stringField } from "#core/selectors/record.selector";
import { isDigit } from "@govlab/constants";

interface ConcernTally {
    options: Set<string>;
    rules: number;
    thresholdDefaults: number[];
    thresholdKnobByTool: Record<string, string>;
    tools: Set<string>;
}

type KnobLookup = (tool: string, ruleId: string) => RuleKnob[];

const PRIMARY_RANK = new Map(PRIMARY_KNOBS.map((knob, rank) => [knob, rank]));

const numericDefault = function numericDefault(value: unknown): number | null {
    if (typeof value === "number") {
        return value;
    }
    const text = typeof value === "string" ? value : "";
    let digits = "";
    for (const char of text) {
        if (!isDigit(char) && digits !== "") {
            break;
        }
        digits += isDigit(char) ? char : "";
    }
    return digits === "" ? null : Number(digits);
};

const bridgedKnob = function bridgedKnob(knob: ConceptKnob | undefined): string | null {
    if (knob === undefined || knob.fixed === true) {
        return null;
    }
    return typeof knob.knob === "string" && knob.knob !== "" ? knob.knob : null;
};

const bridgeKnobs = function bridgeKnobs(
    rules: readonly CatalogRule[],
    knobConcepts: Readonly<Record<string, KnobConcept>>,
): Map<string, RuleKnob[]> {
    const bridge = new Map<string, RuleKnob[]>();
    for (const [concept, knobConcept] of Object.entries(knobConcepts)) {
        for (const rule of rules) {
            const tool = stringField(rule, "tool");
            const toolKnob = knobConcept.tools[tool];
            const knobName = bridgedKnob(toolKnob);
            if (knobName !== null && stringArrayField(rule, "canonical").includes(concept)) {
                const key = `${tool}:${rule.ruleId}`;
                const knob: RuleKnob = { default: numericDefault(toolKnob?.default), knob: knobName, threshold: true };
                bridge.set(key, [...(bridge.get(key) ?? []), knob]);
            }
        }
    }
    return bridge;
};

export const knobLookup = function knobLookup(
    rules: readonly CatalogRule[],
    ruleKnobs: Readonly<Record<string, RuleKnob[]>>,
    knobConcepts: Readonly<Record<string, KnobConcept>>,
): KnobLookup {
    const bridge = bridgeKnobs(rules, knobConcepts);
    return (tool, ruleId) => {
        const key = `${tool}:${ruleId}`;
        const own = ruleKnobs[key] ?? [];
        const seen = new Set(own.map((knob) => knob.knob));
        return [...own, ...(bridge.get(key) ?? []).filter((knob) => !seen.has(knob.knob))];
    };
};

const primaryThreshold = function primaryThreshold(knobs: readonly RuleKnob[]): { def: number; knob: string } | null {
    const candidates = knobs
        .filter((knob) => knob.threshold && knob.default !== null && knob.default !== undefined)
        .filter((knob) => !SECONDARY_KNOBS.has(knob.knob.toLowerCase()))
        .toSorted(
            (a, b) =>
                (PRIMARY_RANK.get(a.knob.toLowerCase()) ?? UNRANKED) -
                (PRIMARY_RANK.get(b.knob.toLowerCase()) ?? UNRANKED),
        );
    const [primary] = candidates;
    const def = primary ? numericDefault(primary.default) : null;
    return primary && def !== null ? { def, knob: primary.knob } : null;
};

const tallyConcerns = function tallyConcerns(
    rules: readonly CatalogRule[],
    knobsFor: KnobLookup,
): Map<string, ConcernTally> {
    const byConcern = new Map<string, ConcernTally>();
    for (const rule of rules) {
        const concern = stringField(rule, "concern");
        if (concern !== "") {
            const tool = stringField(rule, "tool");
            const tally = byConcern.get(concern) ?? {
                options: new Set<string>(),
                rules: 0,
                thresholdDefaults: [],
                thresholdKnobByTool: {},
                tools: new Set<string>(),
            };
            const knobs = knobsFor(tool, rule.ruleId);
            tally.tools.add(tool);
            tally.rules += 1;
            for (const knob of knobs) {
                tally.options.add(knob.knob);
            }
            const threshold = primaryThreshold(knobs);
            if (threshold !== null) {
                tally.thresholdDefaults.push(threshold.def);
                tally.thresholdKnobByTool[tool] ??= threshold.knob;
            }
            byConcern.set(concern, tally);
        }
    }
    return byConcern;
};

const controlOf = function controlOf(tally: ConcernTally): ConcernControl {
    const control: ConcernControl = { rules: tally.rules, severity: "error", tools: tally.tools.size, value: true };
    if (tally.thresholdDefaults.length > 0) {
        const sorted = tally.thresholdDefaults.toSorted((a, b) => a - b);
        control.value = Math.min(...tally.thresholdDefaults);
        control.valueDerivation = `highest-lowest (strictest all rules settle on) = min of defaults [${sorted.join(", ")}]`;
        control.knobPerTool = tally.thresholdKnobByTool;
    }
    if (tally.options.size > 0) {
        control.configOptions = [...tally.options].toSorted((a, b) => a.localeCompare(b));
    }
    return control;
};

export const concernControls = function concernControls(
    rules: readonly CatalogRule[],
    knobsFor: KnobLookup,
): [string, ConcernControl][] {
    return [...tallyConcerns(rules, knobsFor)]
        .map(([id, tally]): [string, ConcernControl] => [id, controlOf(tally)])
        .toSorted((a, b) => b[1].tools - a[1].tools || b[1].rules - a[1].rules);
};

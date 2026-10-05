import {
    CONCEPT_SURFACE,
    DEFAULT_PROVENANCE,
    FIDELITY_LEVELS,
    FORMAT_DIMENSION,
    LAYOUT_SURFACE,
    OWNED_BY_VALUE_SETTINGS,
    TOGGLE_VALUE_TYPE,
} from "#configuration/constants/canon.constants";
import type { CanonicalSettingRecord, Fidelity, MappingConcept, MappingEntry, MappingRow } from "#types/canon.types";
import type { EmitTokens } from "#types/emitter.types";
import { absolutePath } from "@ssot/paths";
import { defineStep } from "#core/registries/step.registry";
import { loadKnobConcepts } from "#core/loaders/knob.loader";
import { mappingConcepts } from "#core/converters/canon.concept.converter";

const SETTINGS_FILE = "canonical-settings.generated.json";
const ROWS_FILE = "mapping-rows.generated.json";
const TOKENS_FILE = "emit-tokens.generated.json";
const APPROX = "approx";
const FLOOR_FIDELITY = "advisory";

const isFidelity = function isFidelity(value: string | null): value is Fidelity {
    return value !== null && FIDELITY_LEVELS.has(value);
};

const normalizeFidelity = function normalizeFidelity(value: string | null): Fidelity {
    if (value === APPROX) {
        return "approximate";
    }
    return isFidelity(value) ? value : FLOOR_FIDELITY;
};

const surfaceOf = function surfaceOf(id: string, dimension: string): string {
    return dimension === FORMAT_DIMENSION ? LAYOUT_SURFACE : (CONCEPT_SURFACE.get(id) ?? id);
};

const settingOf = function settingOf(id: string, concept: MappingConcept): CanonicalSettingRecord {
    return {
        default: null,
        dimension: concept.dimension,
        id,
        kind: concept.valueType === TOGGLE_VALUE_TYPE ? "rule-intent" : "value",
        surface: surfaceOf(id, concept.dimension),
        valueType: concept.valueType,
    };
};

const rowOf = function rowOf(id: string, entry: MappingEntry): MappingRow {
    return {
        canonicalId: id,
        default: entry.default ?? null,
        fidelity: normalizeFidelity(entry.fidelity),
        fixed: entry.fixed ?? false,
        knob: entry.knob,
        langs: Array.isArray(entry.lang) ? entry.lang : [entry.lang],
        provenance: { source: entry.provenance ?? DEFAULT_PROVENANCE, toolVersion: "" },
        ruleCount: entry.ruleCount,
        tool: entry.tool,
        verified: entry.verified,
    };
};

defineStep({
    gives: [],
    name: "canon",
    needs: ["catalog", "concepts"],
    run: async (state, writer) => {
        const mapping = mappingConcepts(state.catalog ?? [], state.concepts ?? [], loadKnobConcepts());
        const owned = [...mapping].filter(([id]) => !OWNED_BY_VALUE_SETTINGS.has(id));
        const settings = owned.map(([id, concept]) => settingOf(id, concept));
        const rows = owned.flatMap(([id, concept]) => concept.entries.map((entry) => rowOf(id, entry)));
        const tokens: EmitTokens = {};
        for (const [id, concept] of owned) {
            for (const entry of concept.entries) {
                const perTool = tokens[entry.tool] ?? {};
                perTool[id] = { knob: entry.knob, ruleIds: entry.ruleIds };
                tokens[entry.tool] = perTool;
            }
        }
        await writer.json(absolutePath("govlab.quality.generated", SETTINGS_FILE), { settings });
        await writer.json(absolutePath("govlab.quality.generated", ROWS_FILE), { rows });
        await writer.json(absolutePath("govlab.quality.generated", TOKENS_FILE), { tokens });
        return {};
    },
});

import type {
    CanonicalConfig,
    CanonicalData,
    CanonicalSettingRecord,
    MappingRow,
    OwnershipSurface,
} from "#types/canon.types";
import type { Conflict, ConflictReport, PerTool, ResolvedPlan } from "#types/plan.types";
import {
    applyRuleIntent,
    applyValueSetting,
    detectKnownBadPairs,
    indexOwnership,
    indexRows,
    matchesLang,
} from "#core/resolvers/surface.resolver";
import { channelMismatch, unknownSetting } from "#configuration/strings/quality.strings";

interface Binding {
    setting: CanonicalSettingRecord;
    value: unknown;
    lang: string;
    langRows: MappingRow[];
}

interface BindCtx {
    entries: [string, unknown][];
    expectKind: "rule-intent" | "value";
    languages: string[];
    rowsById: Map<string, MappingRow[]>;
    settingById: Map<string, CanonicalSettingRecord>;
}

interface BindResult {
    bindings: Binding[];
    conflicts: Conflict[];
}

const bindingsForSetting = function bindingsForSetting(
    setting: CanonicalSettingRecord,
    value: unknown,
    ctx: BindCtx,
): Binding[] {
    const rows = ctx.rowsById.get(setting.id) ?? [];
    return ctx.languages.flatMap((lang) => {
        const langRows = rows.filter((row) => matchesLang(row, lang));
        return langRows.length > 0 ? [{ lang, langRows, setting, value }] : [];
    });
};

const channelOf = function channelOf(kind: BindCtx["expectKind"]): string {
    return kind === "value" ? "values" : "enabled";
};

const bindings = function bindings(ctx: BindCtx): BindResult {
    const out: Binding[] = [];
    const conflicts: Conflict[] = [];
    for (const [canonicalId, value] of ctx.entries) {
        const setting = ctx.settingById.get(canonicalId);
        if (!setting) {
            conflicts.push({ canonicalId, detail: unknownSetting(canonicalId), kind: "unknown-setting" });
        } else if (setting.kind === ctx.expectKind) {
            out.push(...bindingsForSetting(setting, value, ctx));
        } else {
            conflicts.push({
                canonicalId,
                detail: channelMismatch(canonicalId, setting.kind, channelOf(ctx.expectKind)),
                kind: "channel-mismatch",
            });
        }
    }
    return { bindings: out, conflicts };
};

interface CollectCtx {
    data: CanonicalData;
    enabledBinds: BindResult;
    ownership: Map<string, OwnershipSurface>;
    perTool: PerTool;
    valueBinds: BindResult;
}

const collectConflicts = function collectConflicts(ctx: CollectCtx): Conflict[] {
    const valueConflicts = ctx.valueBinds.bindings.flatMap((bind) =>
        applyValueSetting({
            lang: bind.lang,
            langRows: bind.langRows,
            ownership: ctx.ownership,
            perTool: ctx.perTool,
            setting: bind.setting,
            value: bind.value,
        }),
    );
    for (const bind of ctx.enabledBinds.bindings) {
        applyRuleIntent({
            lang: bind.lang,
            langRows: bind.langRows,
            ownership: ctx.ownership,
            perTool: ctx.perTool,
            setting: bind.setting,
        });
    }
    return [
        ...ctx.valueBinds.conflicts,
        ...ctx.enabledBinds.conflicts,
        ...valueConflicts,
        ...detectKnownBadPairs(ctx.data, ctx.perTool),
    ];
};

export const resolveConfig = function resolveConfig(
    config: CanonicalConfig,
    data: CanonicalData,
): ConflictReport | ResolvedPlan {
    const perTool: PerTool = {};
    const settingById = new Map(
        data.settings.map((setting): [string, CanonicalSettingRecord] => [setting.id, setting]),
    );
    const shared = { languages: config.languages, rowsById: indexRows(data.rows), settingById };
    const ownership = indexOwnership(data.ownership);
    const valueBinds = bindings({ ...shared, entries: Object.entries(config.values ?? {}), expectKind: "value" });
    const enabledBinds = bindings({
        ...shared,
        entries: Object.entries(config.enabled ?? {}).filter(([, on]) => on),
        expectKind: "rule-intent",
    });
    const conflicts = collectConflicts({ data, enabledBinds, ownership, perTool, valueBinds });
    const blocking = conflicts.filter((conflict) => conflict.kind !== "unsatisfiable-on-fixed");
    return blocking.length > 0 ? { conflicts: blocking } : { perToolConfig: perTool };
};

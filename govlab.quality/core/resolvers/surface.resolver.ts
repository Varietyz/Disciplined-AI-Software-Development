import type { CanonicalData, CanonicalSettingRecord, MappingRow, OwnershipSurface } from "#types/canon.types";
import type { Conflict, PerTool, ToolResolution } from "#types/plan.types";
import { fixedOwnerValue, ownerContention } from "#configuration/strings/quality.strings";

const toolOf = function toolOf(perTool: PerTool, tool: string): ToolResolution {
    const existing = perTool[tool];
    if (existing) {
        return existing;
    }
    const created: ToolResolution = { disabledSurfaces: [], enabledIntents: [], knobs: {} };
    perTool[tool] = created;
    return created;
};

export const matchesLang = function matchesLang(row: MappingRow, lang: string): boolean {
    return row.langs.includes(lang);
};

export const indexRows = function indexRows(rows: MappingRow[]): Map<string, MappingRow[]> {
    const byId = new Map<string, MappingRow[]>();
    for (const row of rows) {
        const list = byId.get(row.canonicalId);
        if (list) {
            list.push(row);
        } else {
            byId.set(row.canonicalId, [row]);
        }
    }
    return byId;
};

export const indexOwnership = function indexOwnership(surfaces: OwnershipSurface[]): Map<string, OwnershipSurface> {
    return new Map(surfaces.map((surface): [string, OwnershipSurface] => [surface.id, surface]));
};

const distinctTools = function distinctTools(rows: MappingRow[]): string[] {
    return [...new Set(rows.map((row) => row.tool))];
};

interface DisableCtx {
    langRows: MappingRow[];
    owner: string;
    perTool: PerTool;
    surface: string;
}

const disableNonOwners = function disableNonOwners(ctx: DisableCtx): void {
    for (const row of ctx.langRows) {
        if (row.tool !== ctx.owner) {
            const cfg = toolOf(ctx.perTool, row.tool);
            if (!cfg.disabledSurfaces.includes(ctx.surface)) {
                cfg.disabledSurfaces.push(ctx.surface);
            }
        }
    }
};

interface OwnerCtx {
    canonicalId: string;
    lang: string;
    langRows: MappingRow[];
    ownership: Map<string, OwnershipSurface>;
    surface: string;
}

const resolveOwner = function resolveOwner(ctx: OwnerCtx): { conflicts: Conflict[]; owner: string | null } {
    const declared = ctx.ownership.get(ctx.surface);
    const declaredOwner = declared?.ownerByLanguage[ctx.lang];
    if (typeof declaredOwner === "string" && declaredOwner.length > 0) {
        return { conflicts: [], owner: declaredOwner };
    }
    const tools = distinctTools(ctx.langRows);
    if (tools.length === 1) {
        return { conflicts: [], owner: tools[0] ?? null };
    }
    const candidates = [...new Set([...tools, ...(declared?.alternatives?.[ctx.lang] ?? [])])];
    const conflict: Conflict = {
        canonicalId: ctx.canonicalId,
        detail: ownerContention(ctx.surface, ctx.lang, tools.join(", ")),
        kind: "ownership-overlap",
        options: candidates.map((tool) => `make ${tool} the owner of ${ctx.surface}`),
        surface: ctx.surface,
    };
    return { conflicts: [conflict], owner: null };
};

interface ValueCtx {
    lang: string;
    langRows: MappingRow[];
    ownership: Map<string, OwnershipSurface>;
    perTool: PerTool;
    setting: CanonicalSettingRecord;
    value: unknown;
}

const applyOwnerRow = function applyOwnerRow(ctx: ValueCtx, owner: string): Conflict[] {
    const ownerRow = ctx.langRows.find((row) => row.tool === owner) ?? null;
    if (ownerRow?.fixed === true && ownerRow.default !== ctx.value) {
        const imposed = ownerRow.default === null ? "no configurable value" : JSON.stringify(ownerRow.default);
        const conflict: Conflict = {
            canonicalId: ctx.setting.id,
            detail: fixedOwnerValue(owner, imposed, ctx.lang, `${ctx.setting.id}=${JSON.stringify(ctx.value)}`),
            kind: "unsatisfiable-on-fixed",
            options: [`accept ${owner}'s fixed formatting`, `scope ${ctx.setting.id} to languages that support it`],
            surface: ctx.setting.surface,
        };
        return [conflict];
    }
    const knob = ownerRow?.knob;
    if (typeof knob === "string" && knob.length > 0) {
        toolOf(ctx.perTool, owner).knobs[ctx.setting.id] = ctx.value;
    }
    disableNonOwners({ langRows: ctx.langRows, owner, perTool: ctx.perTool, surface: ctx.setting.surface });
    return [];
};

export const applyValueSetting = function applyValueSetting(ctx: ValueCtx): Conflict[] {
    const resolved = resolveOwner({
        canonicalId: ctx.setting.id,
        lang: ctx.lang,
        langRows: ctx.langRows,
        ownership: ctx.ownership,
        surface: ctx.setting.surface,
    });
    return resolved.owner === null ? resolved.conflicts : applyOwnerRow(ctx, resolved.owner);
};

const enableIntent = function enableIntent(perTool: PerTool, tool: string, id: string): void {
    const cfg = toolOf(perTool, tool);
    if (!cfg.enabledIntents.includes(id)) {
        cfg.enabledIntents.push(id);
    }
};

interface IntentCtx {
    lang: string;
    langRows: MappingRow[];
    ownership: Map<string, OwnershipSurface>;
    perTool: PerTool;
    setting: CanonicalSettingRecord;
}

export const applyRuleIntent = function applyRuleIntent(ctx: IntentCtx): void {
    const owner = ctx.ownership.get(ctx.setting.surface)?.ownerByLanguage[ctx.lang];
    if (typeof owner === "string" && ctx.langRows.some((row) => row.tool === owner)) {
        enableIntent(ctx.perTool, owner, ctx.setting.id);
        disableNonOwners({ langRows: ctx.langRows, owner, perTool: ctx.perTool, surface: ctx.setting.surface });
        return;
    }
    for (const row of ctx.langRows) {
        enableIntent(ctx.perTool, row.tool, ctx.setting.id);
    }
};

const activeOnSurface = function activeOnSurface(perTool: PerTool, tool: string, surface: string | undefined): boolean {
    const resolution = perTool[tool];
    if (!resolution) {
        return false;
    }
    return typeof surface !== "string" || !resolution.disabledSurfaces.includes(surface);
};

export const detectKnownBadPairs = function detectKnownBadPairs(data: CanonicalData, perTool: PerTool): Conflict[] {
    return data.conflicts.flatMap((instance): Conflict[] =>
        instance.kind === "known-bad-pair" &&
        Array.isArray(instance.tools) &&
        instance.tools.every((tool) => activeOnSurface(perTool, tool, instance.surface))
            ? [
                  {
                      detail: `${instance.tools.join(" + ")}: ${instance.resolution}`,
                      kind: "known-bad-pair",
                      options: [instance.resolution],
                      surface: instance.surface,
                  },
              ]
            : [],
    );
};

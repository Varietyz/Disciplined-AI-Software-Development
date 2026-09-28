import { isResolved, slotText, surfacePath, surfacePrefix } from "../../../config/surface.config.ts";

export function inSurface(tail: string): string {
    const prefix = surfacePrefix();
    return prefix.length === 0 ? tail : `${prefix}/${tail}`;
}

export function inRules(name: string): string {
    return `${surfacePath("rules")}/${name}`;
}

export function inCore(tail: string): string {
    return `${surfacePath("core")}/${tail}`;
}

export function inEntrypoints(name: string): string {
    return `${surfacePath("entrypoints")}/${name}`;
}

export function inRoles(name: string): string {
    return `${surfacePath("roles")}/${name}`;
}

export function inPlanning(name: string): string {
    return `${surfacePath("planning")}/${name}`;
}

export function inGenerated(name: string): string {
    return `${surfacePath("generated")}/${name}`;
}

export const BOARD = surfacePath("board");

export const BOARD_TEMPLATE = surfacePath("board_template");

export const AGENT_INDEX = surfacePath("agent_index");

export const CHECKLIST_TEMPLATE = surfacePath("checklist_template");

export const HOST_DOCUMENT = isResolved("project", "governance_policy")
    ? slotText("project", "governance_policy")
    : `${surfacePrefix()}/_absent-projection-host.md`;

export const AXIS_DOCUMENT = surfacePath("axis_document");

export const RULES_DIGESTS = `${surfacePath("rule_digests")}/`;

export const AGENDA = surfacePath("agenda");

export const ACCUMULATOR = isResolved("project", "history")
    ? slotText("project", "history")
    : surfacePath("history");

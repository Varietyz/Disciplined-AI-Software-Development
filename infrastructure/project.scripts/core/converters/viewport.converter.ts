import {
    HOME_PAGE,
    HOME_ROUTE,
    HOME_SHOT,
    MISSING_PAGE,
    PAGE_EXTENSION,
    ROUTE_SEPARATOR,
    SHOT_EXTENSION,
    SHOT_SEPARATOR,
} from "#configuration/constants/viewport.constants";
import type { ViewportAudit, ViewportOptions } from "#types/viewport.types";
import { flagValue, flagValues, hasFlag, numberFlag } from "@govlab/argv";
import { resolve, sep } from "node:path";
import type { ParsedArgv } from "@govlab/argv";
import { VIEWPORT_DEFAULTS } from "#configuration/configs/viewport.config";

export const readOptions = function readOptions(argv: ParsedArgv): ViewportOptions | null {
    const outDir = flagValue(argv, "--out-dir");
    if (outDir === undefined) {
        return null;
    }
    return {
        browser: flagValue(argv, "--browser") ?? null,
        height: numberFlag(argv, "--height", VIEWPORT_DEFAULTS.height),
        outDir: resolve(outDir),
        routes: flagValues(argv, "--route"),
        settleMs: numberFlag(argv, "--settle", VIEWPORT_DEFAULTS.settleMs),
        software: !hasFlag(argv, "--gpu"),
        timeoutMs: numberFlag(argv, "--timeout", VIEWPORT_DEFAULTS.timeoutMs),
        width: numberFlag(argv, "--width", VIEWPORT_DEFAULTS.width),
    };
};

export const routeOfPage = function routeOfPage(page: string): string | null {
    const path = page.split(sep).join(ROUTE_SEPARATOR);
    if (!path.endsWith(PAGE_EXTENSION) || path.endsWith(MISSING_PAGE)) {
        return null;
    }
    return path === HOME_PAGE ? HOME_ROUTE : ROUTE_SEPARATOR + path.slice(0, -PAGE_EXTENSION.length);
};

export const shotNameOf = function shotNameOf(route: string): string {
    const name =
        route === HOME_ROUTE
            ? HOME_SHOT
            : route.slice(ROUTE_SEPARATOR.length).split(ROUTE_SEPARATOR).join(SHOT_SEPARATOR);
    return name + SHOT_EXTENSION;
};

const FAILING_LISTS = ["overflow", "inputs", "text", "targets"] as const;

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const textsAt = function textsAt(record: Record<string, unknown>, key: string): readonly string[] | null {
    const value = record[key];
    return Array.isArray(value) && value.every((entry) => typeof entry === "string") ? value : null;
};

export const auditOf = function auditOf(value: unknown): ViewportAudit | null {
    if (!isRecord(value) || typeof value["viewport"] !== "number" || typeof value["scrollsSideways"] !== "boolean") {
        return null;
    }
    const clipped = textsAt(value, "clipped");
    const inputs = textsAt(value, "inputs");
    const overflow = textsAt(value, "overflow");
    const targets = textsAt(value, "targets");
    const text = textsAt(value, "text");
    if (clipped === null || inputs === null || overflow === null) {
        return null;
    }
    if (targets === null || text === null) {
        return null;
    }
    return {
        clipped,
        inputs,
        overflow,
        scrollsSideways: value["scrollsSideways"],
        targets,
        text,
        viewport: value["viewport"],
    };
};

export const hasFinding = function hasFinding(audit: ViewportAudit): boolean {
    return audit.scrollsSideways || FAILING_LISTS.some((key) => audit[key].length > 0);
};

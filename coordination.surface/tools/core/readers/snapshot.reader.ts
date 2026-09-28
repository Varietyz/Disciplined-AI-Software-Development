import type { Extent, Retained } from "../types/snapshot.types.ts";
import { existsSync, readFileSync } from "node:fs";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { isUnreadableJson } from "../predicates/file.predicate.ts";
import { resolve } from "node:path";
import { ruleReportName } from "../reporters/rule.reporter.ts";

export const SNAPSHOT_STEP = "snapshot";

const REPORT = ruleReportName(SNAPSHOT_STEP);

const strings = function strings(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((one): one is string => typeof one === "string") : [];
};

const extentOf = function extentOf(value: unknown): Extent | null {
    if (!isObject(value)) {
        return null;
    }

    const { anchors, lifetime, mark } = value;
    if (typeof lifetime !== "string" || !Array.isArray(anchors)) {
        return null;
    }
    return { anchors: strings(anchors), lifetime, mark: typeof mark === "string" ? mark : "" };
};

const parsedReport = function parsedReport(path: string): unknown {
    try {
        return JSON.parse(readFileSync(path, "utf8"));
    } catch (error) {
        if (isUnreadableJson(error)) {
            return null;
        }
        throw error;
    }
};

export const retainedFrom = function retainedFrom(repoRoot: string): Retained | null {
    const path = resolve(repoRoot, GENERATED_DIR, REPORT);
    const parsed = existsSync(path) ? parsedReport(path) : null;
    const derivations = isObject(parsed) ? parsed["derivations"] : null;
    const held = isObject(derivations) ? derivations["retainedExtent"] : null;
    if (!isObject(held)) {
        return null;
    }

    const { anchorKinds, range, surfaces } = held;
    if (typeof range !== "string" || !isObject(surfaces)) {
        return null;
    }

    const out: Record<string, Extent> = {};
    for (const [surface, value] of Object.entries(surfaces)) {
        const extent = extentOf(value);
        if (extent !== null) {
            out[surface] = extent;
        }
    }

    return { anchorKinds: strings(anchorKinds), range, surfaces: out };
};

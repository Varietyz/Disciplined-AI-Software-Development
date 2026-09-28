import type { RepairOutcome, RepairScope } from "../types/repair.types.ts";
import { dirname, relative, resolve } from "node:path";

import { mkdirSync, writeFileSync } from "node:fs";
import { outsideScope, unclaimedRegion } from "../strings/repair.strings.ts";
import { slotList } from "../../../config/surface.config.ts";

const WHOLE = "whole";

const CLIMB = "..";

export const containedBy = function containedBy(declared: string, path: string): boolean {
    if (declared.length === 0 || declared === WHOLE) {
        return true;
    }

    const from = relative(declared, path);
    return from.length > 0 && !from.startsWith(CLIMB) && !resolve(from).startsWith(CLIMB);
};

export const isEnumerable = function isEnumerable(path: string, regions: readonly string[]): boolean {
    return regions.some((region) => containedBy(region, path));
};

export const writeRepair = function writeRepair(scope: RepairScope, path: string, text: string): RepairOutcome {
    const regions = slotList("convention", "enumerable_write_regions");

    if (isEnumerable(path, regions) && scope.claimed === false) {
        return { refusal: unclaimedRegion(path), written: false };
    }

    if (!containedBy(scope.declared, path)) {
        return { refusal: outsideScope(path, scope.declared), written: false };
    }

    const absolute = resolve(scope.repoRoot, path);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, text, "utf8");

    return { refusal: null, written: true };
};

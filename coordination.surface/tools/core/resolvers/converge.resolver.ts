import type { Absorption, Edge } from "../types/converge.types.ts";
import {
    CHECK_ABSORPTION,
    absorptionDuplicated,
    absorptionHolds,
    absorptionNoCloses,
    absorptionOpen,
    absorptionUndistributed,
} from "../strings/converge.strings.ts";
import { PLACEHOLDER, SIGN_OFF_ABSENT } from "../analyzers/converge.analyzer.ts";
import { basename, resolve } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { AWAITING_MARKER } from "../constants/blocking.constants.ts";
import { surfacePath } from "../../../config/surface.config.ts";

export const DISTRIBUTES_FIELD = "DISTRIBUTES:";

export const CLOSES_FIELD = "CLOSES:";

const OPEN_TASK = "- [ ]";

const AWAITING_LINE = AWAITING_MARKER;

interface PlannedSurface {
    readonly entry: string;
    readonly declares: boolean;
    readonly closes: string;
    readonly open: readonly string[];
}

interface Distribution {
    readonly path: string;
    readonly line: number;
    readonly declares: string;
}

const isAllDigits = function isAllDigits(text: string): boolean {
    for (const character of text) {
        if (character < "0" || character > "9") {
            return false;
        }
    }
    return text.length > 0;
};

const isTaskId = function isTaskId(token: string): boolean {
    return token.includes(".") && isAllDigits(token.replaceAll(".", ""));
};

const taskIdOf = function taskIdOf(trimmed: string): string {
    return trimmed.slice(OPEN_TASK.length).trim().split(" ")[0] ?? "";
};

const plannedSurface = function plannedSurface(planning: string, entry: string, venueName: string): PlannedSurface {
    const lines = readFileSync(resolve(planning, entry), "utf8")
        .split("\n")
        .map((line) => line.trim());
    const closesLine = lines.findLast((line) => line.startsWith(CLOSES_FIELD));

    return {
        closes: closesLine === undefined ? "" : closesLine.slice(CLOSES_FIELD.length).trim(),
        declares: lines.some((line) => line.startsWith(DISTRIBUTES_FIELD) && line.includes(venueName)),
        entry,
        open: lines
            .filter((line) => line.startsWith(OPEN_TASK))
            .map(taskIdOf)
            .filter(isTaskId),
    };
};

export const absorptionState = function absorptionState(repoRoot: string, venueName: string): Absorption | null {
    const planning = resolve(repoRoot, surfacePath("planning"));
    if (!existsSync(planning)) {
        return null;
    }

    const declaring = readdirSync(planning)
        .map((entry) => plannedSurface(planning, entry, venueName))
        .filter((surface) => surface.declares);
    const [first] = declaring;
    if (first === undefined) {
        return null;
    }

    return {
        checklist: first.entry,
        closes: first.closes,
        declaring: declaring.map((surface) => surface.entry),
        open: first.open.filter((id) => id !== first.closes),
    };
};

const absorbed = function absorbed(absorption: Absorption | null): boolean {
    return absorption?.declaring.length === 1 && absorption.closes.length > 0 && absorption.open.length === 0;
};

const absorptionDetail = function absorptionDetail(absorption: Absorption | null, target: string): string {
    if (absorption === null) {
        return absorptionUndistributed(basename(target), DISTRIBUTES_FIELD);
    }
    if (absorption.declaring.length > 1) {
        return absorptionDuplicated(absorption.declaring);
    }
    if (absorption.closes.length === 0) {
        return absorptionNoCloses(absorption.checklist, CLOSES_FIELD);
    }
    return absorption.open.length === 0
        ? absorptionHolds(absorption.checklist, absorption.closes)
        : absorptionOpen(absorption.checklist, absorption.open);
};

export const absorptionEdge = function absorptionEdge(repoRoot: string, target: string): Edge {
    const absorption = absorptionState(repoRoot, basename(target));
    return {
        detail: absorptionDetail(absorption, target),
        edge: CHECK_ABSORPTION,
        holds: absorbed(absorption),
        step: "absorption",
    };
};

export const declaredDistributions = function declaredDistributions(
    surfaces: readonly string[],
    read: (path: string) => string,
): Distribution[] {
    return surfaces.flatMap((path) =>
        read(path)
            .split("\n")
            .flatMap((line, index) => {
                const trimmed = line.trim();
                const declares = trimmed.startsWith(DISTRIBUTES_FIELD)
                    ? trimmed.slice(DISTRIBUTES_FIELD.length).trim()
                    : "";
                return declares.length === 0 || declares.startsWith(PLACEHOLDER)
                    ? []
                    : [{ declares, line: index + 1, path }];
            }),
    );
};

export const hasReadMark = function hasReadMark(venue: string): boolean {
    return venue
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith(AWAITING_LINE))
        .some((line) =>
            line
                .slice(AWAITING_LINE.length)
                .split(" ")
                .map((token) => token.trim())
                .some((letter) => letter.length > 0 && letter !== SIGN_OFF_ABSENT),
        );
};

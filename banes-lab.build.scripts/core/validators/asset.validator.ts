import { SOURCE_ROOT, WALK_ROOT } from "@banes-lab/web/core/assets/walk.assets.ts";
import { missingRecording, missingSource, missingVector, missingWalk } from "#configuration/strings/asset.strings";
import { DIAGRAM_ROOT } from "@banes-lab/web/core/assets/diagram.assets.ts";
import type { Finding } from "#types/validation.types";
import { buildOutput } from "#core/loaders/build.loader";
import { diagramFileName } from "#core/resolvers/diagram.resolver";
import { existsSync } from "node:fs";
import { isRecord } from "#core/selectors/base.selector";
import { join } from "node:path";
import { surfaceLocation } from "@banes-lab/web/core/assets/surface.asset.ts";

const DIAGRAM_KIND = "mermaid";
const KIND_KEY = "kind";
const TEXT_KEY = "text";
const WALK_KIND = "walk";
const WALK_KEY = "walk";
const WALK_VECTOR_KEY = "vector";
const WALK_CELLS_KEY = "cells";
const SOURCE_KIND = "source";
const MARKDOWN_KIND = "markdown";
const SOURCE_KEY = "source";
const SURFACE_KIND = "surface";
const FIGURE_KEY = "figure";

const diagramSourcesIn = function diagramSourcesIn(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.flatMap(diagramSourcesIn);
    }
    if (!isRecord(value)) {
        return [];
    }
    const text = value[TEXT_KEY];
    const own = value[KIND_KEY] === DIAGRAM_KIND && typeof text === "string" ? [text] : [];
    return [...own, ...Object.values(value).flatMap(diagramSourcesIn)];
};

export const checkDiagrams = function checkDiagrams(file: string, raw: string): Finding[] {
    const parsed: unknown = JSON.parse(raw);
    return diagramSourcesIn(parsed)
        .map(diagramFileName)
        .filter((name) => !existsSync(join(buildOutput(), DIAGRAM_ROOT.slice(1), name)))
        .map((name) => ({ file, message: missingVector(DIAGRAM_ROOT + name) }));
};

const assetNamesIn = function assetNamesIn(value: unknown, kind: string, keys: readonly string[]): string[] {
    if (Array.isArray(value)) {
        return value.flatMap((entry: unknown) => assetNamesIn(entry, kind, keys));
    }
    if (!isRecord(value)) {
        return [];
    }
    const own =
        value[KIND_KEY] === kind
            ? keys.map((key) => value[key]).filter((name): name is string => typeof name === "string")
            : [];
    return [...own, ...Object.values(value).flatMap((entry) => assetNamesIn(entry, kind, keys))];
};

const walkRefsIn = function walkRefsIn(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.flatMap(walkRefsIn);
    }
    if (!isRecord(value)) {
        return [];
    }
    const walk = value[WALK_KEY];
    const own =
        value[KIND_KEY] === WALK_KIND && isRecord(walk)
            ? [walk[WALK_VECTOR_KEY], walk[WALK_CELLS_KEY]].filter((name): name is string => typeof name === "string")
            : [];
    return [...own, ...Object.values(value).flatMap(walkRefsIn)];
};

export const checkAssets = function checkAssets(file: string, raw: string): Finding[] {
    const parsed: unknown = JSON.parse(raw);
    const walks = walkRefsIn(parsed)
        .filter((name) => !existsSync(join(buildOutput(), WALK_ROOT.slice(1), name)))
        .map((name) => ({ file, message: missingWalk(WALK_ROOT + name) }));
    const sources = [
        ...assetNamesIn(parsed, SOURCE_KIND, [SOURCE_KEY]),
        ...assetNamesIn(parsed, MARKDOWN_KIND, [SOURCE_KEY]),
    ]
        .filter((name) => !existsSync(join(buildOutput(), SOURCE_ROOT.slice(1), name)))
        .map((name) => ({ file, message: missingSource(SOURCE_ROOT + name) }));
    const recordings = assetNamesIn(parsed, SURFACE_KIND, [FIGURE_KEY])
        .map(surfaceLocation)
        .filter((location) => !existsSync(join(buildOutput(), location.slice(1))))
        .map((location) => ({ file, message: missingRecording(location) }));
    return [...walks, ...sources, ...recordings];
};

import { flagValue, flagValues, hasFlag, numberFlag } from "@govlab/argv";
import { join, resolve } from "node:path";
import type { CaptureOptions } from "#types/route.types";
import { LOCAL_ORIGIN } from "#configuration/configs/route.config";
import type { ParsedArgv } from "@govlab/argv";
import { SNAPSHOT_DEFAULTS } from "#configuration/configs/snapshot.config";
import type { SnapshotOptions } from "#types/snapshot.types";
import { portOf } from "@ssot/secrets";

const PNG_SUFFIX = ".png";
const LOG_SUFFIX = ".log";
const HOME_STEM = "index";
const ROUTE_SEPARATOR = "/";
const STEM_SEPARATOR = "-";

export const readCaptureOptions = function readCaptureOptions(argv: ParsedArgv): CaptureOptions | null {
    const routes = flagValues(argv, "--route");
    const outDir = flagValue(argv, "--out-dir");
    const rooted = routes.every((route) => route.startsWith(ROUTE_SEPARATOR));
    if (routes.length === 0 || !rooted || outDir === undefined) {
        return null;
    }
    return {
        browser: flagValue(argv, "--browser") ?? null,
        outDir: resolve(outDir),
        routes,
        settleMs: numberFlag(argv, "--settle", SNAPSHOT_DEFAULTS.settleMs),
        software: !hasFlag(argv, "--gpu"),
    };
};

export const artifactStem = function artifactStem(route: string): string {
    const words = route.split(ROUTE_SEPARATOR).filter((word) => word.length > 0);
    return words.length === 0 ? HOME_STEM : words.join(STEM_SEPARATOR);
};

export const snapshotFor = function snapshotFor(options: CaptureOptions, route: string): SnapshotOptions {
    const stem = join(options.outDir, artifactStem(route));
    return {
        browser: options.browser,
        clickAfterMs: SNAPSHOT_DEFAULTS.clickAfterMs,
        clickAt: null,
        height: SNAPSHOT_DEFAULTS.height,
        log: stem + LOG_SUFFIX,
        out: stem + PNG_SUFFIX,
        settleMs: options.settleMs,
        software: options.software,
        timeoutMs: SNAPSHOT_DEFAULTS.timeoutMs,
        url: LOCAL_ORIGIN + String(portOf("SITE_DEV_PORT")) + route,
        width: SNAPSHOT_DEFAULTS.width,
    };
};

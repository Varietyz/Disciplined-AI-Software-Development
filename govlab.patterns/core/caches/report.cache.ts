import { cacheFile, createFingerprintIndex, fingerprint, fingerprintOf } from "@govlab/content-fingerprint";
import { CACHE_NAME } from "#configuration/constants/report.constants";
import { existsSync } from "node:fs";
import { findingsPathOf } from "#core/loaders/finding.loader";

const PART_JOIN = ";";

export const openReportCache = function openReportCache(force: boolean): ReturnType<typeof createFingerprintIndex> {
    return createFingerprintIndex({ file: cacheFile(CACHE_NAME), force });
};

export const moduleFingerprint = function moduleFingerprint(
    files: readonly string[],
    fanIn: readonly [string, number][],
    cycles: readonly unknown[],
): string {
    const fan = fanIn.map(([key, count]) => `${key}=${count}`).sort((a, b) => a.localeCompare(b));
    const cyc = cycles.map((finding) => JSON.stringify(finding)).sort((a, b) => a.localeCompare(b));
    return fingerprintOf([fingerprint([...files]), fan.join(PART_JOIN), cyc.join(PART_JOIN)]);
};

export const hexArtifactsExist = function hexArtifactsExist(moduleDir: string): boolean {
    return existsSync(findingsPathOf(moduleDir));
};

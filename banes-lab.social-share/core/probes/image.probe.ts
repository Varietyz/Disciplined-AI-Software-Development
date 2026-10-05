import type { CardFinding, CardSpec } from "#types/card.types";
import { MILLISECONDS, SEAM_TOLERANCE } from "#configuration/constants/card.constants";
import { ANIMATION_OUT_OF_STEP } from "#configuration/strings/card.strings";
import { join } from "node:path";
import sharp from "sharp";

export const loopDurationOf = async function loopDurationOf(location: string): Promise<number> {
    const { delay } = await sharp(location, { animated: true }).metadata();
    return (delay ?? []).reduce((sum, value) => sum + value, 0);
};

const inStep = function inStep(cardMs: number, loopMs: number): boolean {
    if (loopMs <= 0) {
        return true;
    }
    const cycles = cardMs / loopMs;
    return Math.abs(cycles - Math.round(cycles)) <= SEAM_TOLERANCE && Math.round(cycles) >= 1;
};

export const animationFindings = async function animationFindings(
    specs: readonly CardSpec[],
    publicRoot: string,
): Promise<readonly CardFinding[]> {
    const checks = specs
        .filter((spec) => spec.timeline.loop && spec.timeline.frames > 1)
        .flatMap((spec) =>
            spec.layers.flatMap((layer) => (layer.kind === "animation" ? [{ source: layer.source, spec }] : [])),
        );
    const results = await Promise.all(
        checks.map(async ({ source, spec }) => {
            const cardMs = (spec.timeline.frames / spec.timeline.fps) * MILLISECONDS;
            const loopMs = await loopDurationOf(join(publicRoot, source));
            return inStep(cardMs, loopMs) ? null : { card: spec.id, message: ANIMATION_OUT_OF_STEP };
        }),
    );
    return results.filter((result): result is CardFinding => result !== null);
};

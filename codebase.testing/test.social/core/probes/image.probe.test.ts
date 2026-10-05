import { animationFindings, loopDurationOf } from "@banes-lab/social-share/core/probes/image.probe.ts";
import { describe, expect, it } from "vitest";
import { ANIMATION_OUT_OF_STEP } from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import type { CardInput } from "@banes-lab/social-share/types/card.types.ts";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import sharp from "sharp";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const FRAME_MS = 50;
const SOURCE = "/loop.gif";

const publicWith = async function publicWith(frames: number): Promise<string> {
    const folder = mkdtempSync(join(tmpdir(), "social-probe-"));
    const images = await Promise.all(
        Array.from({ length: frames }, async (_, index) =>
            sharp({ create: { background: { b: 0, g: 0, r: index * 40 }, channels: 3, height: 8, width: 8 } })
                .png()
                .toBuffer(),
        ),
    );
    const gif = await sharp(images, { join: { animated: true } })
        .gif({ delay: images.map(() => FRAME_MS), loop: 0 })
        .toBuffer();
    writeVerbatim(join(folder, SOURCE), gif);
    return folder;
};

const cardFor = function cardFor(frames: number): ReturnType<typeof createCard> {
    const input: CardInput = {
        alt: "A mark.",
        id: "mark",
        layers: [{ alt: "Mark", id: "mark", kind: "animation", placement: { x: 0, y: 0 }, source: SOURCE }],
        page: "home",
        stylesheet: "",
        timeline: { fps: 20, frames },
        tone: "page-gold",
    };
    return createCard(input);
};

describe("loopDurationOf and animationFindings", () => {
    it("measures an animation's own loop and passes a card that plays a whole number of them", async () => {
        const folder = await publicWith(4);
        expect(await loopDurationOf(join(folder, SOURCE))).toBe(4 * FRAME_MS);
        expect(await animationFindings([cardFor(8)], folder)).toStrictEqual([]);
    });

    it("reports a looping card whose duration cuts its animation's loop short", async () => {
        const folder = await publicWith(4);
        expect(await animationFindings([cardFor(6)], folder)).toStrictEqual([
            { card: "mark", message: ANIMATION_OUT_OF_STEP },
        ]);
    });
});

import { describe, expect, it } from "vitest";
import {
    evenSizeOf,
    imageFilesOf,
    isAnimated,
    outputsOf,
    profileOf,
    profilesOf,
    shareCandidatesOf,
    sizeOf,
} from "@banes-lab/social-share/core/converters/filename.converter.ts";
import type { CardInput } from "@banes-lab/social-share/types/card.types.ts";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";

const OG = { height: 630, id: "og", width: 1200 };

const input: CardInput = {
    alt: "A demo card.",
    id: "demo",
    layers: [{ id: "title", kind: "text", placement: { x: 0.5, y: 0.5 }, text: "Demo" }],
    page: "home",
    profiles: ["og"],
    stylesheet: "",
    timeline: { fps: 20, frames: 20 },
    tone: "page-gold",
};

const spec = createCard(input);

describe("sizeOf and evenSizeOf", () => {
    it("scales a profile and trims an odd side to the even size a video needs", () => {
        expect(sizeOf(OG, 0.75)).toStrictEqual({ height: 473, width: 900 });
        expect(evenSizeOf({ height: 473, width: 900 })).toStrictEqual({ height: 472, width: 900 });
        expect(evenSizeOf({ height: 630, width: 1200 })).toStrictEqual({ height: 630, width: 1200 });
    });
});

describe("imageFilesOf and shareCandidatesOf", () => {
    it("names every output by card, size and profile, the video by its even size", () => {
        expect(imageFilesOf(spec, OG).slice(0, 8)).toStrictEqual([
            "demo-w1200-h630.og.generated.png",
            "demo-w1200-h630.og.generated.gif",
            "demo-w1200-h630.og.generated.webp",
            "demo-w1200-h630.og.generated.mp4",
            "demo-w900-h473.og.generated.png",
            "demo-w900-h473.og.generated.gif",
            "demo-w900-h473.og.generated.webp",
            "demo-w900-h472.og.generated.mp4",
        ]);
        expect(imageFilesOf(spec, OG)).toHaveLength(16);
        expect(shareCandidatesOf(spec, OG)).toStrictEqual([
            "demo-w900-h473.og.generated.gif",
            "demo-w600-h315.og.generated.gif",
            "demo-w300-h158.og.generated.gif",
        ]);
    });

    it("names only stills for a card that does not move", () => {
        const still = createCard({ ...input, timeline: { frames: 1 } });
        expect(isAnimated(still)).toBe(false);
        expect(imageFilesOf(still, OG).every((file) => file.endsWith(".png"))).toBe(true);
        expect(shareCandidatesOf(still, OG)).toStrictEqual(["demo-w900-h473.og.generated.png"]);
    });
});

describe("profileOf, profilesOf and outputsOf", () => {
    it("pairs every encoded output of a rendered image with its file name", () => {
        const bytes = Buffer.from("x");
        const image = {
            animation: bytes,
            card: "demo",
            hash: "h",
            motion: null,
            profile: "og",
            scale: 0.75,
            still: bytes,
            video: bytes,
        };
        expect(outputsOf(image).map(([file, value]) => [file, value === null])).toStrictEqual([
            ["demo-w900-h473.og.generated.png", false],
            ["demo-w900-h473.og.generated.gif", false],
            ["demo-w900-h473.og.generated.webp", true],
            ["demo-w900-h472.og.generated.mp4", false],
        ]);
        expect(profilesOf(spec)).toStrictEqual([OG]);
        expect(() => profileOf("poster")).toThrow("poster");
    });
});

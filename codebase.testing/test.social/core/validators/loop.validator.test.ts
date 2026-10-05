import type { CardInput, Layer } from "@banes-lab/social-share/types/card.types.ts";
import { LOOP_SEAM, SHADER_READS_TIME } from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import { between, swing, wave } from "@banes-lab/social-share/core/evaluators/card.fragment.evaluator.ts";
import { describe, expect, it } from "vitest";
import { loopFindings, sameText, textTokens } from "@banes-lab/social-share/core/validators/loop.validator.ts";
import { PROFILES } from "@banes-lab/social-share/configuration/configs/card.config.ts";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";

const cardOf = function cardOf(layers: readonly Layer[], loop = true): ReturnType<typeof createCard> {
    const input: CardInput = {
        alt: "A loop.",
        id: "loop",
        layers,
        page: "home",
        stylesheet: "",
        timeline: { frames: 40, loop },
        tone: "page-gold",
    };
    return createCard(input);
};

describe("textTokens and sameText", () => {
    it("reads signed, fractional and exponent numbers and leaves a lone operator as text", () => {
        expect(textTokens("x - 0.5")).toStrictEqual(["x - ", 0.5, ""]);
        expect(textTokens("-2px")).toStrictEqual(["", -2, "px"]);
        expect(textTokens(".5 1.1e-16%")).toStrictEqual(["", 0.5, " ", 1.1e-16, "%"]);
        expect(textTokens("vec2f(uv.x - 0.5)")).toStrictEqual(["vec", 2, "f(uv.x - ", 0.5, ")"]);
    });

    it("treats numbers within the seam tolerance as the same and anything else as different", () => {
        expect(sameText("[1]", "[0.9999999999999999]")).toBe(true);
        expect(sameText("0%", "1.1102230246251565e-14%")).toBe(true);
        expect(sameText("12px", "13px")).toBe(false);
        expect(sameText("left", "center")).toBe(false);
    });
});

describe("loopFindings", () => {
    it("passes motion built from whole cycles of the loop, a crest sitting on the seam included", () => {
        const layers: readonly Layer[] = [
            {
                id: "orb",
                kind: "box",
                opacity: (frame) => wave(frame.progress, 2),
                placement: { x: (frame) => 0.5 + 0.1 * swing(frame.progress), y: 0 },
            },
            { id: "crest", kind: "box", placement: { x: (frame) => 0.5 + 0.1 * swing(frame.progress, 1, 0.25), y: 0 } },
        ];
        expect(loopFindings(cardOf(layers), PROFILES)).toStrictEqual([]);
    });

    it("names every layer whose last frame does not lead back to its first", () => {
        const layers: readonly Layer[] = [
            { id: "fade", kind: "box", opacity: (frame) => between(frame.progress, 0, 0.3), placement: { x: 0, y: 0 } },
            { id: "steady", kind: "box", placement: { x: 0, y: 0 } },
            { id: "half", kind: "box", placement: { x: (frame) => 0.5 + 0.1 * swing(frame.progress, 0.5), y: 0 } },
        ];
        expect(loopFindings(cardOf(layers), PROFILES)).toStrictEqual([`${LOOP_SEAM} fade, half`]);
    });

    it("reports a looping shader that reads the frame time, and ignores a card that plays once", () => {
        const shader: Layer = {
            id: "field",
            kind: "shader",
            placement: { x: 0, y: 0 },
            shader: "fn shade(uv: vec2f, frame: Frame) → vec4f { return vec4f(frame.time); }",
            uniforms: {},
        };
        expect(loopFindings(cardOf([shader]), PROFILES)).toStrictEqual([SHADER_READS_TIME]);
        expect(loopFindings(cardOf([shader], false), PROFILES)).toStrictEqual([]);
    });
});

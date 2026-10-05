import { describe, expect, it } from "vitest";
import {
    frameContext,
    resolveCard,
    resolveLayer,
    valueAt,
} from "@banes-lab/social-share/core/evaluators/card.evaluator.ts";
import type { EffectKind } from "@banes-lab/social-share/types/card.types.ts";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";

const PROFILE = { height: 630, id: "og", width: 1200 };

const isForgedEffect = function isForgedEffect(name: string): name is EffectKind {
    return name.length > 0;
};

const spec = createCard({
    alt: "A test card.",
    id: "test",
    layers: [
        {
            effects: [{ amount: (frame) => frame.progress * 10, kind: "blur" }],
            id: "title",
            kind: "text",
            opacity: (frame) => frame.progress,
            placement: { anchor: "center", x: 0.5, y: (frame) => frame.progress },
            style: { color: "red", fontSize: "12px" },
            text: (frame) => `frame ${String(frame.frame)}`,
        },
        { id: "field", kind: "shader", placement: { x: 0, y: 0 }, shader: "fn shade(", uniforms: { glow: 2 } },
    ],
    page: "home",
    stylesheet: "",
    timeline: { fps: 10, frames: 10 },
    tone: "page-gold",
});

describe("createCard", () => {
    it("fills the timeline and profiles from the output config", () => {
        expect(spec.timeline).toStrictEqual({ fps: 10, frames: 10, keyFrame: 0, loop: true });
        expect(spec.profiles).toStrictEqual(["og", "x", "square"]);
    });
});

describe("valueAt and frameContext", () => {
    it("resolves constants and computed expressions against a frame", () => {
        const frame = frameContext(spec, PROFILE, 5);
        expect(frame).toStrictEqual({ frame: 5, frames: 10, profile: PROFILE, progress: 0.5, t: 0.5 });
        expect(valueAt(3, frame)).toBe(3);
        expect(valueAt((context) => context.t * 2, frame)).toBe(1);
    });
});

describe("resolveCard", () => {
    it("resolves every expression of every layer at a frame, fractional frames included", () => {
        const card = resolveCard(spec, PROFILE, 2.5);
        const [title, field] = card.layers;
        expect(card.progress).toBe(0.25);
        expect(card.tone).toBe("page-gold");
        expect(title?.content).toBe("frame 2.5");
        expect(title?.opacity).toBe(0.25);
        expect(title?.placement.y).toBe(0.25);
        expect(title?.filter).toBe("blur(2.5px)");
        expect(title?.style).toStrictEqual({ color: "red", fontSize: "12px" });
        expect(field?.uniforms).toStrictEqual([2]);
        expect(field?.content).toBe("fn shade(");
    });

    it("throws on an effect outside the vocabulary", () => {
        const frame = frameContext(spec, PROFILE, 0);
        const [attempt] = ["sparkle"]
            .filter(isForgedEffect)
            .map(
                (kind) => () =>
                    resolveLayer(
                        { effects: [{ amount: 1, kind }], id: "bad", kind: "box", placement: { x: 0, y: 0 } },
                        frame,
                    ),
            );
        expect(attempt).toThrow("sparkle");
    });
});

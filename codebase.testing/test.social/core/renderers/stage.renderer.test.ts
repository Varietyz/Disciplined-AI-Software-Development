import {
    ANIMATION_FAILED,
    MISSING_LAYER,
    NEEDS_WEBGPU,
} from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import type { Anchor, CardInput } from "@banes-lab/social-share/types/card.types.ts";
import { describe, expect, it, vi } from "vitest";
import { createAnimationPass } from "@banes-lab/social-share/core/renderers/image.renderer.ts";
import { createCard } from "@banes-lab/social-share/core/factories/card.factory.ts";
import { createShaderPass } from "@banes-lab/social-share/core/renderers/shader.renderer.ts";
import { mountCard } from "@banes-lab/social-share/core/renderers/stage.renderer.ts";
import { resolveCard } from "@banes-lab/social-share/core/evaluators/card.evaluator.ts";

const PROFILE = { height: 630, id: "og", width: 1200 };

const isForgedAnchor = function isForgedAnchor(name: string): name is Anchor {
    return name.length > 0;
};

const input: CardInput = {
    alt: "A demo card.",
    id: "demo",
    layers: [
        { className: "demo-ground", id: "ground", kind: "box", placement: { height: 1, width: 1, x: 0, y: 0 } },
        {
            alt: "Mark",
            id: "mark",
            kind: "image",
            placement: { anchor: "center", x: 0.5, y: 0.5 },
            source: "/mark.png",
        },
        {
            id: "title",
            kind: "text",
            placement: { x: 0.1, y: 0.2 },
            style: { fontSize: "40px" },
            text: (frame) => `frame ${String(frame.frame)}`,
        },
    ],
    page: "home",
    stylesheet: ".card-demo { color: red; }",
    timeline: { fps: 10, frames: 10 },
    tone: "page-gold",
};

const spec = createCard(input);

describe("mountCard", () => {
    it("builds one element per layer inside a sized card root with the card stylesheet", () => {
        const host = document.createElement("main");
        const mounted = mountCard(host, resolveCard(spec, PROFILE, 0));
        expect(mounted.element.classList.contains("card-demo")).toBe(true);
        expect(mounted.element.classList.contains("page-gold")).toBe(true);
        expect(mounted.element.querySelector("style")?.textContent).toBe(".card-demo { color: red; }");
        expect(mounted.element.querySelector("img")?.getAttribute("src")).toBe("/mark.png");
        expect(mounted.element.querySelectorAll(".card-layer")).toHaveLength(3);
        expect(host.contains(mounted.element)).toBe(true);
    });

    it("repaints text for each frame and resolves once nothing is pending", async () => {
        const mounted = mountCard(document.createElement("main"), resolveCard(spec, PROFILE, 0));
        await mounted.ready();
        await mounted.paint(resolveCard(spec, PROFILE, 4));
        expect(mounted.element.textContent).toContain("frame 4");
    });

    it("throws when a frame names a layer the card never mounted", async () => {
        const mounted = mountCard(document.createElement("main"), resolveCard(spec, PROFILE, 0));
        const grown = createCard({
            ...input,
            layers: [...input.layers, { id: "late", kind: "box", placement: { x: 0, y: 0 } }],
        });
        await expect(mounted.paint(resolveCard(grown, PROFILE, 0))).rejects.toThrow(MISSING_LAYER);
    });

    it("throws on a placement anchor outside the vocabulary", async () => {
        const [odd] = ["middle"]
            .filter(isForgedAnchor)
            .map((anchor) =>
                createCard({ ...input, layers: [{ id: "odd", kind: "box", placement: { anchor, x: 0, y: 0 } }] }),
            );
        if (odd === undefined) {
            throw new Error("the forged anchor was filtered out");
        }
        const mounted = mountCard(document.createElement("main"), resolveCard(odd, PROFILE, 0));
        await expect(mounted.paint(resolveCard(odd, PROFILE, 0))).rejects.toThrow("middle");
    });

    it("shows and logs a reported failure on the card", () => {
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const mounted = mountCard(document.createElement("main"), resolveCard(spec, PROFILE, 0));
        expect(mounted.report(new Error("broken"))).toBe("demo broken");
        expect(mounted.element.querySelector(".stage-findings")?.textContent).toBe("demo broken");
        expect(logged).toHaveBeenCalledWith("demo broken");
        logged.mockRestore();
    });

    it("shows and logs one failure once however often it is reported", () => {
        const logged = vi.spyOn(console, "error").mockReturnValue();
        const mounted = mountCard(document.createElement("main"), resolveCard(spec, PROFILE, 0));
        mounted.report(new Error("broken"));
        mounted.report(new Error("broken"));
        expect(mounted.element.querySelectorAll(".stage-findings")).toHaveLength(1);
        expect(logged).toHaveBeenCalledTimes(1);
        logged.mockRestore();
    });
});

describe("createAnimationPass", () => {
    it("refuses loudly when the canvas offers no drawing context", async () => {
        await expect(createAnimationPass(document.createElement("canvas"), "/mark.gif")).rejects.toThrow(
            ANIMATION_FAILED,
        );
    });
});

describe("createShaderPass", () => {
    it("refuses loudly when the browser provides no WebGPU", async () => {
        await expect(createShaderPass(document.createElement("canvas"), "")).rejects.toThrow(NEEDS_WEBGPU);
    });

    it("surfaces the missing GPU through a mounted shader card's readiness", async () => {
        const shaded = createCard({
            ...input,
            layers: [
                {
                    id: "field",
                    kind: "shader",
                    placement: { height: 1, width: 1, x: 0, y: 0 },
                    shader: "",
                    uniforms: {},
                },
            ],
        });
        const mounted = mountCard(document.createElement("main"), resolveCard(shaded, PROFILE, 0));
        await expect(mounted.ready()).rejects.toThrow(NEEDS_WEBGPU);
    });
});

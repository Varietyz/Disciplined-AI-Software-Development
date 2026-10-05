import { definePatternFace, foldFaces, registeredFaces } from "@govlab/patterns/core/registries/pattern.registry.ts";
import { describe, expect, it } from "vitest";
import { faceRegistered } from "@govlab/patterns/configuration/strings/pattern.strings.ts";

const context = {};

describe("the pattern face registry", () => {
    it("registers a face once and refuses a second registration under the same name", () => {
        const face = definePatternFace({ build: () => "port", name: "probe-face" });
        expect(registeredFaces()).toContain(face);
        expect(() => definePatternFace({ build: () => "again", name: "probe-face" })).toThrow(
            faceRegistered("probe-face"),
        );
    });

    it("folds faces in dependency order, handing each its built dependencies", () => {
        const built = foldFaces(
            [
                {
                    build: (_context, dependencies) => `top(${String(dependencies["base"])})`,
                    dependsOn: ["base"],
                    name: "top",
                },
                { build: () => "base-port", name: "base" },
            ],
            context,
        );
        expect(built.get("top")).toBe("top(base-port)");
    });

    it("refuses a dependency cycle and an unregistered dependency", () => {
        const cycle = [
            { build: () => 1, dependsOn: ["b"], name: "a" },
            { build: () => 2, dependsOn: ["a"], name: "b" },
        ];
        expect(() => foldFaces(cycle, context)).toThrow("cycle");
        expect(() => foldFaces([{ build: () => 1, dependsOn: ["ghost"], name: "a" }], context)).toThrow(
            "not registered",
        );
    });
});

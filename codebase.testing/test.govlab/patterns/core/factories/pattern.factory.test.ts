import { describe, expect, it } from "vitest";
import { createGovlabPatterns } from "@govlab/patterns/core/factories/pattern.factory.ts";
import { registeredFaces } from "@govlab/patterns/core/registries/pattern.registry.ts";

describe("createGovlabPatterns", () => {
    it("folds every registered face into one frozen port", () => {
        const lab = createGovlabPatterns();
        expect(lab.faces).toStrictEqual(registeredFaces().map((face) => face.name));
        expect(Object.isFrozen(lab)).toBe(true);
    });

    it("accepts an injected logger without calling it while folding", () => {
        const warnings: string[] = [];
        createGovlabPatterns({
            logger: {
                warn(message) {
                    warnings.push(message);
                },
            },
        });
        expect(warnings).toStrictEqual([]);
    });
});

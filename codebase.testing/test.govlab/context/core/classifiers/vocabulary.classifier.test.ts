import { describe, expect, it } from "vitest";
import { classifyForce } from "@govlab/context/core/classifiers/vocabulary.classifier.ts";

describe("classifyForce", () => {
    it("classifies a canonical force and leaves a variant spelling unknown", () => {
        expect(classifyForce("object_creation")).not.toBe("unknown");
        expect(classifyForce("object creation")).toBe("unknown");
    });
});

import { describe, expect, it } from "vitest";
import { executableDocuments } from "@govlab/context/core/loaders/document.loader.ts";

describe("executableDocuments", () => {
    it("finds the agents and the templates on disk", () => {
        const sources = executableDocuments();
        expect(sources.some((source) => source.kind === "agent")).toBe(true);
        expect(sources.some((source) => source.kind === "template")).toBe(true);
    });
});

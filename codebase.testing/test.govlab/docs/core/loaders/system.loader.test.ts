import { describe, expect, it } from "vitest";
import { buildSystemModel } from "@govlab/docs/core/loaders/system.loader.ts";

const model = buildSystemModel();
const componentIds = new Set((model.components ?? []).map((component) => component.id));

describe("buildSystemModel", () => {
    it("names the workspace and derives a component per member", () => {
        expect(model.name.length).toBeGreaterThan(0);
        expect(componentIds.size).toBeGreaterThan(0);
        expect([...componentIds].every((id) => id.length > 0)).toBe(true);
    });

    it("groups only non-empty member lists inside each trust boundary and records what it defers", () => {
        expect((model.trustBoundaries ?? []).every((boundary) => boundary.components.length > 0)).toBe(true);
        expect((model.runtimeDeferred ?? []).length).toBeGreaterThan(0);
    });
});

import { describe, expect, it } from "vitest";
import {
    loadFaces,
    readModelTemplate,
    readModels,
    readOperatorProfile,
    readSeeds,
    seedsTarget,
} from "@banes-lab/content/core/loaders/seed.loader.ts";

describe("loadFaces", () => {
    it("loads the algorithm and architecture collections with their data", () => {
        const faces = loadFaces();
        expect(faces.algo.query({ meta: true }).length).toBeGreaterThan(0);
        expect(faces.arch.all().length).toBeGreaterThan(0);
    });
});

describe("readModelTemplate, readModels and readOperatorProfile", () => {
    it("reads the coordination surface's model template and models and the operator profile whole", () => {
        expect(readModelTemplate().length).toBeGreaterThan(0);
        const models = readModels();
        expect(models.length).toBeGreaterThan(0);
        expect(models.every((model) => model.path.endsWith(".model.md"))).toBe(true);
        expect(readOperatorProfile().text).toContain("# How the work is reasoned");
    });
});

describe("seedsTarget and readSeeds", () => {
    it("resolves the seeds report by key and reads back a shaped report or null", () => {
        expect(seedsTarget()).toContain("lesson-seeds");
        const held = readSeeds();
        expect(held === null || Array.isArray(held.seeds)).toBe(true);
    });
});

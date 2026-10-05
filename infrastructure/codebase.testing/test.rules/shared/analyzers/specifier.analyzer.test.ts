import {
    applicationImporters,
    gateTargets,
    reachedUnder,
    scriptTargets,
    specifierTarget,
} from "@ssot/govlab/shared/analyzers/specifier.analyzer.ts";
import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";

const posix = function posix(file: string): string {
    return file.split("\\").join("/");
};

const BUILD = posix(absolutePath("app.build"));
const WEB = posix(absolutePath("app.member"));
const PLUGIN = `${BUILD}/core/plugins/site.plugin.ts`;
const COORDINATOR = `${BUILD}/core/coordinators/anatomy.coordinator.ts`;

describe("specifierTarget", () => {
    it("resolves a relative climb, a member's own subpath import and a sibling's package specifier to one file", () => {
        expect(specifierTarget(PLUGIN, "../coordinators/anatomy.coordinator.ts")).toBe(COORDINATOR);
        expect(specifierTarget(PLUGIN, "#core/coordinators/anatomy.coordinator")).toBe(COORDINATOR);
        expect(specifierTarget(`${WEB}/vite.config.ts`, "@banes-lab/build-scripts/core/plugins/site.plugin.ts")).toBe(
            PLUGIN,
        );
        expect(specifierTarget(PLUGIN, "node:fs")).toBeNull();
    });
});

describe("applicationImporters and reachedUnder", () => {
    it("lists who imports a file and walks the imports that enter a folder from outside it", () => {
        expect(applicationImporters().get(COORDINATOR)?.length ?? 0).toBeGreaterThan(0);
        const reached = reachedUnder(BUILD, new Set());
        expect(reached.has(PLUGIN)).toBe(true);
        expect(reached.has(COORDINATOR)).toBe(true);
    });
});

describe("scriptTargets and gateTargets", () => {
    it("names the files a package script or a gate step runs", () => {
        expect([...scriptTargets()].some((file) => file.endsWith("/runtime/entrypoints/server.entrypoint.ts"))).toBe(
            true,
        );
        expect([...gateTargets()].some((file) => file.endsWith("/runtime/entrypoints/validation.entrypoint.ts"))).toBe(
            true,
        );
    });
});

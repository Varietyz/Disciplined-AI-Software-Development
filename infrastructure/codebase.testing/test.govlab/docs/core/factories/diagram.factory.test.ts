import { absolutePath, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import {
    diagramContextFor,
    loadPackage,
    packageName,
    scriptsOf,
    shapedContext,
} from "@govlab/docs/core/factories/diagram.factory.ts";

const GRAPH_TIMEOUT_MS = 60_000;

describe("the package readers", () => {
    it("read a package, fall back on a missing name and keep only string scripts", () => {
        expect(loadPackage(absolutePath("govlab.docs"))["name"]).toBe("@govlab/docs");
        expect(loadPackage(absolutePath("docArch"))).toStrictEqual({});
        expect(packageName({}, "fallback")).toBe("fallback");
        expect(scriptsOf({ scripts: { broken: 1, build: "tsc" } })).toStrictEqual({ scripts: { build: "tsc" } });
        expect(scriptsOf({})).toStrictEqual({});
    });
});

describe("shapedContext", () => {
    it("pairs a shape with its layout", () => {
        const shaped = shapedContext("leaf");
        expect(shaped.shape).toBe("leaf");
        expect(shaped.layout.nodeCap).toBeGreaterThan(0);
    });
});

describe("diagramContextFor", () => {
    it(
        "derives the context of a module and none for a folder with nothing to draw",
        async () => {
            const context = await diagramContextFor(absolutePath("govlab.context"), "govlab.context");
            expect(context?.moduleName).toBe("@govlab/context");
            expect(context?.codeGraph).not.toBeNull();
            expect(await diagramContextFor(absolutePath("docArch"), relativePath("docArch"))).toBeNull();
        },
        GRAPH_TIMEOUT_MS,
    );
});

import {
    PLATFORM_PATH_PREFIXES,
    PRODUCT_PATH_PREFIXES,
    STRING_LAYERS,
    TYPE_LAYERS,
    classifyFile,
    normalizePath,
    relativeFromMember,
    resolveImportPath,
} from "@ssot/govlab/shared/manifests/layer.manifest.ts";
import { describe, expect, it } from "vitest";
import { GOVERNED_ROOT } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import { join } from "node:path";

describe("the declared tier prefixes", () => {
    it("assigns each container to exactly one tier", () => {
        expect(PLATFORM_PATH_PREFIXES.length).toBeGreaterThan(0);
        expect(PRODUCT_PATH_PREFIXES.length).toBeGreaterThan(0);
        const overlap = PLATFORM_PATH_PREFIXES.filter((prefix) => PRODUCT_PATH_PREFIXES.includes(prefix));
        expect(overlap).toStrictEqual([]);
    });

    it("ends every prefix with a separator, so a prefix cannot half-match a sibling folder", () => {
        expect([...PLATFORM_PATH_PREFIXES, ...PRODUCT_PATH_PREFIXES].every((prefix) => prefix.endsWith("/"))).toBe(
            true,
        );
    });
});

describe("the per-file override maps", () => {
    it("hold only files the developer verified, and classify a listed strings file by its entry", () => {
        expect([...STRING_LAYERS.values()]).toStrictEqual(["platform"]);
        expect(TYPE_LAYERS.size).toBe(0);
        const [listed] = [...STRING_LAYERS.keys()];
        expect(classifyFile(`${GOVERNED_ROOT}/${listed ?? ""}`)).toBe("platform");
    });
});

describe("normalizePath and relativeFromMember", () => {
    it("strips the member prefix rather than a segment that merely looks like it", () => {
        expect(normalizePath(join("a", "b"))).toBe(["a", "b"].join("/"));
        expect(relativeFromMember(`${GOVERNED_ROOT}/core/registries/probe.ts`)).toBe("core/registries/probe.ts");
    });

    it("leaves a path outside the member untouched", () => {
        expect(relativeFromMember("elsewhere/probe.ts")).toBe("elsewhere/probe.ts");
    });
});

describe("resolveImportPath", () => {
    it("resolves a relative import to a member-relative file", () => {
        expect(resolveImportPath("core/registries/probe.ts", "./other.ts")).toBe("core/registries/other.ts");
    });

    it("resolves a climbing import", () => {
        expect(resolveImportPath("core/registries/probe.ts", "../buses/other.ts")).toBe("core/buses/other.ts");
    });

    it("refuses a package specifier", () => {
        expect(resolveImportPath("core/registries/probe.ts", "@scope/pkg")).toBeNull();
    });
});

const inMember = (...segments: string[]): string => `${GOVERNED_ROOT}/${segments.join("/")}`;

describe("tier classification resolves against the governed member root", () => {
    it("strips the member prefix rather than a segment that no longer exists", () => {
        expect(relativeFromMember(inMember("core", "registries", "base.registry.ts"))).toBe(
            ["core", "registries", "base.registry.ts"].join("/"),
        );
    });

    it("classifies the reusable container as platform", () => {
        expect(classifyFile(inMember("core", "registries", "base.registry.ts"))).toBe("platform");
        expect(classifyFile(inMember("core", "buses", "base.bus.ts"))).toBe("platform");
    });

    it("classifies the application containers as product, the composition root included", () => {
        expect(classifyFile(inMember("domain", "models", "base.model.ts"))).toBe("product");
        expect(classifyFile(inMember("runtime", "entrypoints", "base.entrypoint.ts"))).toBe("product");
    });

    it("defaults the strings surface to product, since copy is application-specific", () => {
        expect(classifyFile(inMember("configuration", "strings", "base.strings.ts"))).toBe("product");
    });

    it("leaves an undeclared type file unclassified so the drift gate can catch it", () => {
        expect(classifyFile(inMember("types", "base.types.ts"))).toBeNull();
    });
});

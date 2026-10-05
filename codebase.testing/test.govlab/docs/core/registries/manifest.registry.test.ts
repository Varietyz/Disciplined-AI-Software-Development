import { describe, expect, it } from "vitest";
import type { ManifestModule } from "@govlab/docs/types/manifest.types.ts";
import { ManifestRegistry } from "@govlab/docs/core/registries/manifest.registry.ts";

const REGISTRY_TIMEOUT_MS = 60_000;

const moduleOf = function moduleOf(slug: string, manifest: Record<string, unknown>, deps: string[]): ManifestModule {
    return {
        dir: slug,
        group: slug === "app" ? "apps" : "utils",
        label: slug,
        manifest,
        pkg: { dependencies: Object.fromEntries(deps.map((dep) => [dep, "*"])) },
        relPath: slug,
        slug,
    };
};

const SHAPED = { label: "m", maturity: "stable", summary: "A module.", visibility: { hidden: false, private: false } };
const MODULES = [
    moduleOf("app", { ...SHAPED, capabilities: ["render"], domains: [{ meta: "ai", sub: "agents" }] }, [
        "@govlab/core",
    ]),
    moduleOf("core", { ...SHAPED, visibility: { hidden: false, private: true } }, ["@govlab/leaf", "zod"]),
    moduleOf("leaf", { ...SHAPED, maturity: "experimental" }, []),
];
const registry = new ManifestRegistry(MODULES, [
    {
        contribute: (_manifest, entry) => {
            Object.assign(entry, { tagged: true });
        },
        name: "tag",
    },
    { filter: (_manifest, module) => module?.slug === "leaf", name: "hide-leaf" },
]);

describe("ManifestRegistry", () => {
    it("resolves transitive sibling requirements", () => {
        expect(registry.requires("app")).toStrictEqual(["core", "leaf"]);
        expect(registry.requires("leaf")).toStrictEqual([]);
    });

    it("queries by group, maturity, capability, domain and visibility", () => {
        const slugs = (criteria: Parameters<ManifestRegistry["query"]>[0]): string[] =>
            registry.query(criteria).map((module) => module.slug);
        expect(slugs({ group: "apps" })).toStrictEqual(["app"]);
        expect(slugs({ maturity: "experimental" })).toStrictEqual(["leaf"]);
        expect(slugs({ capability: "render", domain: "ai" })).toStrictEqual(["app"]);
        expect(slugs({ visibility: "private" })).toStrictEqual(["core"]);
        expect(slugs({ visibility: "public" })).toStrictEqual(["app", "leaf"]);
    });

    it("builds the catalog through each plugin's filter and contribution", () => {
        expect(registry.catalog()).toStrictEqual([
            { category: "apps", tagged: true, value: "app" },
            { category: "utils", tagged: true, value: "core" },
        ]);
        expect(registry.validateAll()).toStrictEqual(["app: unknown key 'domains'"]);
    });

    it(
        "creates itself from the workspace manifests and plugins",
        async () => {
            const live = await ManifestRegistry.create();
            expect(live.modules.length).toBeGreaterThan(0);
            expect(live.plugins.length).toBeGreaterThan(0);
        },
        REGISTRY_TIMEOUT_MS,
    );
});

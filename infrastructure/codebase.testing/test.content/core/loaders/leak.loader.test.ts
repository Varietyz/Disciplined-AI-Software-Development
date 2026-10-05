import {
    anatomyVocabulary,
    deriveLeakSet,
    leakTarget,
    readLeakSet,
    workspaceRoots,
} from "@banes-lab/content/core/loaders/leak.loader.ts";
import { describe, expect, it } from "vitest";
import type { Inventory } from "@banes-lab/content/types/inventory.types.ts";
import type { SeedReport } from "@banes-lab/content/types/lesson.types.ts";
import { relativePath } from "@ssot/paths";

const INVENTORY: Inventory = {
    records: [
        {
            always: null,
            directive: "a claim stays unverified until read",
            gate: null,
            kind: "rule",
            locked: false,
            never: null,
            slug: "fixture_claims_are_lies",
            source: "fixture",
            tier: "Always",
        },
        {
            always: "fixture-boundary (all-or-nothing)",
            directive: "NEVER partial-commit (corruption) → ALWAYS fixture-boundary (all-or-nothing)",
            gate: null,
            kind: "avoidance",
            locked: false,
            never: "partial-commit (corruption)",
            slug: "fixture_no_partial_commit",
            source: "fixture",
            tier: "RULE",
        },
    ],
    sources: [{ lines: 2, path: "fixture", records: 2 }],
};

const SEEDS: SeedReport = {
    incomplete: [],
    seeds: [
        {
            application: [],
            boundary: null,
            cause: [],
            decision: "",
            domain: "fixture",
            failureMode: null,
            id: "fixture.seed",
            level: "principles",
            principle: "",
            problem: null,
            source: "profile",
            validation: null,
        },
        {
            application: [],
            boundary: null,
            cause: [],
            decision: "",
            domain: "fixture",
            failureMode: null,
            id: "fixture-boundary",
            level: "principles",
            principle: "",
            problem: null,
            source: "algorithms",
            validation: null,
        },
        {
            application: [],
            boundary: null,
            cause: [],
            decision: "",
            domain: "fixture",
            failureMode: null,
            id: "single-responsibility",
            level: "principles",
            principle: "",
            problem: null,
            source: "algorithms",
            validation: null,
        },
    ],
};

describe("deriveLeakSet", () => {
    const leaks = deriveLeakSet(INVENTORY, SEEDS);

    it("carries the inventory slugs and the seed ids", () => {
        expect(leaks.tokens).toContain("fixture_claims_are_lies");
        expect(leaks.tokens).toContain("fixture.seed");
    });

    it("leaves out a token the published ontology carries as an id or inside its prose, whatever source also names it", () => {
        expect(leaks.tokens).not.toContain("single-responsibility");
        expect(leaks.tokens).not.toContain("auto-fix");
    });

    it("leaves out the published avoidance rules, their short codes and the constructs they name", () => {
        expect(leaks.tokens).not.toContain("fixture-boundary");
        expect(leaks.tokens).not.toContain("fixture_no_partial_commit");
        expect(leaks.tokens).toContain("fixture_claims_are_lies");
    });

    it("carries the declared members, the gate labels and the local rule ids", () => {
        expect(leaks.tokens).toContain(relativePath("app.member").split("/").at(-1));
        expect(leaks.tokens).toContain("Build site");
        expect(leaks.tokens).toContain("closure-paths-via-ssot");
    });

    it("leaves out every folder, file and definition name the anatomy page publishes from its own tree", () => {
        expect(anatomyVocabulary()).toContain("createElement");
        expect(leaks.tokens).not.toContain("strings");
        expect(leaks.tokens).not.toContain("createElement");
        expect(leaks.tokens).not.toContain("element.factory.ts");
    });

    it("names every source it drew from", () => {
        expect(leaks.sources.length).toBeGreaterThan(5);
        expect(leaks.sources.every((source) => source.tokens > 0)).toBe(true);
    });
});

describe("leakTarget, readLeakSet and workspaceRoots", () => {
    it("resolves the target under the content reports and reads back a shaped set or null", () => {
        expect(leakTarget()).toContain("leak-set");
        const held = readLeakSet();
        expect(held === null || Array.isArray(held.tokens)).toBe(true);
    });

    it("derives the first segments of every workspace member and governed root", () => {
        const roots = workspaceRoots();
        expect(roots.has(relativePath("app.root"))).toBe(true);
        expect(roots.has(relativePath("govlabHost.root"))).toBe(true);
    });
});
